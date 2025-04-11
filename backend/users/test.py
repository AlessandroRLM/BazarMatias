from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model

User = get_user_model()

def generar_rut_valido(base_numero):
    """
    Genera un RUT válido en formato XXXXXXXX-D a partir de un número base.
    """
    rut = str(base_numero)
    reversed_digits = map(int, reversed(rut))
    factors = [2, 3, 4, 5, 6, 7]
    total = sum(d * factors[i % 6] for i, d in enumerate(reversed_digits))
    remainder = 11 - (total % 11)
    if remainder == 11:
        dv = '0'
    elif remainder == 10:
        dv = 'K'
    else:
        dv = str(remainder)
    return f"{rut}-{dv}"


class UserAPITest(APITestCase):
    def setUp(self):
        User.objects.all().delete()  # Limpiar la base de datos antes de cada test por si acaso
        self.admin_user = User.objects.create_user(
            username='admin',
            password='adminpass123',
            national_id=generar_rut_valido(11111111),
            email='admin@example.com',
            position='Administrador'
        )
        self.client.login(username='admin', password='adminpass123')

        self.valid_user_data = {
            "username": "testuser",
            "password": "securepass123",
            "email": "test@example.com",
            "first_name": "Test",
            "last_name": "User",
            "national_id": generar_rut_valido(12345678),
            "position": "Vendedor"
        }
        self.create_url = reverse('user-list')

    def test_create_user_successfully(self):
        response = self.client.post(self.create_url, self.valid_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="testuser").exists())

    def test_invalid_rut_format(self):
        data = self.valid_user_data.copy()
        data["username"] = "badformat"
        data["national_id"] = "12345678X"  # formato incorrecto
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("non_field_errors", response.data)
        self.assertIn("El RUT debe tener el formato 12345678-K.", str(response.data['non_field_errors']))

    def test_incorrect_verification_digit(self):
        data = self.valid_user_data.copy()
        data["username"] = "wrongdv"
        data["national_id"] = "12345678-9"  # DV incorrecto
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_duplicate_national_id(self):
        # Crear primer usuario
        response1 = self.client.post(self.create_url, self.valid_user_data, format='json')
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)
        
        # Intentar crear usuario con mismo RUT
        duplicate_data = self.valid_user_data.copy()
        duplicate_data.update({
            "username": "otheruser",
            "email": "other@example.com"
        })
        
        response2 = self.client.post(self.create_url, duplicate_data, format='json')
        
        # Verificar respuesta de error
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Verificar el mensaje de error (puede venir en national_id o non_field_errors)
        error_message = 'Este RUT ya está registrado en el sistema.'
        if 'national_id' in response2.data:
            self.assertEqual(response2.data['national_id'][0], error_message)
        else:
            self.assertIn(error_message, str(response2.data))

    def test_get_authenticated_user_data(self):
        url = reverse('user-me')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.admin_user.email)

    def test_list_users_authenticated(self):
        response = self.client.get(self.create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("results", response.data)
        self.assertIn("info", response.data)

    def test_pagination_custom_page_size(self):
        for i in range(15):
            User.objects.create_user(
                username=f'user{i}',
                password='pass1234',
                national_id=generar_rut_valido(20000000 + i),
                email=f'user{i}@example.com',
                position='Vendedor'
            )
        response = self.client.get(f"{self.create_url}?page=1&page_size=5")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 5)
        self.assertEqual(response.data["info"]["current_page"], 1)

    def test_search_users_by_username(self):
        User.objects.create_user(
            username='johndoe',
            password='pass123',
            national_id=generar_rut_valido(33333333),
            email='john@example.com',
            position='Soporte'
        )
        response = self.client.get(f"{self.create_url}?search=john")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        usernames = [u["username"] for u in response.data["results"]]
        self.assertIn("johndoe", usernames)

    def test_filter_users_by_is_staff(self):
        User.objects.create_user(
            username='staffuser',
            password='pass123',
            national_id=generar_rut_valido(44444444),
            email='staff@example.com',
            is_staff=True,
            position='Supervisor'
        )
        response = self.client.get(f"{self.create_url}?is_staff=true")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for user in response.data["results"]:
            self.assertTrue(user["is_staff"])

    def test_order_users_by_username_desc(self):
        User.objects.create_user(
            username='zzz',
            password='pass123',
            national_id=generar_rut_valido(55555555),
            email='zzz@example.com',
            position='Tester'
        )
        User.objects.create_user(
            username='aaa',
            password='pass123',
            national_id=generar_rut_valido(56666666),
            email='aaa@example.com',
            position='Tester'
        )
        response = self.client.get(f"{self.create_url}?ordering=-username")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        usernames = [u["username"] for u in response.data["results"]]
        self.assertTrue(usernames.index('zzz') < usernames.index('aaa'))

    def test_limit_max_page_size(self):
        for i in range(150):
            User.objects.create_user(
                username=f'bulk{i}',
                password='pass1234',
                national_id=generar_rut_valido(70000000 + i),
                email=f'bulk{i}@example.com',
                position='Carga'
            )
        response = self.client.get(f"{self.create_url}?page_size=500")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertLessEqual(len(response.data["results"]), 100)
