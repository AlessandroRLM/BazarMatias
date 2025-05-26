from bson import ObjectId
from rest_framework import serializers
from django.db.models import Sum
from inventory.models import Product
from users.models import User
from .models import SaleDetail, Sale, Client, Quote, QuoteDetail, Return, WorkOrder, DocumentCounter

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
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        pk_field=ObjectIdField()
    )

    class Meta:
        model = SaleDetail
        fields = ['id', 'product', 'quantity', 'unit_price', 'discount']

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
        read_only_fields = ['folio', 'created_at', 'net_amount', 'iva', 'total_amount', 'client']

    def validate(self, data):
        if 'client' not in data and 'client_id' not in data:
            if data.get('document_type') == Sale.DocType.INVOICE:
                raise serializers.ValidationError(
                    "Facturas requieren un cliente asociado"
                )
        return data

    def to_internal_value(self, data):
        if 'client' in data and isinstance(data['client'], str):
            data['client_id'] = data.pop('client')
        return super().to_internal_value(data)

    def create(self, validated_data):
        try:
            details_data = validated_data.pop('details', [])
            
            # Validar que haya al menos un detalle
            if not details_data:
                raise serializers.ValidationError("Debe incluir al menos un producto en la venta")

            # Obtener el próximo folio
            next_folio = DocumentCounter.get_next(
                document_type=validated_data['document_type']
            )
            
            # Crear la venta sin los montos primero
            sale = Sale.objects.create(
                **validated_data,
                folio=next_folio,
                net_amount=0,  # Valores temporales
                iva=0,
                total_amount=0
            )
            
            # Procesar cada detalle
            total_net = 0
            total_iva = 0
            
            for detail_data in details_data:
                # Validar que el producto existe y tiene stock
                product = detail_data['product']
                if product.stock < detail_data['quantity']:
                    raise serializers.ValidationError(
                        f"No hay suficiente stock para el producto {product.name}"
                    )
                
                # Crear el detalle
                detail = SaleDetail.objects.create(**detail_data)
                sale.details.add(detail)
                
                # Calcular montos
                net_price = detail.net_price * detail.quantity
                total_net += net_price
                total_iva += detail.iva_amount * detail.quantity
            
            # Actualizar montos totales
            sale.net_amount = total_net
            sale.iva = total_iva
            sale.total_amount = total_net + total_iva
            sale.save()
            
            # Actualizar stock de productos
            for detail in sale.details.all():
                detail.product.stock -= detail.quantity
                detail.product.save()
            
            return sale

        except Exception as e:
            raise serializers.ValidationError(str(e))
        
    def update(self, instance, validated_data):
        details_data = validated_data.pop('details', [])
        
        # Update the sale instance
        instance = super().update(instance, validated_data)
        
        # Clear existing details and add new ones
        instance.details.clear()
        
        total_net = 0
        total_iva = 0
        
        for detail_data in details_data:
            # Create new detail
            detail = SaleDetail.objects.create(**detail_data)
            instance.details.add(detail)
            
            # Calculate amounts
            net_price = detail.net_price * detail.quantity
            total_net += net_price
            total_iva += detail.iva_amount * detail.quantity
        
        # Update totals
        instance.net_amount = total_net
        instance.iva = total_iva
        instance.total_amount = total_net + total_iva
        instance.save()
        
        return instance

class QuoteDetailSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        pk_field=ObjectIdField()
    )

    class Meta:
        model = QuoteDetail
        fields = ['id', 'product', 'quantity', 'unit_price', 'discount']

class QuoteSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    client = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(),
        pk_field=ObjectIdField()
    )
    details = QuoteDetailSerializer(many=True)

    class Meta:
        model = Quote
        fields = '__all__'
        read_only_fields = ['created_at', 'total']

    def create(self, validated_data):
        details_data = validated_data.pop('details')
        
        # Calcular el total basado en los detalles
        total = sum(
            detail['unit_price'] * detail['quantity'] * (1 - detail.get('discount', 0) / 100)
            for detail in details_data
        )
        
        # Crear la cotización con el total calculado
        quote = Quote.objects.create(**validated_data, total=total)
        
        # Crear los detalles de cotización
        for detail_data in details_data:
            QuoteDetail.objects.create(quote=quote, **detail_data)
        
        return quote

class ReturnSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    client = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(),
        pk_field=ObjectIdField()
    )
    sale = serializers.PrimaryKeyRelatedField(
        queryset=Sale.objects.all(),
        pk_field=ObjectIdField()
    )
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        pk_field=ObjectIdField()
    )
    
    producto_nombre = serializers.CharField(source='product.name', read_only=True)
    cliente_nombre = serializers.CharField(source='client.name', read_only=True)
    fecha_venta = serializers.DateTimeField(source='sale.created_at', read_only=True)

    class Meta:
        model = Return
        fields = [
            'id',
            'client',
            'cliente_nombre',
            'sale',
            'fecha_venta',
            'product',
            'producto_nombre',
            'quantity',
            'reason',
            'created_at'
        ]

    def validate(self, data):
        sale = data.get('sale') or getattr(self.instance, 'sale', None)
        product = data.get('product') or getattr(self.instance, 'product', None)
        quantity = data.get('quantity')

        if not sale or not product:
            return data

        # Verificar que el producto esté en la venta
        if not sale.details.filter(product=product).exists():
            raise serializers.ValidationError({
                'product': 'El producto no pertenece a la venta seleccionada.'
            })

        # Calcular cantidad máxima devolvable
        total_sold = sale.details.filter(product=product).aggregate(
            total=Sum('quantity')
        )['total'] or 0
        
        total_returned = Return.objects.filter(
            sale=sale, 
            product=product
        ).exclude(
            pk=getattr(self.instance, 'pk', None)
        ).aggregate(
            total=Sum('quantity')
        )['total'] or 0

        max_returnable = total_sold - total_returned
        if quantity > max_returnable:
            raise serializers.ValidationError({
                'quantity': f'No se pueden devolver más de {max_returnable} unidades.'
            })

        return data

class WorkOrderSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    trabajador = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        pk_field=ObjectIdField()
    )
    
    trabajador_nombre = serializers.CharField(source='trabajador.get_full_name', read_only=True)
    trabajador_rut = serializers.CharField(source='trabajador.formatted_rut', read_only=True)
    trabajador_cargo = serializers.CharField(source='trabajador.position', read_only=True)

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
        sequence_num = 1 if last_order is None else int(last_order.numero_orden.split('-')[-1]) + 1
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