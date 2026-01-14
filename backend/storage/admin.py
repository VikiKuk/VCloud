from django.contrib import admin
from .models import StoredFile


@admin.register(StoredFile)
class StoredFileAdmin(admin.ModelAdmin):
    list_display = ("id", "owner", "original_name", "size", "uploaded_at", "last_downloaded_at")
    search_fields = ("original_name", "stored_name", "relative_path", "owner__login")
    list_filter = ("uploaded_at",)
    ordering = ("-uploaded_at",)

    readonly_fields = (
        "stored_name",
        "relative_path",
        "size",
        "public_token",
        "uploaded_at",
        "last_downloaded_at",
    )