from rest_framework import serializers
from .models import StoredFile

class StoredFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoredFile
        fields = [
            "id",
            "owner",
            "original_name",
            "size",
            "comment",
            "uploaded_at",
            "last_downloaded_at",
            "public_token",
        ]
        read_only_fields = ["id", "owner", "size", "uploaded_at", "last_downloaded_at", "public_token"]

class FileRenameSerializer(serializers.Serializer):
    original_name = serializers.CharField(max_length=255)

class FileCommentSerializer(serializers.Serializer):
    comment = serializers.CharField(allow_blank=True, required=True)