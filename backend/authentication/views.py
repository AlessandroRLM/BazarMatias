from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth import login
from .serializers import LoginSerializer
from knox import views as kv


class LoginApiView(kv.LoginView):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['user']
            login(request, user)
            response = super().post(request, format=None)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(response.data, status=status.HTTP_200_OK)
