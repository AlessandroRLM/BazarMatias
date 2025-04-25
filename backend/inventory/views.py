from rest_framework import viewsets, status
from rest_framework.response import Response
from django.http import Http404
from bson import ObjectId
from bson.json_util import dumps, loads
import json
from .serializers import ProductSerializer, SupplierSerializer
from .db import products_collection, suppliers_collection


class MongoDBBaseViewSet(viewsets.ViewSet):
    serializer_class = None
    collection = None

    def _serialize_item(self, item):
        """Método auxiliar para serializar documentos de MongoDB"""
        if not item:
            return None
        # Convertir ObjectId a string y eliminar el campo _id
        item['id'] = str(item['_id'])
        del item['_id']
        # Si es producto, agregar nombre del proveedor y dejar supplier_id como string
        if 'supplier_id' in item:
            supplier = suppliers_collection.find_one({'_id': item['supplier_id']})
            item['supplier_name'] = supplier['name'] if supplier else None
            item['supplier_id'] = str(item['supplier_id'])  # Dejar el id como string
        return item

    def list(self, request):
        items = list(self.collection.find())
        serialized_items = [self._serialize_item(item) for item in items]
        serializer = self.serializer_class(serialized_items, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        try:
            item = self.collection.find_one({'_id': ObjectId(pk)})
            if not item:
                raise Http404
            serialized_item = self._serialize_item(item)
            serializer = self.serializer_class(serialized_item)
            return Response(serializer.data)
        except (TypeError, ValueError):
            raise Http404

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = dict(serializer.validated_data)
        # Convertir supplier_id a ObjectId si corresponde
        if self.serializer_class is ProductSerializer and 'supplier_id' in data:
            data['supplier_id'] = ObjectId(data['supplier_id'])
        result = self.collection.insert_one(data)
        
        created_item = self.collection.find_one({'_id': result.inserted_id})
        serialized_item = self._serialize_item(created_item)
        # Usar el serializer para la respuesta
        response_serializer = self.serializer_class(serialized_item)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, pk=None):
        try:
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            data = dict(serializer.validated_data)
            # Convertir supplier_id a ObjectId si corresponde
            if self.serializer_class is ProductSerializer and 'supplier_id' in data:
                data['supplier_id'] = ObjectId(data['supplier_id'])
            self.collection.update_one(
                {'_id': ObjectId(pk)},
                {'$set': data}
            )
            
            updated_item = self.collection.find_one({'_id': ObjectId(pk)})
            serialized_item = self._serialize_item(updated_item)
            response_serializer = self.serializer_class(serialized_item)
            return Response(response_serializer.data)
        except (TypeError, ValueError):
            raise Http404

    def destroy(self, request, pk=None):
        try:
            result = self.collection.delete_one({'_id': ObjectId(pk)})
            if result.deleted_count == 0:
                raise Http404
            return Response(status=status.HTTP_204_NO_CONTENT)
        except (TypeError, ValueError):
            raise Http404


class ProductViewSet(MongoDBBaseViewSet):
    serializer_class = ProductSerializer
    collection = products_collection


class SupplierViewSet(MongoDBBaseViewSet):
    serializer_class = SupplierSerializer
    collection = suppliers_collection

    def list(self, request):
        name = request.query_params.get('name')
        query = {}
        if name:
            query['name'] = {'$regex': name, '$options': 'i'}
        items = list(self.collection.find(query))
        serialized_items = [self._serialize_item(item) for item in items]
        serializer = self.serializer_class(serialized_items, many=True)
        return Response(serializer.data)