from django.contrib.auth import get_user_model
from main.models import UserProfile

User = get_user_model()
user, created = User.objects.get_or_create(username='admin@gmail.com', defaults={'email': 'admin@gmail.com'})
user.set_password('admin123')
user.is_superuser = True
user.is_staff = True
user.first_name = "Asosiy"
user.last_name = "Admin"
user.save()

profile, _ = UserProfile.objects.get_or_create(user=user)
profile.role = 'admin'
profile.save()

print('Admin Created Successfully: admin@gmail.com / admin123')
