from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Crea un superusuario con RUT (national_id) requerido'

    def handle(self, *args, **options):
        username = input("Username: ")
        email = input("Email: ")
        password = input("Password: ")
        national_id = input("RUT (formato 12345678-K): ")

        try:
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password,
                national_id=national_id,
            )
            self.stdout.write(self.style.SUCCESS('Superusuario creado correctamente!'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {e}'))