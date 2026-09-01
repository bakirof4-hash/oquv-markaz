from django.conf import settings
from django.db import models


class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
    )

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=30, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} profile'


class ContactMessage(models.Model):
    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=30)
    email = models.EmailField(blank=True)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Instructor(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=100)
    exp = models.CharField(max_length=100)
    grad = models.CharField(max_length=200, blank=True)
    initials = models.CharField(max_length=10, blank=True)

    def __str__(self):
        return self.name

class Course(models.Model):
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    desc = models.TextField(blank=True)
    duration = models.CharField(max_length=100, blank=True)
    price = models.CharField(max_length=100, blank=True)
    isPopular = models.BooleanField(default=False)
    icon = models.CharField(max_length=100, blank=True)
    badgeColor = models.CharField(max_length=100, blank=True)
    mentorName = models.CharField(max_length=100, blank=True)
    mentorRole = models.CharField(max_length=100, blank=True)
    mentorExp = models.CharField(max_length=100, blank=True)
    mentorGrad = models.CharField(max_length=200, blank=True)
    mentorInitials = models.CharField(max_length=10, blank=True)

    def __str__(self):
        return self.title

class Video(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='videos')
    title = models.CharField(max_length=200)
    url = models.URLField()

    def __str__(self):
        return self.title
