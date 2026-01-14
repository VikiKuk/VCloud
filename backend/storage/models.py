import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone

class StoredFile(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="files")

    original_name = models.CharField(max_length=255)
    stored_name = models.CharField(max_length=255)     # уникальное имя на диске
    relative_path = models.CharField(max_length=512)   # путь относительно FILES_BASE_DIR/ (включая user.storage_path)
    size = models.BigIntegerField(default=0)

    comment = models.TextField(blank=True, default="")

    uploaded_at = models.DateTimeField(default=timezone.now)
    last_downloaded_at = models.DateTimeField(null=True, blank=True)

    public_token = models.CharField(max_length=64, unique=True, db_index=True, default="")

    def ensure_public_token(self):
        if not self.public_token:
            self.public_token = uuid.uuid4().hex + uuid.uuid4().hex
            return True
        return False

    def __str__(self):
        return f"{self.owner.login}: {self.original_name}"