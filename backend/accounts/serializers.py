from rest_framework import serializers
from .models import User, LOGIN_RE, EMAIL_RE, validate_password_rules

class RegisterSerializer(serializers.Serializer):
    login = serializers.CharField(max_length=20)
    full_name = serializers.CharField(max_length=255, allow_blank=True, required=False)
    email = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=128)

    def validate_login(self, v):
        if not LOGIN_RE.match(v):
            raise serializers.ValidationError("Логин: латиница/цифры, первый символ буква, длина 4–20.")
        if User.objects.filter(login=v).exists():
            raise serializers.ValidationError("Логин уже занят.")
        return v

    def validate_email(self, v):
        if not EMAIL_RE.match(v):
            raise serializers.ValidationError("Email некорректен.")
        if User.objects.filter(email=v).exists():
            raise serializers.ValidationError("Email уже занят.")
        return v

    def validate_password(self, v):
        if not validate_password_rules(v):
            raise serializers.ValidationError("Пароль: >=6, 1 заглавная, 1 цифра, 1 спецсимвол.")
        return v

    def create(self, validated_data):
        return User.objects.create_user(
            login=validated_data["login"],
            email=validated_data["email"],
            full_name=validated_data.get("full_name", ""),
            password=validated_data["password"],
            is_admin=False,
        )

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "login", "full_name", "email", "is_admin", "storage_path", "created_at"]