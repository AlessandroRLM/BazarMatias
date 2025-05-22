from django.core.management.base import BaseCommand
import random
from datetime import datetime, timedelta
from inventory.models import Product, Supply, Shrinkage, ReturnSupplier
from suppliers.models import Supplier

class Command(BaseCommand):
    help = 'Pobla la base de datos con datos de ejemplo para el módulo de inventario'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Elimina los datos existentes antes de poblar la base de datos',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.clear_data()
        
        self.create_products()
        self.create_supplies()
        self.create_shrinkages()
        self.create_returns()
        
        self.stdout.write(self.style.SUCCESS('Base de datos poblada correctamente.'))

    def clear_data(self):
        self.stdout.write('Eliminando datos existentes...')
        Product.objects.all().delete()
        Supply.objects.all().delete()
        Shrinkage.objects.all().delete()
        ReturnSupplier.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Datos eliminados correctamente.'))

    def create_products(self):
        self.stdout.write('Creando productos...')
        
        categories = ["Papelería", "Oficina", "Electrónica", "Escolar", "Arte", "Manualidades"]
        suppliers = ["Proveedor A", "Proveedor B", "Proveedor C", "Proveedor D"]
        
        products_data = [
            {
                "name": "Cuaderno universitario cuadriculado",
                "price_clp": 1500,
                "iva": True,
                "stock": random.randint(10, 100),
                "min_stock": 15,
                "category": "Escolar",
                "supplier": "Proveedor A",
                "data": {"marca": "Torre", "hojas": 100, "color": "Azul"}
            },
            {
                "name": "Lápiz grafito HB",
                "price_clp": 500,
                "iva": True,
                "stock": random.randint(50, 200),
                "min_stock": 30,
                "category": "Escolar",
                "supplier": "Proveedor B",
                "data": {"marca": "Faber-Castell", "dureza": "HB"}
            },
            {
                "name": "Resma papel carta",
                "price_clp": 3500,
                "iva": True,
                "stock": random.randint(5, 50),
                "min_stock": 10,
                "category": "Papelería",
                "supplier": "Proveedor C",
                "data": {"marca": "Chamex", "hojas": 500, "gramaje": "75g"}
            },
            {
                "name": "Calculadora científica",
                "price_clp": 12000,
                "iva": True,
                "stock": random.randint(3, 20),
                "min_stock": 5,
                "category": "Electrónica",
                "supplier": "Proveedor D",
                "data": {"marca": "Casio", "modelo": "FX-570LA X", "funciones": 552}
            },
            {
                "name": "Carpeta archivador",
                "price_clp": 2500,
                "iva": True,
                "stock": random.randint(10, 40),
                "min_stock": 8,
                "category": "Oficina",
                "supplier": "Proveedor A",
                "data": {"tamaño": "Carta", "color": "Negro", "anillos": 2}
            }
        ]
        
        # Agregar 15 productos más aleatorios
        for i in range(15):
            price = random.randint(500, 25000)
            stock = random.randint(1, 100)
            min_stock = random.randint(1, stock)
            
            products_data.append({
                "name": f"Producto aleatorio {i+1}",
                "price_clp": price,
                "iva": random.choice([True, False]),
                "stock": stock,
                "min_stock": min_stock,
                "category": random.choice(categories),
                "supplier": random.choice(suppliers),
                "data": {"característica": f"Valor {i}", "peso": f"{random.randint(10, 500)}g"}
            })
        
        # Crear los productos en la base de datos
        for product_data in products_data:
            Product.objects.create(**product_data)
        
        self.stdout.write(self.style.SUCCESS(f'Se crearon {len(products_data)} productos correctamente.'))

    def create_supplies(self):
        self.stdout.write('Creando insumos...')
        
        categories = ["papeleria", "oficina", "limpieza", "electronica", "otros"]
        
        supplies_data = [
            {
                "name": "Papel A4",
                "category": "papeleria",
                "stock": random.randint(10, 100),
                "min_stock": 20
            },
            {
                "name": "Tóner negro",
                "category": "oficina",
                "stock": random.randint(2, 10),
                "min_stock": 3
            },
            {
                "name": "Detergente multiuso",
                "category": "limpieza",
                "stock": random.randint(5, 15),
                "min_stock": 2
            },
            {
                "name": "Cables USB",
                "category": "electronica",
                "stock": random.randint(5, 30),
                "min_stock": 5
            },
            {
                "name": "Cinta adhesiva",
                "category": "papeleria",
                "stock": random.randint(10, 50),
                "min_stock": 8
            }
        ]
        
        # Agregar 10 insumos más aleatorios
        for i in range(10):
            stock = random.randint(1, 100)
            min_stock = random.randint(1, stock)
            
            supplies_data.append({
                "name": f"Insumo aleatorio {i+1}",
                "category": random.choice(categories),
                "stock": stock,
                "min_stock": min_stock
            })
        
        # Crear los insumos en la base de datos
        for supply_data in supplies_data:
            Supply.objects.create(**supply_data)
        
        self.stdout.write(self.style.SUCCESS(f'Se crearon {len(supplies_data)} insumos correctamente.'))

    def create_shrinkages(self):
        self.stdout.write('Creando mermas...')
        
        # Obtener nombres de productos existentes para usar en las mermas
        product_names = list(Product.objects.values_list('name', flat=True))
        categories = ["Papelería", "Oficina", "Electrónica", "Escolar", "Arte", "Manualidades"]
        
        # Si no hay productos, usar nombres genéricos
        if not product_names:
            product_names = ["Producto 1", "Producto 2", "Producto 3", "Producto 4", "Producto 5"]
        
        shrinkages_data = []
        
        # Crear 15 mermas
        for i in range(15):
            # Fecha aleatoria en los últimos 90 días
            days_ago = random.randint(0, 90)
            created_date = datetime.now() - timedelta(days=days_ago)
            
            shrinkages_data.append({
                "product": random.choice(product_names),
                "price": round(random.uniform(500, 15000), 2),
                "quantity": random.randint(1, 10),
                "category": random.choice(categories),
                "observation": f"Merma por {random.choice(['daño', 'vencimiento', 'pérdida', 'robo', 'error de inventario'])}",
                "created_at": created_date
            })
        
        # Crear las mermas en la base de datos
        for shrinkage_data in shrinkages_data:
            Shrinkage.objects.create(**shrinkage_data)
        
        self.stdout.write(self.style.SUCCESS(f'Se crearon {len(shrinkages_data)} mermas correctamente.'))

    def create_returns(self):
        self.stdout.write('Creando devoluciones a proveedores...')
        
        # Verificar si existen proveedores
        suppliers = list(Supplier.objects.all())
        if not suppliers:
            self.stdout.write('No hay proveedores en la base de datos. Creando proveedores de ejemplo...')
            # Crear proveedores de ejemplo si no existen
            suppliers_data = [
                {"name": "Proveedor A", "rut": "76.123.456-7", "address": "Dirección A", "phone": "+56912345678", "email": "proveedora@example.com"},
                {"name": "Proveedor B", "rut": "77.987.654-3", "address": "Dirección B", "phone": "+56998765432", "email": "proveedorb@example.com"},
                {"name": "Proveedor C", "rut": "78.456.789-1", "address": "Dirección C", "phone": "+56945678901", "email": "proveedorc@example.com"}
            ]
            
            for supplier_data in suppliers_data:
                try:
                    Supplier.objects.create(**supplier_data)
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Error al crear proveedor: {e}'))
            
            suppliers = list(Supplier.objects.all())
            if not suppliers:
                self.stdout.write(self.style.WARNING('No se pudieron crear proveedores. Omitiendo creación de devoluciones.'))
                return
        
        # Verificar si existen productos
        products = list(Product.objects.all())
        if not products:
            self.stdout.write(self.style.WARNING('No hay productos en la base de datos. Omitiendo creación de devoluciones.'))
            return
        
        returns_data = []
        
        # Crear 10 devoluciones
        for i in range(10):
            # Fechas aleatorias
            purchase_days_ago = random.randint(30, 180)
            return_days_ago = random.randint(0, 29)
            
            purchase_date = datetime.now().date() - timedelta(days=purchase_days_ago)
            return_date = datetime.now().date() - timedelta(days=return_days_ago)
            
            returns_data.append({
                "supplier": random.choice(suppliers),
                "product": random.choice(products),
                "quantity": random.randint(1, 10),
                "product_condition": random.choice(["Dañado", "Defectuoso", "Incompleto", "Incorrecto"]),
                "reason": f"Motivo de devolución #{i+1}: {random.choice(['Producto dañado', 'Error en pedido', 'Calidad insuficiente', 'Producto incorrecto'])}",
                "purchase_number": f"OC-{random.randint(1000, 9999)}",
                "purchase_date": purchase_date,
                "return_date": return_date,
                "status": random.choice(["Pendiente", "En proceso", "Completado"])
            })
        
        # Crear las devoluciones en la base de datos
        for return_data in returns_data:
            ReturnSupplier.objects.create(**return_data)
        
        self.stdout.write(self.style.SUCCESS(f'Se crearon {len(returns_data)} devoluciones correctamente.'))