from rest_framework.permissions import BasePermission

class IsAuthenticatedAndStorageAccess(BasePermission):
    """
    Доступ к чужому storage только для admin.
    view ожидает, что target_user будет вычислен внутри view.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)