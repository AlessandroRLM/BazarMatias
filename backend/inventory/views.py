from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from .mongo import products_collection
from .serializers import ProductSerializer

# Listar y crear productos
class ProductListCreateView(APIView):
    def get(self, request):
        products = list(products_collection.find())
        for product in products:
            product['id'] = str(product['_id'])
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            product_data = serializer.validated_data
            inserted = products_collection.insert_one(product_data)
            product_data['id'] = str(inserted.inserted_id)
            return Response(product_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Obtener, actualizar, eliminar producto individual
class ProductDetailView(APIView):
    def get_object(self, pk):
        product = products_collection.find_one({"_id": ObjectId(pk)})
        if product:
            product['id'] = str(product['_id'])
        return product

    def get(self, request, pk):
        product = self.get_object(pk)
        if product:
            return Response(product)
        return Response({"error": "Producto no encontrado"}, status=404)

    def put(self, request, pk):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            update_data = serializer.validated_data
            result = products_collection.update_one(
                {"_id": ObjectId(pk)},
                {"$set": update_data}
            )
            if result.modified_count:
                update_data['id'] = pk
                return Response(update_data)
            return Response({"message": "No se modificó nada"}, status=200)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        result = products_collection.delete_one({"_id": ObjectId(pk)})
        if result.deleted_count:
            return Response(status=204)
        return Response({"error": "Producto no encontrado"}, status=404)
