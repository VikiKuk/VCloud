import logging
import os
from django.conf import settings
from django.http import FileResponse, Http404
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status

from accounts.models import User
from accounts.permissions import IsAdmin
from .models import StoredFile
from .serializers import StoredFileSerializer, FileRenameSerializer, FileCommentSerializer
from .services import build_storage_path

logger = logging.getLogger(__name__)

def _get_target_user(request):
    """
    Обычный пользователь: всегда сам.
    Админ: может указать ?user_id=...
    """
    if getattr(request.user, "is_admin", False):
        user_id = request.query_params.get("user_id")
        if user_id:
            try:
                return User.objects.get(id=int(user_id))
            except (User.DoesNotExist, ValueError):
                return None
    return request.user

def _file_abs_path(relative_path: str) -> str:
    base_dir = os.path.join(settings.BASE_DIR, settings.FILES_BASE_DIR)
    return os.path.join(base_dir, relative_path)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def files_list(request):
    target = _get_target_user(request)
    if not target:
        return Response({"error": "Хранилище не найдено."}, status=status.HTTP_404_NOT_FOUND)

    qs = StoredFile.objects.filter(owner=target).order_by("-uploaded_at")
    data = StoredFileSerializer(qs, many=True).data
    total_size = sum(f["size"] for f in data)
    logger.debug("Files list for %s by %s", target.login, request.user.login)
    return Response({
        "user": {"id": target.id, "login": target.login},
        "files": data,
        "stats": {"count": len(data), "total_size": total_size},
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def file_upload(request):
    target = _get_target_user(request)
    if not target:
        return Response({"error": "Хранилище не найдено."}, status=status.HTTP_404_NOT_FOUND)

    upload = request.FILES.get("file")
    comment = request.data.get("comment", "")

    if not upload:
        return Response({"error": "Файл обязателен."}, status=status.HTTP_400_BAD_REQUEST)

    p = build_storage_path(target.storage_path, upload.name)

    with open(p.abs_path, "wb+") as dest:
        for chunk in upload.chunks():
            dest.write(chunk)

    f = StoredFile(
        owner=target,
        original_name=upload.name,
        stored_name=p.stored_name,
        relative_path=p.relative_path,
        size=upload.size,
        comment=comment or "",
    )
    f.ensure_public_token()
    f.save()

    logger.info("File uploaded: %s owner=%s by=%s", f.original_name, target.login, request.user.login)
    return Response({"file": StoredFileSerializer(f).data}, status=status.HTTP_201_CREATED)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def file_delete(request, file_id: int):
    try:
        f = StoredFile.objects.get(id=file_id)
    except StoredFile.DoesNotExist:
        return Response({"error": "Файл не найден."}, status=status.HTTP_404_NOT_FOUND)

    # права
    if not (request.user.is_admin or f.owner_id == request.user.id):
        return Response({"error": "Нет доступа."}, status=status.HTTP_403_FORBIDDEN)

    abs_path = _file_abs_path(f.relative_path)
    try:
        if os.path.exists(abs_path):
            os.remove(abs_path)
    except OSError:
        logger.error("Failed to remove file from disk: %s", abs_path)

    logger.warning("File deleted id=%s by=%s", f.id, request.user.login)
    f.delete()
    return Response({"ok": True})

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def file_rename(request, file_id: int):
    ser = FileRenameSerializer(data=request.data)
    if not ser.is_valid():
        return Response({"errors": ser.errors}, status=status.HTTP_400_BAD_REQUEST)

    try:
        f = StoredFile.objects.get(id=file_id)
    except StoredFile.DoesNotExist:
        return Response({"error": "Файл не найден."}, status=status.HTTP_404_NOT_FOUND)

    if not (request.user.is_admin or f.owner_id == request.user.id):
        return Response({"error": "Нет доступа."}, status=status.HTTP_403_FORBIDDEN)

    f.original_name = ser.validated_data["original_name"]
    f.save(update_fields=["original_name"])
    logger.info("File renamed id=%s by=%s", f.id, request.user.login)
    return Response({"file": StoredFileSerializer(f).data})

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def file_comment(request, file_id: int):
    ser = FileCommentSerializer(data=request.data)
    if not ser.is_valid():
        return Response({"errors": ser.errors}, status=status.HTTP_400_BAD_REQUEST)

    try:
        f = StoredFile.objects.get(id=file_id)
    except StoredFile.DoesNotExist:
        return Response({"error": "Файл не найден."}, status=status.HTTP_404_NOT_FOUND)

    if not (request.user.is_admin or f.owner_id == request.user.id):
        return Response({"error": "Нет доступа."}, status=status.HTTP_403_FORBIDDEN)

    f.comment = ser.validated_data["comment"]
    f.save(update_fields=["comment"])
    logger.info("File comment changed id=%s by=%s", f.id, request.user.login)
    return Response({"file": StoredFileSerializer(f).data})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def file_download(request, file_id: int):
    try:
        f = StoredFile.objects.get(id=file_id)
    except StoredFile.DoesNotExist:
        return Response({"error": "Файл не найден."}, status=status.HTTP_404_NOT_FOUND)

    if not (request.user.is_admin or f.owner_id == request.user.id):
        return Response({"error": "Нет доступа."}, status=status.HTTP_403_FORBIDDEN)

    abs_path = _file_abs_path(f.relative_path)
    if not os.path.exists(abs_path):
        raise Http404()

    f.last_downloaded_at = timezone.now()
    f.save(update_fields=["last_downloaded_at"])

    logger.info("File downloaded id=%s by=%s", f.id, request.user.login)
    resp = FileResponse(open(abs_path, "rb"), as_attachment=True, filename=f.original_name)
    return resp

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def file_public_link(request, file_id: int):
    try:
        f = StoredFile.objects.get(id=file_id)
    except StoredFile.DoesNotExist:
        return Response({"error": "Файл не найден."}, status=status.HTTP_404_NOT_FOUND)

    if not (request.user.is_admin or f.owner_id == request.user.id):
        return Response({"error": "Нет доступа."}, status=status.HTTP_403_FORBIDDEN)

    changed = f.ensure_public_token()
    if changed:
        f.save(update_fields=["public_token"])

    link = f"/api/public/{f.public_token}/download"
    return Response({"public_link": link, "public_token": f.public_token})

@api_view(["GET"])
def public_download(request, token: str):
    try:
        f = StoredFile.objects.get(public_token=token)
    except StoredFile.DoesNotExist:
        return Response({"error": "Ссылка недействительна."}, status=status.HTTP_404_NOT_FOUND)

    abs_path = _file_abs_path(f.relative_path)
    if not os.path.exists(abs_path):
        return Response({"error": "Файл отсутствует."}, status=status.HTTP_404_NOT_FOUND)

    f.last_downloaded_at = timezone.now()
    f.save(update_fields=["last_downloaded_at"])

    logger.info("Public download token=%s file_id=%s", token, f.id)
    return FileResponse(open(abs_path, "rb"), as_attachment=True, filename=f.original_name)