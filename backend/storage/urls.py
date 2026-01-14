from django.urls import path
from . import views

urlpatterns = [
    path("files", views.files_list),
    path("files/upload", views.file_upload),
    path("files/<int:file_id>", views.file_delete),
    path("files/<int:file_id>/rename", views.file_rename),
    path("files/<int:file_id>/comment", views.file_comment),
    path("files/<int:file_id>/download", views.file_download),
    path("files/<int:file_id>/public-link", views.file_public_link),

    path("public/<str:token>/download", views.public_download),
]