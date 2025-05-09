from rest_framework import serializers
from .models import Product, Supply, Shrinkage
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

    class Meta:
        model = Product
        fields = '__all__'


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