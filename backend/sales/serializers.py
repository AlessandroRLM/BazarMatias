from bson import ObjectId
from rest_framework import serializers
from django.db import transaction
from inventory.models import Product
from inventory.serializers import ProductSerializer
from users.models import User
from .models import SaleDetail, Sale, Client, Quote, QuoteDetail, ClientReturnDetail, ClientReturn, WorkOrder, DocumentCounter


class ObjectIdField(serializers.Field):
    def to_representation(self, value):
        return str(value)

    def to_internal_value(self, data):
        try:
            return ObjectId(data)
        except:
            raise serializers.ValidationError("Invalid ObjectId")


class ClientSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)

    class Meta:
        model = Client
        fields = '__all__'


class SaleDetailSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        pk_field=ObjectIdField(),
        source='product',
        write_only=True
    )

    class Meta:
        model = SaleDetail
        fields = ['id', 'product', 'product_id',
                  'quantity', 'unit_price', 'discount']


class SaleSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    details = SaleDetailSerializer(many=True)
    client = ClientSerializer(read_only=True)
    client_id = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(),
        source='client',
        pk_field=ObjectIdField(),
        required=False,
        allow_null=True,
        write_only=True
    )

    class Meta:
        model = Sale
        fields = '__all__'
        read_only_fields = ['folio', 'created_at',
                            'net_amount', 'iva', 'total_amount']

    def validate(self, data):
        document_type = data.get('document_type', getattr(
            self.instance, 'document_type', None))
        client = data.get('client', getattr(self.instance, 'client', None))

        if document_type == Sale.DocType.INVOICE and not client:
            raise serializers.ValidationError(
                "Facturas requieren un cliente asociado.")
        return data

    def to_internal_value(self, data):
        # Permite recibir 'client' como string y convertirlo
        if 'client' in data and isinstance(data['client'], str):
            data['client_id'] = data.pop('client')
        return super().to_internal_value(data)

    def create(self, validated_data):
        details_data = validated_data.pop('details', [])
        if not details_data:
            raise serializers.ValidationError(
                "Debe incluir al menos un producto en la venta.")

        # Obtener folio siguiente
        next_folio = DocumentCounter.get_next(
            document_type=validated_data['document_type'])

        sale = Sale.objects.create(
            **validated_data,
            folio=next_folio,
            net_amount=0,
            iva=0,
            total_amount=0
        )

        total_net = 0
        total_iva = 0

        for detail_data in details_data:
            product = detail_data['product']

            # Validar stock
            if product.stock < detail_data['quantity']:
                raise serializers.ValidationError(
                    f"No hay suficiente stock para el producto {product.name}"
                )

            # Crear detalle vinculado a la venta
            detail = SaleDetail.objects.create(sale=sale, **detail_data)

            if validated_data.status != Sale.Status.CANCELLED:
                # Actualizar stock
                product.stock -= detail.quantity
                product.save()

            # Calcular montos
            net_price = detail.net_price * detail.quantity
            total_net += net_price
            total_iva += detail.iva_amount * detail.quantity

        sale.net_amount = total_net
        sale.iva = total_iva
        sale.total_amount = total_net + total_iva
        sale.save()

        return sale

    def update(self, instance, validated_data):
        details_data = validated_data.pop('details', None)

        # Actualiza campos de la venta
        instance = super().update(instance, validated_data)


        if details_data is not None:
            # Eliminar detalles anteriores y restaurar stock
            for old_detail in instance.details.all():
                old_detail.product.stock += old_detail.quantity
                old_detail.product.save()
            instance.details.all().delete()

            total_net = 0
            total_iva = 0

            for detail_data in details_data:
                product = detail_data['product']

                if product.stock < detail_data['quantity']:
                    raise serializers.ValidationError(
                        f"No hay suficiente stock para el producto {product.name}"
                    )

                detail = SaleDetail.objects.create(
                    sale=instance, **detail_data)
                product.stock -= detail.quantity
                product.save()

                net_price = detail.net_price * detail.quantity
                total_net += net_price
                total_iva += detail.iva_amount * detail.quantity

            instance.net_amount = total_net
            instance.iva = total_iva
            instance.total_amount = total_net + total_iva
            instance.save()

        return instance


class QuoteDetailSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        pk_field=ObjectIdField(),
        write_only=True
    )

    class Meta:
        model = QuoteDetail
        fields = ['id', 'product', 'product_id',
                  'quantity', 'unit_price', 'discount']


class QuoteSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    client = ClientSerializer(read_only=True)
    client_id = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(),
        source='client',
        pk_field=ObjectIdField(),
        write_only=True
    )
    details = QuoteDetailSerializer(many=True)

    class Meta:
        model = Quote
        fields = '__all__'
        read_only_fields = ['created_at', 'total']

    def create(self, validated_data):
        details_data = validated_data.pop('details', [])
        if not details_data:
            raise serializers.ValidationError(
                "Debe incluir al menos un producto en la cotización.")

        total = sum(
            detail['unit_price'] * detail['quantity'] *
            (1 - detail.get('discount', 0) / 100)
            for detail in details_data
        )

        quote = Quote.objects.create(**validated_data, total=int(total))

        for detail_data in details_data:
            QuoteDetail.objects.create(quote=quote, **detail_data)

        return quote

    def update(self, instance, validated_data):
        details_data = validated_data.pop('details', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if details_data is not None:
            instance.details.all().delete()

            total = 0
            for detail_data in details_data:
                QuoteDetail.objects.create(quote=instance, **detail_data)
                subtotal = detail_data['unit_price'] * detail_data['quantity'] * (
                    1 - detail_data.get('discount', 0) / 100)
                total += subtotal

            instance.total = int(total)

        instance.save()
        return instance


class ClientReturnDetailSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        pk_field=ObjectIdField(),
        write_only=True
    )

    class Meta:
        model = ClientReturnDetail
        fields = ['id', 'product', 'product_id',
                  'quantity', 'unit_price']


# CORRECCIONES PARA serializers.py

class ClientReturnSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)

    client_id = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(),
        pk_field=ObjectIdField(),
        write_only=True
    )
    client = ClientSerializer(read_only=True, source='client_id')

    sale_id = serializers.PrimaryKeyRelatedField(
        queryset=Sale.objects.all(),
        pk_field=ObjectIdField(),
        write_only=True
    )
    sale = SaleSerializer(read_only=True, source='sale_id')

    details = ClientReturnDetailSerializer(many=True)

    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = ClientReturn
        fields = [
            'id',
            'client',
            'client_id',
            'sale',
            'sale_id',
            'reason',
            'details',
            'created_at',
            'total_amount',
            'status'
        ]

    def get_total_amount(self, obj):
        # CORREGIDO: Usar la propiedad correcta del modelo
        return obj.get_total_amount

    def validate(self, data):
        client = data.get('client_id') or (
            self.instance.client_id if self.instance else None)
        sale = data.get('sale_id') or (
            self.instance.sale_id if self.instance else None)
        details = data.get('details') or (
            list(self.instance.details.all()) if self.instance else None)

        if not client or not sale or not details:
            return data

        # Verificar que venta pertenezca al cliente
        if sale.client and sale.client.id != client.id:
            raise serializers.ValidationError({
                'sale': 'La venta seleccionada no pertenece al cliente autenticado.'
            })

        # Obtener ids de los productos en la devolución
        product_ids = [item['product_id'].id for item in details]

        # Verificar que los productos estén en la venta
        if not sale.details.filter(product_id__in=product_ids).exists():
            raise serializers.ValidationError({
                'product': 'El producto no pertenece a la venta seleccionada.'
            })

        # Verificar precio de los productos
        for item in details:
            product_id = item['product_id'].id
            unit_price = item['unit_price']
            try:
                product_in_sale = sale.details.get(product_id=product_id)
                if product_in_sale.unit_price != unit_price:
                    try:
                        product = Product.objects.get(id=product_id)
                        product_name = product.name
                    except Product.DoesNotExist:
                        product_name = "Producto"

                    raise serializers.ValidationError({
                        'unit_price': f'El precio unitario para {product_name} no coincide con el precio en la venta ({product_in_sale.unit_price}).'
                    })
            except SaleDetail.DoesNotExist:
                raise serializers.ValidationError({
                    'product_id': f'El producto {product_id} no está en la venta seleccionada.'
                })

        # Calcular cantidades vendidas por producto
        products_sold = {}
        for sale_detail in sale.details.all():
            product_id = sale_detail.product.id
            if product_id not in products_sold:
                products_sold[product_id] = 0
            products_sold[product_id] += sale_detail.quantity

        # Calcular cantidades ya devueltas en otras devoluciones
        products_already_returned = {}
        existing_returns = ClientReturn.objects.filter(
            sale_id=sale,
            status__in=[ClientReturn.Status.PENDING, ClientReturn.Status.COMPLETED]
        )
        
        # Si estamos actualizando, excluir la devolución actual del cálculo
        if self.instance:
            existing_returns = existing_returns.exclude(id=self.instance.id)
        
        for client_return in existing_returns:
            for detail in client_return.details.all():
                product_id = detail.product_id.id
                if product_id not in products_already_returned:
                    products_already_returned[product_id] = 0
                products_already_returned[product_id] += detail.quantity

        # Calcular cantidades a retornar en esta solicitud
        products_to_return = {}
        for item in details:
            product_id = item['product_id'].id
            quantity = item['quantity']
            if product_id not in products_to_return:
                products_to_return[product_id] = 0
            products_to_return[product_id] += quantity

        # Verificar que cantidad total devuelta no exceda la cantidad vendida
        for product_id, new_return_quantity in products_to_return.items():
            sold_quantity = products_sold.get(product_id, 0)
            already_returned = products_already_returned.get(product_id, 0)
            total_to_return = already_returned + new_return_quantity
            
            if total_to_return > sold_quantity:
                try:
                    product = Product.objects.get(id=product_id)
                    product_name = product.name
                except Product.DoesNotExist:
                    product_name = "Producto"

                available_to_return = sold_quantity - already_returned
                
                raise serializers.ValidationError({
                    'product': f'El producto "{product_name}" ya tiene {already_returned} unidades devueltas. '
                               f'Solo puedes devolver {available_to_return} unidades adicionales de las {sold_quantity} vendidas.'
                })

        return data

    def create(self, validated_data):
        details_data = validated_data.pop('details')
        instance = super().create(validated_data)
        with transaction.atomic():
            # Creación de detalles
            ClientReturnDetail.objects.bulk_create(
                [ClientReturnDetail(**item, clients_return=instance) for item in details_data])
            # Actualización de stock (AUMENTAR porque es una devolución)
            for detail in instance.details.all():
                product = detail.product_id
                product.stock += detail.quantity
                product.save()

        return instance

    def update(self, instance, validated_data):
        details_data = validated_data.pop('details', None)
        
        if details_data is not None:
            with transaction.atomic():
                for old_detail in instance.details.all():
                    product = old_detail.product_id
                    product.stock -= old_detail.quantity  # Restaurar (quitar lo que habíamos sumado)
                    product.save()
                
                # Eliminar detalles antiguos
                instance.details.all().delete()
                
                # Crear nuevos detalles y actualizar stock
                ClientReturnDetail.objects.bulk_create(
                    [ClientReturnDetail(**item, clients_return=instance) for item in details_data])
                
                for detail in instance.details.all():
                    product = detail.product_id
                    product.stock += detail.quantity  # Sumar el nuevo stock devuelto
                    product.save()
        
        return super().update(instance, validated_data)


class WorkOrderSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    trabajador = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        pk_field=ObjectIdField()
    )

    trabajador_nombre = serializers.CharField(
        source='trabajador.get_full_name', read_only=True)
    trabajador_rut = serializers.CharField(
        source='trabajador.formatted_rut', read_only=True)
    trabajador_cargo = serializers.CharField(
        source='trabajador.position', read_only=True)

    class Meta:
        model = WorkOrder
        fields = [
            'id',
            'numero_orden',
            'trabajador',
            'trabajador_nombre',
            'trabajador_rut',
            'trabajador_cargo',
            'tipo_tarea',
            'descripcion',
            'prioridad',
            'plazo',
            'status',
            'created_at'
        ]
        extra_kwargs = {
            'numero_orden': {'read_only': True}
        }

    def create(self, validated_data):
        # Generate order number (example format: WO-YYYYMMDD-XXXX)
        from datetime import datetime
        last_order = WorkOrder.objects.order_by('-created_at').first()
        sequence_num = 1 if last_order is None else int(
            last_order.numero_orden.split('-')[-1]) + 1
        validated_data['numero_orden'] = f"WO-{datetime.now().strftime('%Y%m%d')}-{sequence_num:04d}"

        return super().create(validated_data)


class DashboardStatsSerializer(serializers.Serializer):
    monthly_profit = serializers.IntegerField()
    previous_month_profit = serializers.IntegerField()
    total_sales = serializers.IntegerField()
    paid_sales = serializers.IntegerField()
    due_sales = serializers.IntegerField()
    approved_quotes = serializers.IntegerField()
    pending_quotes = serializers.IntegerField()
    rejected_quotes = serializers.IntegerField()
    top_clients = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        )
    )
