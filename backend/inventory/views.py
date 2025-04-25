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
        
        # Convertir los datos validados a dict e insertar
        data = dict(serializer.validated_data)
        result = self.collection.insert_one(data)
        
        # Obtener el elemento creado y serializarlo
        created_item = self.collection.find_one({'_id': result.inserted_id})
        serialized_item = self._serialize_item(created_item)
        
        return Response(serialized_item, status=status.HTTP_201_CREATED)

    def update(self, request, pk=None):
        try:
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            # Convertir los datos validados a dict y actualizar
            data = dict(serializer.validated_data)
            self.collection.update_one(
                {'_id': ObjectId(pk)},
                {'$set': data}
            )
            
            # Obtener el elemento actualizado y serializarlo
            updated_item = self.collection.find_one({'_id': ObjectId(pk)})
            serialized_item = self._serialize_item(updated_item)
            
            return Response(serialized_item)
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