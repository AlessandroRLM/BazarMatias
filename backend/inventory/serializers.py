from rest_framework import serializers
from .models import Product, Supplier, Supply, Shrinkage
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

class ProductSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    supplier = serializers.CharField(required=False, allow_null=True)
    supplier_name = serializers.SerializerMethodField()

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

class SupplySerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    stock = serializers.IntegerField()

    class Meta:
        model = Supply
        fields = '__all__'

class ShrinkageSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    quantity = serializers.IntegerField()

    class Meta:
        model = Shrinkage
        fields = '__all__'