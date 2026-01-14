from django.db import migrations
from django.contrib.auth.hashers import make_password


def create_admin(apps, schema_editor):
    User = apps.get_model("accounts", "User")

    if User.objects.filter(login="admin").exists():
        return

    User.objects.create(
        login="admin",
        email="admin@example.com",
        full_name="Administrator",
        is_admin=True,
        is_staff=True,
        is_active=True,
        is_superuser=True,         
        storage_path="u_admin",
        password=make_password("Admin1!"),
    )


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(create_admin, migrations.RunPython.noop),
    ]