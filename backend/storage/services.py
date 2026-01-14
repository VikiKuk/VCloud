import os
import uuid
from dataclasses import dataclass
from django.conf import settings

@dataclass
class StoredPath:
    stored_name: str
    relative_path: str    # relative to FILES_BASE_DIR
    abs_path: str

def build_storage_path(user_storage_path: str, original_filename: str) -> StoredPath:
    # сохраняем расширение
    _, ext = os.path.splitext(original_filename)
    stored_name = f"{uuid.uuid4().hex}{ext.lower()}"
    relative_path = os.path.join(user_storage_path, stored_name)

    base_dir = os.path.join(settings.BASE_DIR, settings.FILES_BASE_DIR)
    abs_path = os.path.join(base_dir, relative_path)

    os.makedirs(os.path.dirname(abs_path), exist_ok=True)
    return StoredPath(stored_name=stored_name, relative_path=relative_path, abs_path=abs_path)