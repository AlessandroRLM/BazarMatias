from django.core.management.base import BaseCommand
from datetime import datetime, timedelta
import random
from faker import Faker

from inventory.models import Product, Supply, Shrinkage
from suppliers.models import Supplier, ReturnSupplier, ReturnSupplierDetail


class Command(BaseCommand):
    help = 'Pobla la base de datos con datos de ejemplo para el módulo de inventario y proveedores.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Elimina los datos existentes antes de poblar la base de datos',
        )

    def handle(self, *args, **options):
        self.fake = Faker('es_CL')

        if options['clear']:
            self.clear_data()

        self.create_suppliers()
        self.create_products()
        self.create_supplies()
        self.create_shrinkages()
        self.create_return_suppliers()

        self.stdout.write(self.style.SUCCESS('✅ Base de datos poblada correctamente.'))

    # ------------------------------------------------------------
    # Creación de proveedores
    # ------------------------------------------------------------
    def create_suppliers(self):
        self.stdout.write('🏢 Creando proveedores...')

        suppliers = []
        for i in range(8):
            suppliers.append(Supplier(
                name=f"Proveedor {self.fake.company()}",
                rut=f"{random.randint(70, 79)}.{random.randint(100, 999)}.{random.randint(100,999)}-{random.randint(0,9)}",
                address=self.fake.address(),
                phone=f"+56 9 {random.randint(10000000, 99999999)}",
                email=self.fake.company_email()
            ))

        Supplier.objects.bulk_create(suppliers)
        self.stdout.write(self.style.SUCCESS(f"Se crearon {len(suppliers)} proveedores correctamente."))

    # ------------------------------------------------------------
    # Creación de productos
    # ------------------------------------------------------------
    def create_products(self):
        self.stdout.write('📦 Creando productos...')

        categories = ["Papelería", "Oficina", "Electronica", "Escolar", "Arte", "Manualidades"]
        suppliers = list(Supplier.objects.all())

        products = []
        for i in range(25):
            supplier = random.choice(suppliers)
            products.append(Product(
                name=self.fake.word().capitalize() + " " + random.choice(["Premium", "Básico", "Pro", "Plus"]),
                price_clp=random.randint(800, 25000),
                iva=random.choice([True, False]),
                stock=random.randint(5, 200),
                min_stock=random.randint(5, 50),
                category=random.choice(categories),
                supplier=supplier,
                data={
                    "marca": self.fake.company(),
                    "modelo": f"{self.fake.lexify(text='???-###').upper()}",
                    "color": self.fake.color_name()
                }
            ))

        Product.objects.bulk_create(products)
        self.stdout.write(self.style.SUCCESS(f"Se crearon {len(products)} productos correctamente."))

    # ------------------------------------------------------------
    # Creación de insumos
    # ------------------------------------------------------------
    def create_supplies(self):
        self.stdout.write('🧰 Creando insumos...')

        categories = ["Papelería", "Oficina", "Limpieza", "Electrónica", "Otros"]
        supplies = []

        for i in range(15):
            supplies.append(Supply(
                name=self.fake.word().capitalize() + " " + random.choice(["Industrial", "Comercial", "Estándar"]),
                category=random.choice(categories),
                stock=random.randint(5, 100),
                min_stock=random.randint(2, 20)
            ))

        Supply.objects.bulk_create(supplies)
        self.stdout.write(self.style.SUCCESS(f"Se crearon {len(supplies)} insumos correctamente."))

    # ------------------------------------------------------------
    # Creación de mermas
    # ------------------------------------------------------------
    def create_shrinkages(self):
        self.stdout.write('⚠️ Creando mermas...')

        products = list(Product.objects.all())
        if not products:
            self.stdout.write(self.style.WARNING("No hay productos disponibles. Omitiendo mermas."))
            return

        reasons = ["daño", "vencimiento", "pérdida", "robo", "error de inventario"]
        shrinkages = []

        for i in range(15):
            shrinkages.append(Shrinkage(
                product=random.choice(products).name,
                price=round(random.uniform(500, 15000), 2),
                quantity=random.randint(1, 10),
                category=random.choice(["Papelería", "Oficina", "Electrónica", "Escolar"]),
                observation=f"Merma por {random.choice(reasons)}",
                created_at=datetime.now() - timedelta(days=random.randint(0, 120))
            ))

        Shrinkage.objects.bulk_create(shrinkages)
        self.stdout.write(self.style.SUCCESS(f"Se crearon {len(shrinkages)} mermas correctamente."))

    # ------------------------------------------------------------
    # Creación de devoluciones a proveedores
    # ------------------------------------------------------------
    def create_return_suppliers(self):
        self.stdout.write('↩️ Creando devoluciones a proveedores...')

        suppliers = list(Supplier.objects.all())
        products = list(Product.objects.all())

        if not suppliers or not products:
            self.stdout.write(self.style.WARNING("No hay proveedores o productos. Omitiendo devoluciones."))
            return

        for i in range(10):
            supplier = random.choice(suppliers)
            purchase_date = datetime.now().date() - timedelta(days=random.randint(60, 200))
            return_date = datetime.now().date() - timedelta(days=random.randint(0, 30))

            return_supplier = ReturnSupplier.objects.create(
                supplier=supplier,
                purchase_number=f"OC-{random.randint(1000, 9999)}",
                purchase_date=purchase_date,
                reason=random.choice([
                    "Producto dañado",
                    "Error en pedido",
                    "Defecto de fábrica",
                    "Producto incorrecto"
                ]),
                return_date=return_date,
                status=random.choice([
                    ReturnSupplier.StatusReturnSupplier.PENDING,
                    ReturnSupplier.StatusReturnSupplier.APPROVED,
                    ReturnSupplier.StatusReturnSupplier.REJECTED,
                ])
            )

            # Crear entre 1 y 6 detalles para cada devolución
            for _ in range(random.randint(1, 6)):
                product = random.choice(products)
                quantity = random.randint(1, 10)
                unit_price = product.price_clp
                received = random.randint(0, quantity)

                ReturnSupplierDetail.objects.create(
                    product=product,
                    return_supplier=return_supplier,
                    quantity=quantity,
                    quantity_received=received,
                    unit_price=unit_price
                )

        self.stdout.write(self.style.SUCCESS('Se crearon 10 devoluciones con detalles correctamente.'))
