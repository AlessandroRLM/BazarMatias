from rest_framework import serializers
from .models import Product, Supply, Shrinkage, ReturnSupplier
from suppliers.models import Supplier
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


class ProductSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    supplier = serializers.CharField(required=False, allow_null=True)
    supplier_name = serializers.SerializerMethodField()
    is_below_min_stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_supplier_name(self, obj):
        return obj.supplier

    def get_is_below_min_stock(self, obj):
        """Incluir el método is_below_min_stock en la serialización"""
        return obj.is_below_min_stock()

    def get_status_stock(self, obj):
        """Devolver el estado del stock como texto"""
        if obj.stock == 0:
            return 'out'
        elif obj.is_below_min_stock():
            return 'low'
        else:
            return 'normal'

    def create(self, validated_data):
        supplier_name = validated_data.get('supplier')
        validated_data['supplier'] = (
            'Sin proveedor' if supplier_name is None or not supplier_name.strip()
            else supplier_name.strip()
        )
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'supplier' in validated_data:
            supplier_name = validated_data['supplier']

            if supplier_name is None or supplier_name.strip() == '':
                validated_data['supplier'] = 'Sin proveedor'
            else:
                validated_data['supplier'] = supplier_name.strip()

        return super().update(instance, validated_data)


class SupplySerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    stock = serializers.IntegerField()
    min_stock = serializers.IntegerField()

    class Meta:
        model = Supply
        fields = '__all__'

    def get_is_below_min_stock(self, obj):
        if obj.min_stock is None:
            return False
        return obj.stock < obj.min_stock


class ShrinkageSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    quantity = serializers.IntegerField()
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Shrinkage
        fields = '__all__'


class ReturnSupplierSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    supplier = serializers.PrimaryKeyRelatedField(
        queryset=Supplier.objects.all())
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all())
    supplier_name = serializers.SerializerMethodField()
    product_name = serializers.SerializerMethodField()

    class Meta:
        model = ReturnSupplier
        fields = [
            'id',
            'supplier',
            'product',
            'quantity',
            'product_condition',
            'reason',
            'purchase_number',
            'purchase_date',
            'return_date',
            'status',
            'supplier_name',
            'product_name'
        ]

    def get_supplier_name(self, obj):
        return getattr(obj.supplier, 'name', None)

    def get_product_name(self, obj):
        try:
            return obj.product.name if obj.product else 'Producto eliminado'
        except Product.DoesNotExist:
            return 'Producto eliminado'

    def update(self, instance, validated_data):
        if "status" in validated_data:
            if instance.status == "Resuelto" and validated_data["status"] == "Pendiente":
                raise serializers.ValidationError(
                    "No se puede cambiar el estado de 'Resuelto' a 'Pendiente'")
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        rep = super().to_representation(instance)

        # Forzar conversión segura de todos los ObjectId potenciales
        for key, value in rep.items():
            if isinstance(value, ObjectId):
                rep[key] = str(value)

        if hasattr(instance, 'id') and isinstance(instance.id, ObjectId):
            rep['id'] = str(instance.id)

        return rep
