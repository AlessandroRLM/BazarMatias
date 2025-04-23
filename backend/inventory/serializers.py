from rest_framework import serializers

class ProductSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(max_length=100)
    price_clp = serializers.FloatField()
    stock = serializers.IntegerField()
    category = serializers.CharField(max_length=100)
