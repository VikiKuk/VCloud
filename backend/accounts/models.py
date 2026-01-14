import re
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone

LOGIN_RE = re.compile(r"^[A-Za-z][A-Za-z0-9]{3,19}$")
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

def validate_password_rules(pw: str) -> bool:
    if len(pw) < 6:
        return False
    has_upper = any(c.isupper() for c in pw)
    has_digit = any(c.isdigit() for c in pw)
    has_special = any(not c.isalnum() for c in pw)
    return has_upper and has_digit and has_special

class UserManager(BaseUserManager):
    def create_user(self, login: str, email: str, full_name: str, password: str, is_admin: bool = False):
        if not login or not LOGIN_RE.match(login):
            raise ValueError("Invalid login")
        if not email or not EMAIL_RE.match(email):
            raise ValueError("Invalid email")
        if not validate_password_rules(password):
            raise ValueError("Invalid password")

        user = self.model(
            login=login,
            email=self.normalize_email(email),
            full_name=full_name or "",
            is_admin=is_admin,
            is_staff=is_admin,
            is_active=True,
            storage_path=f"u_{login.lower()}",
            created_at=timezone.now(),
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, login: str, email: str, full_name: str, password: str):
        return self.create_user(login, email, full_name, password, is_admin=True)

class User(AbstractBaseUser, PermissionsMixin):
    login = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=255, blank=True)
    email = models.EmailField(unique=True)

    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)   # для Django admin
    is_active = models.BooleanField(default=True)

    storage_path = models.CharField(max_length=255, default="")

    created_at = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "login"
    REQUIRED_FIELDS = ["email", "full_name"]

    objects = UserManager()

    def __str__(self):
        return self.login