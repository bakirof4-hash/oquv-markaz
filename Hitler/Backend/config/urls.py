from django.contrib import admin
from django.urls import include, path, re_path
from django.conf import settings
from django.views.static import serve
import os
import sys

from main import views as main_views

if getattr(sys, 'frozen', False):
    REACT_DIST_DIR = os.path.join(settings.BASE_DIR, 'frontend_dist')
else:
    REACT_DIST_DIR = os.path.join(settings.BASE_DIR, '..', 'frontend', 'dist')

urlpatterns = [
    path('api/', include('main.urls')),
    path('admin/', admin.site.urls),
    re_path(r'^assets/(?P<path>.*)$', serve, {'document_root': os.path.join(REACT_DIST_DIR, 'assets')}),
    re_path(r'^.*$', main_views.serve_react, name='serve_react'),
]
