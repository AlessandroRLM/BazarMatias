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
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        pk_field=ObjectIdField()
    )
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = BuyOrderDetail
        fields = ['id', 'product', 'product_name', 'quantity', 'unit_price']


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
        details_data = validated_data.pop('details', [])

        if not details_data:
            raise serializers.ValidationError(
                "Debe incluir al menos un detalle de compra.")

        # Calcular montos
        total_amount = sum(d['quantity'] * d['unit_price']
                           for d in details_data)
        iva = int(total_amount * 0.19)
        net_amount = total_amount - iva

        validated_data['net_amount'] = net_amount
        validated_data['iva'] = iva
        validated_data['total_amount'] = total_amount

        # Crear orden de compra
        buy_order = BuyOrder.objects.create(**validated_data)

        # Crear detalles asociados
        for detail_data in details_data:
            BuyOrderDetail.objects.create(buy_order=buy_order, **detail_data)

        return buy_order

    def update(self, instance, validated_data):
        details_data = validated_data.pop('details', None)

        # Actualiza campos principales
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Actualiza detalles si se envían
        if details_data is not None:
            # Eliminar detalles antiguos
            instance.details.all().delete()

            for detail_data in details_data:
                BuyOrderDetail.objects.create(
                    buy_order=instance, **detail_data)

        # Recalcular montos
        total_amount = sum(
            d.quantity * d.unit_price for d in instance.details.all())
        iva = int(total_amount * 0.19)
        net_amount = total_amount - iva

        instance.net_amount = net_amount
        instance.iva = iva
        instance.total_amount = total_amount
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
        quantity = data.get('quantity')
        quantity_received = data.get('quantity_received', 0)

        if quantity_received > quantity:
            raise serializers.ValidationError({
                'quantity_received': 'La cantidad recibida no puede ser mayor a la cantidad a retornar.'
            })
        return data


class ReturnSupplierListSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    supplier_name = serializers.CharField(
        source='supplier.name', read_only=True)
    status_display = serializers.CharField(
        source='get_status_display', read_only=True)
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
    supplier_name = serializers.CharField(
        source='supplier.name', read_only=True)
    details = ReturnSupplierDetailSerializer(many=True, required=False)
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
        purchase_date = data.get('purchase_date')
        return_date = data.get('return_date')
        if purchase_date and return_date and return_date < purchase_date:
            raise serializers.ValidationError({
                'return_date': 'La fecha de retorno no puede ser anterior a la fecha de compra.'
            })
        return data

    def create(self, validated_data):
        details_data = validated_data.pop('details', [])
        return_supplier = ReturnSupplier.objects.create(**validated_data)

        for detail_data in details_data:
            ReturnSupplierDetail.objects.create(
                return_supplier=return_supplier, **detail_data)

        return return_supplier

    def update(self, instance, validated_data):
        details_data = validated_data.pop('details', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if details_data is not None:
            instance.details.all().delete()
            for detail_data in details_data:
                ReturnSupplierDetail.objects.create(
                    return_supplier=instance, **detail_data)

        return instance
