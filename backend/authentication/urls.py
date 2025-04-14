from knox import views as knox_views
from .views import LoginApiView
from django.urls import path

urlpatterns = [
     path('login/', LoginApiView.as_view(), name='knox_login'),
     path('logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
     path('logoutall/', knox_views.LogoutAllView.as_view(), name='knox_logoutall'),
]
