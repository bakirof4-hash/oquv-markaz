from django.urls import path, re_path

from . import views


urlpatterns = [
    re_path(r'^auth/register/?$', views.register_view, name='register'),
    re_path(r'^auth/login/?$', views.login_view, name='login'),
    re_path(r'^contact/?$', views.contact_view, name='contact'),
    re_path(r'^admin/stats/?$', views.admin_stats_view, name='admin-stats'),
    
    re_path(r'^courses/?$', views.courses_view, name='courses'),
    re_path(r'^courses/(?P<pk>\d+)/?$', views.course_detail_view, name='course-detail'),
    re_path(r'^courses/(?P<pk>\d+)/video/?$', views.course_video_view, name='course-video'),
    
    re_path(r'^instructors/?$', views.instructors_view, name='instructors'),
    re_path(r'^instructors/(?P<pk>\d+)/?$', views.instructor_detail_view, name='instructor-detail'),
    re_path(r'^instructors/(?P<pk>\d+)/access/?$', views.instructor_grant_access, name='instructor-access'),
    re_path(r'^users/?$', views.users_view, name='users'),
    re_path(r'^users/(?P<pk>\d+)/?$', views.user_detail_view, name='user-detail'),
    re_path(r'^messages/?$', views.messages_view, name='messages'),
    re_path(r'^messages/(?P<pk>\d+)/?$', views.message_detail_view, name='message-detail'),
]

