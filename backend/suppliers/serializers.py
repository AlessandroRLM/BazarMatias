from rest_framework import serializers
from .models import Supplier, BuyOrder, BuyOrderDetail
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
        total_amount = sum(detail['quantity'] * detail['unit_price'] for detail in details_data)
        
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
            total_amount = sum(detail.quantity * detail.unit_price for detail in instance.details.all())
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