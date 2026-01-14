import logging
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .serializers import RegisterSerializer, UserSerializer
from .models import User
from .permissions import IsAdmin

logger = logging.getLogger(__name__)

@api_view(["GET"])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def csrf(request):
    # чтобы фронт получил csrftoken cookie
    logger.info("CSRF cookie ensured")
    return Response({"ok": True})

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    ser = RegisterSerializer(data=request.data)
    if not ser.is_valid():
        logger.warning("Register invalid: %s", ser.errors)
        return Response({"errors": ser.errors}, status=status.HTTP_400_BAD_REQUEST)
    user = ser.save()
    logger.info("User registered: %s", user.login)
    return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    login_value = request.data.get("login", "")
    password = request.data.get("password", "")

    user = authenticate(request, username=login_value, password=password)
    if not user:
        logger.warning("Login failed for: %s", login_value)
        return Response({"error": "Неверный логин или пароль."}, status=status.HTTP_400_BAD_REQUEST)

    login(request, user)
    logger.info("Login success: %s", user.login)
    return Response({"user": UserSerializer(user).data})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logger.info("Logout: %s", request.user.login)
    logout(request)
    return Response({"ok": True})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response({"user": UserSerializer(request.user).data})

# Админ: список пользователей
@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdmin])
def users_list(request):
    qs = User.objects.order_by("id")
    return Response({"users": UserSerializer(qs, many=True).data})

@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsAdmin])
def user_delete(request, user_id: int):
    if request.user.id == user_id:
        return Response({"error": "Нельзя удалить самого себя."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        u = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "Пользователь не найден."}, status=status.HTTP_404_NOT_FOUND)
    logger.warning("Admin %s deletes user %s", request.user.login, u.login)
    u.delete()
    return Response({"ok": True})

@api_view(["PATCH"])
@permission_classes([IsAuthenticated, IsAdmin])
def user_toggle_admin(request, user_id: int):
    if request.user.id == user_id:
        return Response({"error": "Нельзя менять админство самому себе."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        u = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "Пользователь не найден."}, status=status.HTTP_404_NOT_FOUND)

    is_admin = bool(request.data.get("is_admin"))
    u.is_admin = is_admin
    u.is_staff = is_admin
    u.save(update_fields=["is_admin", "is_staff"])
    logger.info("Admin %s set is_admin=%s for %s", request.user.login, is_admin, u.login)
    return Response({"user": UserSerializer(u).data})