from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """
    Admin configuration for custom User model.
    Django Admin is used only as a technical interface.
    """

    model = User

    list_display = ("login", "email", "full_name", "is_admin", "is_staff", "is_active")
    list_filter = ("is_admin", "is_staff", "is_active")
    search_fields = ("login", "email", "full_name")
    ordering = ("login",)

    fieldsets = (
        (None, {"fields": ("login", "password")}),
        ("Personal info", {"fields": ("full_name", "email", "storage_path")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_admin", "is_superuser", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("login", "email", "full_name", "password1", "password2", "is_staff", "is_admin", "is_active"),
        }),
    )