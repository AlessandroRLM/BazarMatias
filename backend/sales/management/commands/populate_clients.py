from django.core.management.base import BaseCommand
from faker import Faker
import random
from sales.models import Client


class Command(BaseCommand):
    help = "Pobla la base de datos con clientes de ejemplo (chilenos)."

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Elimina los clientes existentes antes de crear nuevos.'
        )
        parser.add_argument(
            '--total',
            type=int,
            default=20,
            help='Número de clientes a crear (por defecto: 20).'
        )

    def handle(self, *args, **options):
        fake = Faker('es_CL')
        total = options['total']

        if options['clear']:
            self.stdout.write("🧹 Eliminando clientes existentes...")
            Client.objects.all().delete()
            self.stdout.write(self.style.SUCCESS("Clientes eliminados correctamente."))

        self.stdout.write(f"👥 Creando {total} clientes...")

        clients_created = 0
        attempts = 0

        while clients_created < total and attempts < total * 3:
            attempts += 1

            # Generar nombres y email
            first_name = fake.first_name()
            last_name = fake.last_name()
            email = f"{first_name.lower()}.{last_name.lower()}@{fake.free_email_domain()}"

            # Generar RUT chileno válido
            rut_body = random.randint(5000000, 25000000)
            dv = self.calculate_dv(rut_body)
            national_id = f"{rut_body}-{dv}"

            # Generar teléfono
            phone_number = f"+56 9 {random.randint(10000000, 99999999)}"

            try:
                Client.objects.create(
                    national_id=national_id,
                    first_name=first_name,
                    last_name=last_name,
                    email=email,
                    phone_number=phone_number
                )
                clients_created += 1
            except Exception:
                # En caso de duplicado o error de validación, lo omite
                continue

        self.stdout.write(self.style.SUCCESS(
            f"✅ Se crearon {clients_created} clientes correctamente."
        ))

    # ------------------------------------------------------------
    # Utilidad para generar DV válido de un RUT chileno
    # ------------------------------------------------------------
    def calculate_dv(self, rut):
        reversed_digits = map(int, reversed(str(rut)))
        factors = [2, 3, 4, 5, 6, 7]
        total = sum(d * factors[i % len(factors)] for i, d in enumerate(reversed_digits))
        remainder = 11 - (total % 11)
        if remainder == 11:
            return '0'
        elif remainder == 10:
            return 'K'
        else:
            return str(remainder)
