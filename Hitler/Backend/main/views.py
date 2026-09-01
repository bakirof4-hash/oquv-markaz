import json

from django.contrib.auth import authenticate, get_user_model
from django.core import signing
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_http_methods

from .models import ContactMessage, UserProfile, Course, Instructor, Video


UserModel = get_user_model()


def home(request):
    return HttpResponse('Django backend is running.')


def _parse_json(request):
    if not request.body:
        return {}
    try:
        return json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return None


def _user_payload(user):
    profile = getattr(user, 'profile', None)
    role = profile.role if profile else 'student'
    phone = profile.phone if profile else ''
    return {
        'id': user.id,
        'name': f'{user.first_name} {user.last_name}'.strip() or user.username,
        'email': user.email,
        'phone': phone,
        'role': role,
    }


def _get_token_from_request(request):
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Bearer '):
        return auth_header.removeprefix('Bearer ').strip()
    return auth_header.strip()


def _get_user_from_request(request):
    token = _get_token_from_request(request)
    if not token:
        return None

    try:
        payload = signing.loads(token)
    except signing.BadSignature:
        return None

    user_id = payload.get('user_id')
    if not user_id:
        return None

    try:
        return UserModel.objects.get(id=user_id)
    except UserModel.DoesNotExist:
        return None


@csrf_exempt
@require_POST
def register_view(request):
    data = _parse_json(request)
    if data is None:
        return JsonResponse({'message': 'Invalid JSON.'}, status=400)

    name = (data.get('name') or '').strip()
    phone = (data.get('phone') or '').strip()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not name or not phone or not email or not password:
        return JsonResponse({'message': 'Barcha maydonlarni to\'ldiring.'}, status=400)

    if UserModel.objects.filter(username=email).exists():
        return JsonResponse({'message': 'Bu email allaqachon ro\'yxatdan o\'tgan.'}, status=400)

    first_name, *rest = name.split(' ', 1)
    last_name = rest[0] if rest else ''
    user = UserModel.objects.create_user(username=email, email=email, password=password, first_name=first_name, last_name=last_name)
    UserProfile.objects.create(user=user, phone=phone, role='student')
    token = signing.dumps({'user_id': user.id})

    return JsonResponse({
        'message': 'Ro\'yxatdan o\'tish muvaffaqiyatli yakunlandi.',
        'token': token,
        'user': _user_payload(user),
    }, status=201)


@csrf_exempt
@require_POST
def login_view(request):
    data = _parse_json(request)
    if data is None:
        return JsonResponse({'message': 'Invalid JSON.'}, status=400)

    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or not password:
        return JsonResponse({'message': 'Email va parolni kiriting.'}, status=400)

    user = authenticate(request, username=email, password=password)
    if user is None:
        return JsonResponse({'message': 'Email yoki parol noto\'g\'ri.'}, status=400)

    token = signing.dumps({'user_id': user.id})
    return JsonResponse({
        'message': 'Kirish muvaffaqiyatli.',
        'token': token,
        'user': _user_payload(user),
    })


@csrf_exempt
@require_POST
def contact_view(request):
    data = _parse_json(request)
    if data is None:
        return JsonResponse({'message': 'Invalid JSON.'}, status=400)

    name = (data.get('name') or '').strip()
    phone = (data.get('phone') or '').strip()
    email = (data.get('email') or '').strip()
    message = (data.get('message') or '').strip()

    if not name or not phone:
        return JsonResponse({'message': 'Ism va telefon majburiy.'}, status=400)

    item = ContactMessage.objects.create(name=name, phone=phone, email=email, message=message)
    return JsonResponse({
        'message': 'Xabar qabul qilindi.',
        'contact': {
            'id': item.id,
            'name': item.name,
            'phone': item.phone,
            'email': item.email,
            'message': item.message,
        }
    }, status=201)


def admin_stats_view(request):
    user = _get_user_from_request(request)
    if user is None:
        return JsonResponse({'message': 'Unauthorized.'}, status=401)

    profile = getattr(user, 'profile', None)
    if profile is None or profile.role != 'admin':
        return JsonResponse({'message': 'Forbidden.'}, status=403)

    return JsonResponse({
        'students': UserProfile.objects.filter(role='student').count(),
        'admins': UserProfile.objects.filter(role='admin').count(),
        'users': UserProfile.objects.count(),
        'messages': ContactMessage.objects.count(),
    })

def serialize_course(c):
    return {
        '_id': c.id,
        'title': c.title,
        'category': c.category,
        'desc': c.desc,
        'duration': c.duration,
        'price': c.price,
        'isPopular': c.isPopular,
        'icon': c.icon,
        'badgeColor': c.badgeColor,
        'mentorName': c.mentorName,
        'mentorRole': c.mentorRole,
        'mentorExp': c.mentorExp,
        'mentorGrad': c.mentorGrad,
        'mentorInitials': c.mentorInitials,
        'videos': [{'title': v.title, 'url': v.url} for v in c.videos.all()]
    }

@csrf_exempt
@require_http_methods(["GET", "POST"])
def courses_view(request):
    if request.method == 'GET':
        courses = Course.objects.all()
        return JsonResponse([serialize_course(c) for c in courses], safe=False)
    
    if request.method == 'POST':
        user = _get_user_from_request(request)
        if not user or getattr(user, 'profile', None) is None or getattr(user, 'profile').role not in ['admin', 'teacher']:
            return JsonResponse({'message': 'Forbidden'}, status=403)
        data = _parse_json(request)
        c = Course.objects.create(
            title=data.get('title', ''), category=data.get('category', ''), desc=data.get('desc', ''),
            duration=data.get('duration', ''), price=data.get('price', ''), isPopular=data.get('isPopular', False),
            icon=data.get('icon', ''), badgeColor=data.get('badgeColor', ''), mentorName=data.get('mentorName', ''),
            mentorRole=data.get('mentorRole', ''), mentorExp=data.get('mentorExp', ''),
            mentorGrad=data.get('mentorGrad', ''), mentorInitials=data.get('mentorInitials', '')
        )
        return JsonResponse(serialize_course(c), status=201)

@csrf_exempt
@require_http_methods(["PUT", "DELETE"])
def course_detail_view(request, pk):
    user = _get_user_from_request(request)
    if not user or getattr(user, 'profile', None) is None or getattr(user, 'profile').role not in ['admin', 'teacher']:
        return JsonResponse({'message': 'Forbidden'}, status=403)
        
    try:
        c = Course.objects.get(id=pk)
    except Course.DoesNotExist:
        return JsonResponse({'message': 'Not found'}, status=404)
        
    if request.method == 'PUT':
        data = _parse_json(request)
        c.title = data.get('title', c.title)
        c.category = data.get('category', c.category)
        c.desc = data.get('desc', c.desc)
        c.duration = data.get('duration', c.duration)
        c.price = data.get('price', c.price)
        c.isPopular = data.get('isPopular', c.isPopular)
        c.icon = data.get('icon', c.icon)
        c.badgeColor = data.get('badgeColor', c.badgeColor)
        c.mentorName = data.get('mentorName', c.mentorName)
        c.mentorRole = data.get('mentorRole', c.mentorRole)
        c.mentorExp = data.get('mentorExp', c.mentorExp)
        c.mentorGrad = data.get('mentorGrad', c.mentorGrad)
        c.mentorInitials = data.get('mentorInitials', c.mentorInitials)
        c.save()
        return JsonResponse(serialize_course(c))
        
    if request.method == 'DELETE':
        c.delete()
        return JsonResponse({'message': 'Deleted'})

@csrf_exempt
@require_POST
def course_video_view(request, pk):
    user = _get_user_from_request(request)
    if not user or getattr(user, 'profile', None) is None or getattr(user, 'profile').role not in ['admin', 'teacher']:
        return JsonResponse({'message': 'Forbidden'}, status=403)
        
    try:
        c = Course.objects.get(id=pk)
    except Course.DoesNotExist:
        return JsonResponse({'message': 'Not found'}, status=404)
        
    data = _parse_json(request)
    Video.objects.create(course=c, title=data.get('title', ''), url=data.get('url', ''))
    return JsonResponse({'message': 'Video added'})

def serialize_instructor(i):
    return {
        '_id': i.id,
        'name': i.name,
        'role': i.role,
        'exp': i.exp,
        'grad': i.grad,
        'initials': i.initials
    }

@csrf_exempt
@require_http_methods(["GET", "POST"])
def instructors_view(request):
    if request.method == 'GET':
        instructors = Instructor.objects.all()
        return JsonResponse([serialize_instructor(i) for i in instructors], safe=False)
        
    if request.method == 'POST':
        user = _get_user_from_request(request)
        if not user or getattr(user, 'profile', None) is None or getattr(user, 'profile').role != 'admin':
            return JsonResponse({'message': 'Forbidden'}, status=403)
        
        data = _parse_json(request)
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        # Create User if email provided
        created_user = None
        if email and password:
            if UserModel.objects.filter(username=email).exists():
                return JsonResponse({'message': 'Email in use'}, status=400)
            first_name, *rest = data.get('name', '').split(' ', 1)
            last_name = rest[0] if rest else ''
            created_user = UserModel.objects.create_user(username=email, email=email, password=password, first_name=first_name, last_name=last_name)
            UserProfile.objects.create(user=created_user, role='teacher')
            
        i = Instructor.objects.create(
            user=created_user,
            name=data.get('name', ''), role=data.get('role', ''), exp=data.get('exp', ''),
            grad=data.get('grad', ''), initials=data.get('initials', '')
        )
        return JsonResponse(serialize_instructor(i), status=201)

@csrf_exempt
@require_http_methods(["PUT", "DELETE"])
def instructor_detail_view(request, pk):
    user = _get_user_from_request(request)
    if not user or getattr(user, 'profile', None) is None or getattr(user, 'profile').role != 'admin':
        return JsonResponse({'message': 'Forbidden'}, status=403)
        
    try:
        i = Instructor.objects.get(id=pk)
    except Instructor.DoesNotExist:
        return JsonResponse({'message': 'Not found'}, status=404)
        
    if request.method == 'PUT':
        data = _parse_json(request)
        i.name = data.get('name', i.name)
        i.role = data.get('role', i.role)
        i.exp = data.get('exp', i.exp)
        i.grad = data.get('grad', i.grad)
        i.initials = data.get('initials', i.initials)
        i.save()
        
        # Optionally update user logic here if needed
        return JsonResponse(serialize_instructor(i))
        
    if request.method == 'DELETE':
        if i.user:
            i.user.delete()
        i.delete()
        return JsonResponse({'message': 'Deleted'})

@csrf_exempt
@require_POST
def instructor_grant_access(request, pk):
    user = _get_user_from_request(request)
    if not user or getattr(user, 'profile', None) is None or getattr(user, 'profile').role != 'admin':
        return JsonResponse({'message': 'Forbidden'}, status=403)
        
    try:
        i = Instructor.objects.get(id=pk)
    except Instructor.DoesNotExist:
        return JsonResponse({'message': 'Not found'}, status=404)
        
    data = _parse_json(request)
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    if not email or not password:
        return JsonResponse({'message': 'Email va parol majburiy'}, status=400)
        
    if i.user:
        return JsonResponse({'message': 'Bu o\'qituvchiga allaqachon ruxsat berilgan'}, status=400)
        
    if UserModel.objects.filter(username=email).exists():
        return JsonResponse({'message': 'Email band'}, status=400)
        
    first_name, *rest = i.name.split(' ', 1)
    last_name = rest[0] if rest else ''
    new_user = UserModel.objects.create_user(username=email, email=email, password=password, first_name=first_name, last_name=last_name)
    UserProfile.objects.create(user=new_user, role='teacher')
    
    i.user = new_user
    i.save()
    
    
    return JsonResponse({'message': 'Ruxsat berildi'})

@csrf_exempt
@require_http_methods(["GET"])
def users_view(request):
    user = _get_user_from_request(request)
    if not user or getattr(user, 'profile', None) is None or getattr(user, 'profile').role != 'admin':
        return JsonResponse({'message': 'Forbidden'}, status=403)
        
    profiles = UserProfile.objects.select_related('user').all().order_by('-created_at')
    result = []
    for p in profiles:
        result.append({
            'id': p.user.id,
            'name': f'{p.user.first_name} {p.user.last_name}'.strip() or p.user.username,
            'email': p.user.email,
            'phone': p.phone,
            'role': p.role,
            'created_at': p.created_at.isoformat() if p.created_at else None
        })
    return JsonResponse(result, safe=False)

@csrf_exempt
@require_http_methods(["PUT", "DELETE"])
def user_detail_view(request, pk):
    user = _get_user_from_request(request)
    if not user or getattr(user, 'profile', None) is None or getattr(user, 'profile').role != 'admin':
        return JsonResponse({'message': 'Forbidden'}, status=403)
        
    try:
        target_user = UserModel.objects.get(id=pk)
    except UserModel.DoesNotExist:
        return JsonResponse({'message': 'Not found'}, status=404)
        
    if request.method == 'DELETE':
        target_user.delete()
        return JsonResponse({'message': 'Deleted'})
        
    if request.method == 'PUT':
        data = _parse_json(request)
        target_user.first_name = data.get('first_name', target_user.first_name)
        target_user.last_name = data.get('last_name', target_user.last_name)
        target_user.save()
        profile = getattr(target_user, 'profile', None)
        if profile:
            profile.phone = data.get('phone', profile.phone)
            profile.role = data.get('role', profile.role)
            profile.save()
        return JsonResponse({'message': 'Updated'})

@csrf_exempt
@require_http_methods(["GET"])
def messages_view(request):
    user = _get_user_from_request(request)
    if not user or getattr(user, 'profile', None) is None or getattr(user, 'profile').role != 'admin':
        return JsonResponse({'message': 'Forbidden'}, status=403)
        
    msgs = ContactMessage.objects.all().order_by('-created_at')
    result = []
    for m in msgs:
        result.append({
            'id': m.id,
            'name': m.name,
            'phone': m.phone,
            'email': m.email,
            'message': m.message,
            'created_at': m.created_at.isoformat() if m.created_at else None
        })
    return JsonResponse(result, safe=False)

@csrf_exempt
@require_http_methods(["DELETE"])
def message_detail_view(request, pk):
    user = _get_user_from_request(request)
    if not user or getattr(user, 'profile', None) is None or getattr(user, 'profile').role != 'admin':
        return JsonResponse({'message': 'Forbidden'}, status=403)
        
    try:
        m = ContactMessage.objects.get(id=pk)
        m.delete()
        return JsonResponse({'message': 'Deleted'})
    except ContactMessage.DoesNotExist:
        return JsonResponse({'message': 'Not found'}, status=404)

import os
import sys
from django.conf import settings
from django.http import HttpResponse

def serve_react(request, path=''):
    if getattr(sys, 'frozen', False):
        index_path = os.path.join(settings.BASE_DIR, 'frontend_dist', 'index.html')
    else:
        index_path = os.path.join(settings.BASE_DIR, '..', 'frontend', 'dist', 'index.html')
        
    try:
        with open(index_path, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read())
    except FileNotFoundError:
        return HttpResponse("React build not found at " + index_path, status=404)
