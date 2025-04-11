from datetime import datetime, timedelta
from rest_framework.test import APITestCase
from django.test import RequestFactory, TestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model
from users.models import UserActivity
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



class UserActivityModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='admin',
            password='adminpass123',
            national_id='11111111-1',
            email='admin@example.com',
            position='Administrador'
        )
        self.content_type = ContentType.objects.get_for_model(User)
        
    def test_user_activity_creation(self):
        """Prueba para verificar la creacion de UserActivity"""
        activity = UserActivity.objects.create(
            user=self.user,
            action_type='VIEW',
            description='Test activity',
            content_type=self.content_type,
            object_id=self.user.id,
            ip_address='127.0.0.1',
            user_agent='Mozilla/5.0',
            data={'test': 'data'}
        )
        
        self.assertEqual(activity.user, self.user)
        self.assertEqual(activity.action_type, 'VIEW')
        self.assertEqual(activity.description, 'Test activity')
        self.assertEqual(activity.content_type, self.content_type)
        self.assertEqual(activity.object_id, self.user.id)
        self.assertEqual(activity.content_object, self.user)
        self.assertEqual(activity.ip_address, '127.0.0.1')
        self.assertEqual(activity.user_agent, 'Mozilla/5.0')
        self.assertEqual(activity.data, {'test': 'data'})
        
    def test_string_representation(self):
        """TPrueba para el __str__ de UserActivity"""
        activity = UserActivity.objects.create(
            user=self.user,
            action_type='CREATE',
            description='Test string representation'
        )
        expected_str = f"{self.user.username} - CREATE - {activity.timestamp}"
        self.assertEqual(str(activity), expected_str)
        
    def test_ordering(self):
        """Prueba para verificar que las actividades se ordenan por creacion descendente"""
        UserActivity.objects.create(user=self.user, action_type='CREATE', description='First')
        UserActivity.objects.create(user=self.user, action_type='VIEW', description='Second')
        UserActivity.objects.create(user=self.user, action_type='UPDATE', description='Third')
        
        activities = UserActivity.objects.all()
        self.assertEqual(activities[0].description, 'Third')
        self.assertEqual(activities[1].description, 'Second')
        self.assertEqual(activities[2].description, 'First')
       
 
"""
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
        
        # Crear algunos registros de actividad para probar
        self.content_type = ContentType.objects.get_for_model(User)
        
        # Actividad de hace 3 días
        self.activity1 = UserActivity.objects.create(
            user=self.admin_user,
            action_type='LOGIN',
            description='Admin login',
            ip_address='192.168.1.1',
            timestamp=datetime.now() - timedelta(days=3)
        )
        
        # Actividad de hace 2 días
        self.activity2 = UserActivity.objects.create(
            user=self.admin_user,
            action_type='VIEW',
            description='View dashboard',
            content_type=self.content_type,
            object_id=self.admin_user.id,
            ip_address='192.168.1.2',
            timestamp=datetime.now() - timedelta(days=2)
        )
        
        # Actividad de hoy
        self.activity3 = UserActivity.objects.create(
            user=self.admin_user,
            action_type='UPDATE',
            description='Update profile',
            content_type=self.content_type,
            object_id=self.admin_user.id,
            ip_address='192.168.1.3',
            timestamp=datetime.now()
        )
        
        # Configurar factory para las peticiones
        self.factory = RequestFactory()
        self.list_url = reverse('useractivity-list')
        self.detail_url = reverse('useractivity-detail', kwargs={'pk': self.activity1.pk})
"""        
        
        