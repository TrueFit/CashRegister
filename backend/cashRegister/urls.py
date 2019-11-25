from django.urls import path, include
from .views import cashRegisterAPI
urlpatterns = [
    path("API/", cashRegisterAPI.as_view(), name='cashRegisterAPI'),
]
