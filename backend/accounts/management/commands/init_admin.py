from django.core.management.base import BaseCommand
from accounts.models import User

class Command(BaseCommand):
    help = "Create initial admin user if not exists"

    def handle(self, *args, **options):
        login = "admin"
        email = "admin@example.com"
        password = "Admin1!"

        if User.objects.filter(login=login).exists():
            self.stdout.write(self.style.WARNING("Admin already exists"))
            return

        User.objects.create_superuser(login=login, email=email, full_name="System Admin", password=password)
        self.stdout.write(self.style.SUCCESS("Admin created: admin / Admin1!"))