from rest_framework import serializers
from inventory.models import Product
from .models import Supplier, BuyOrder, BuyOrderDetail, ReturnSupplierDetail, ReturnSupplier
from bson import ObjectId 
import re


class ObjectIdField(serializers.Field):
    def to_representation(self, value):
        if isinstance(value, ObjectId):
            return str(value)
        return value

    def to_internal_value(self, data):
        if data is None or data == "":
            return None
        try:
            return ObjectId(data)
        except Exception:
            raise serializers.ValidationError("Invalid ObjectId")


class SupplierSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)

    class Meta:
        model = Supplier
        fields = '__all__'

    def validate_rut(self, value):
        rut = re.sub(r'\.', '', value)
        if '-' not in rut and len(rut) > 1:
            rut = f"{rut[:-1]}-{rut[-1]}"
        return rut

# Lista simplificada para selects
class SupplierSelectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ['id', 'name', 'rut']


class BuyOrderDetailSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)

    class Meta:
        model = BuyOrderDetail
        fields = ['id', 'product', 'quantity', 'unit_price']


class BuyOrderSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    details = BuyOrderDetailSerializer(many=True)
    net_amount = serializers.IntegerField(required=False)
    iva = serializers.IntegerField(required=False)
    total_amount = serializers.IntegerField(required=False)

    class Meta:
        model = BuyOrder
        fields = '__all__'

    def create(self, validated_data):
        details_data = validated_data.pop('details')

        # Calcular net_amount basado en details
        total_amount = sum(detail['quantity'] * detail['unit_price']
                           for detail in details_data)

        # Calcular IVA (19% en este ejemplo, ajusta según necesites)
        iva = int(total_amount * 0.19)

        # Calcular total_amount
        net_amount = total_amount - iva

        # Actualizar los datos validados con los valores calculados
        validated_data['net_amount'] = net_amount
        validated_data['iva'] = iva
        validated_data['total_amount'] = total_amount

        # Crear la orden
        buy_order = BuyOrder.objects.create(**validated_data)

        # Crear los detalles y asociarlos a la orden
        for detail_data in details_data:
            detail = BuyOrderDetail.objects.create(**detail_data)
            buy_order.details.add(detail)

        return buy_order

    def update(self, instance, validated_data):
        # Handle the nested details if provided
        details_data = validated_data.pop('details', None)

        if details_data is not None:
            # Clear existing details
            instance.details.clear()

            # Create new details
            for detail_data in details_data:
                detail = BuyOrderDetail.objects.create(**detail_data)
                instance.details.add(detail)

            # Recalculate amounts
            total_amount = sum(
                detail.quantity * detail.unit_price for detail in instance.details.all())
            iva = int(total_amount * 0.19)
            net_amount = total_amount - iva

            # Update amounts
            instance.net_amount = net_amount
            instance.iva = iva
            instance.total_amount = total_amount

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance



class ReturnSupplierDetailSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        pk_field=ObjectIdField()
    )
    product_name = serializers.CharField(source='product.name', read_only=True)
    total_amount = serializers.ReadOnlyField()
    is_fully_received = serializers.ReadOnlyField()

    class Meta:
        model = ReturnSupplierDetail
        fields = [
            'id', 'product', 'product_name', 'quantity', 'quantity_received',
            'unit_price', 'total_amount', 'is_fully_received'
        ]

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "La cantidad debe ser mayor a 0.")
        return value

    def validate_quantity_received(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "La cantidad recibida no puede ser negativa.")
        return value

    def validate(self, data):
        """Validar que la cantidad recibida no sea mayor a la cantidad a retornar"""
        quantity = data.get('quantity')
        quantity_received = data.get('quantity_received', 0)

        if quantity_received > quantity:
            raise serializers.ValidationError({
                'quantity_received': 'La cantidad recibida no puede ser mayor a la cantidad a retornar.'
            })

        return data


class ReturnSupplierListSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)    
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    total_items = serializers.ReadOnlyField()
    total_products = serializers.ReadOnlyField()
    
    class Meta:
        model = ReturnSupplier
        fields = [
            'id', 'status', 'status_display', 'supplier_name',
            'purchase_number', 'return_date', 'total_items', 'total_products'
        ]


class ReturnSupplierSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    supplier = serializers.PrimaryKeyRelatedField(
        queryset=Supplier.objects.all(),
        pk_field=ObjectIdField()
    )
    details = ReturnSupplierDetailSerializer(many=True, required=False)
    supplier_name = serializers.CharField(
        source='supplier.name', read_only=True)
    status_display = serializers.CharField(
        source='get_status_display', read_only=True)
    total_items = serializers.ReadOnlyField()
    total_products = serializers.ReadOnlyField()

    class Meta:
        model = ReturnSupplier
        fields = [
            'id', 'status', 'status_display', 'supplier', 'supplier_name',
            'purchase_number', 'purchase_date', 'reason', 'return_date',
            'details', 'total_items', 'total_products'
        ]

    def validate(self, data):
        """Validaciones del retorno"""
        purchase_date = data.get('purchase_date')
        return_date = data.get('return_date')

        if purchase_date and return_date:
            if return_date < purchase_date:
                raise serializers.ValidationError({
                    'return_date': 'La fecha de retorno no puede ser anterior a la fecha de compra.'
                })

        return data

    def create(self, validated_data):
        """Crear retorno con sus detalles"""
        details_data = validated_data.pop('details', [])
        return_supplier = ReturnSupplier.objects.create(**validated_data)

        for detail_data in details_data:
            ReturnSupplierDetail.objects.create(
                return_supplier=return_supplier,
                **detail_data
            )

        return return_supplier

    def update(self, instance, validated_data):
        """Actualizar retorno con sus detalles"""
        details_data = validated_data.pop('details', None)

        # Actualizar campos del retorno principal
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Actualizar detalles si se proporcionan
        if details_data is not None:
            # Eliminar detalles existentes
            instance.details.all().delete()

            # Crear nuevos detalles
            for detail_data in details_data:
                ReturnSupplierDetail.objects.create(
                    return_supplier=instance,
                    **detail_data
                )

        return instance
