from django.db import migrations
from django.contrib.auth.hashers import make_password


def create_default_admin(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    UserProfile = apps.get_model('main', 'UserProfile')

    email = 'admin@itacademy.uz'
    password = 'Admin12345!'

    user, created = User.objects.get_or_create(
        username=email,
        defaults={
            'email': email,
            'password': make_password(password),
            'first_name': 'Admin',
            'last_name': 'Account',
            'is_staff': True,
            'is_superuser': True,
            'is_active': True,
        },
    )

    if not created:
        changed = False
        user.password = make_password(password)
        changed = True
        if not user.is_staff:
            user.is_staff = True
            changed = True
        if not user.is_superuser:
            user.is_superuser = True
            changed = True
        if not user.is_active:
            user.is_active = True
            changed = True
        if not user.email:
            user.email = email
            changed = True
        if changed:
            user.save()

    UserProfile.objects.update_or_create(
        user=user,
        defaults={
            'phone': '+998 90 000 00 00',
            'role': 'admin',
        },
    )


class Migration(migrations.Migration):
    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_default_admin, migrations.RunPython.noop),
    ]
