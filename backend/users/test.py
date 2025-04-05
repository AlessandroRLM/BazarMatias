from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model

User = get_user_model()

# RUT: 12345678-5 (válido)
# El dígito verificador para 12345678 es 5

class UserAPITest(APITestCase):
    def setUp(self):
        # Creamos un usuario autenticado para poder hacer llamadas protegidas
        self.admin_user = User.objects.create_user(
            username='admin',
            password='adminpass123',
            national_id='11111111-1',
            email='admin@example.com',
            position='Administrador'
        )
        self.client.login(username='admin', password='adminpass123')  # Login para autenticación

        self.valid_user_data = {
            "username": "testuser",
            "password": "securepass123",
            "email": "test@example.com",
            "first_name": "Test",
            "last_name": "User",
            "national_id": "12345678-5",  # RUT válido
            "position": "Vendedor"
        }
        self.create_url = reverse('user-list') # Hay que crear esto en el backend

    def test_create_user_successfully(self):
        response = self.client.post(self.create_url, self.valid_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.filter(username="testuser").exists(), True)

    def test_invalid_rut_format(self):
        data = self.valid_user_data.copy()
        data["username"] = "badformat"
        data["national_id"] = "12345678X"  # formato incorrecto
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("national_id", str(response.data))

    def test_incorrect_verification_digit(self):
        data = self.valid_user_data.copy()
        data["username"] = "wrongdv"
        data["national_id"] = "12345678-9"  # DV incorrecto
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_duplicate_national_id(self):
        # Crear primero
        self.client.post(self.create_url, self.valid_user_data, format='json')
        # Segundo intento con mismo RUT
        data = self.valid_user_data.copy()
        data["username"] = "otheruser"
        data["email"] = "other@example.com"
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_authenticated_user_data(self):
        url = reverse('user-me')  # /users/me/
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.admin_user.email)
