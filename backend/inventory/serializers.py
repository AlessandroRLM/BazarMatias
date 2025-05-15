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
        if obj.supplier:
            try:
                supplier = Supplier.objects.get(id=obj.supplier)
                return supplier.name
            except Supplier.DoesNotExist:
                return None
        return None

    def get_is_below_min_stock(self, obj):
        return obj.stock < obj.min_stock

class SupplySerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    stock = serializers.IntegerField()
    min_stock = serializers.IntegerField()

    class Meta:
        model = Supply
        fields = '__all__'

    def get_is_below_min_stock(self, obj):
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
    supplier = serializers.PrimaryKeyRelatedField(queryset=Supplier.objects.all())
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    supplier_name = serializers.SerializerMethodField()
    product_name = serializers.SerializerMethodField()

    class Meta:
        model = ReturnSupplier
        fields = '__all__'

    def get_supplier_name(self, obj):
        try:
            return obj.supplier.name
        except Supplier.DoesNotExist:
            return "Proveedor eliminado"

    def get_product_name(self, obj):
        try:
            return obj.product.name
        except Product.DoesNotExist:
            return "Producto eliminado"

    def update(self, instance, validated_data):
        if "status" in validated_data:
            if instance.status == "Resuelto" and validated_data["status"] == "Pendiente":
                raise serializers.ValidationError("No se puede cambiar el estado de 'Resuelto' a 'Pendiente'")
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
