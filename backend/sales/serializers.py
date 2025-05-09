# serializers.py
from rest_framework import serializers
from .models import SaleDetail, Sale, Client
from bson import ObjectId #type: ignore

class ObjectIdField(serializers.Field):
    """Campo personalizado para manejar ObjectId de MongoDB."""
    def to_representation(self, value):
        if isinstance(value, ObjectId):
            return str(value)  # Convierte ObjectId a string
        return value

    def to_internal_value(self, data):
        try:
            return ObjectId(data)  # Convierte string a ObjectId
        except:
            raise serializers.ValidationError("Invalid ObjectId")

class ClientSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    class Meta:
        model = Client
        fields = '__all__'
    

class SaleDetailSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    class Meta:
        model = SaleDetail
        fields = ['id', 'product', 'quantity', 'unit_price', 'discount']

class SaleSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    details = SaleDetailSerializer(many=True)
    
    class Meta:
        model = Sale
        fields = '__all__'
        read_only_fields = ['folio', 'subtotal', 'iva', 'total', 'created_at']
    
    def validate(self, data):
        if data['document_type'] == 'FAC' and not data.get('client_rut'):
            raise serializers.ValidationError("Facturas requieren RUT de cliente")
        return data
    
    def create(self, validated_data):
        details_data = validated_data.pop('details')
        sale = Sale.objects.create(**validated_data)
        
        total = 0
        iva_total = 0
        
        for detail_data in details_data:
            product = detail_data['product']
            unit_price = detail_data['unit_price']
            quantity = detail_data['quantity']
            
            detail = SaleDetail.objects.create(
                product=product,
                unit_price=unit_price,
                quantity=quantity
            )
            sale.details.add(detail)
            
            total += unit_price * quantity
            if product.iva_tax:
                iva_total += (unit_price * quantity) - (unit_price * quantity / 1.19)
        
        sale.total = total
        sale.iva = int(round(iva_total))
        sale.save()
        
        return sale