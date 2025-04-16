from .models import UserActivity
from django.utils.deprecation import MiddlewareMixin

class UserActivityMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        # Ignora peticiones de recursos estáticos
        if '/static/' in request.path or '/media/' or '/favicon.ico' in request.path:
            return response
        
        if '/login/' or '/logout/' or '/logoutall/' in request.path:
            return response
            
        if hasattr(request, 'user') and request.user.is_authenticated:
            # Determina el tipo de acción basado en el método HTTP
            action_mapping = {
                'GET': 'VIEW',
                'POST': 'CREATE',
                'PUT': 'UPDATE',
                'PATCH': 'UPDATE',
                'DELETE': 'DELETE',
            }
            
            action_type = action_mapping.get(request.method, 'OTHER')
            
            # Captura datos básicos
            activity_data = {
                'path': request.path,
                'status_code': response.status_code,
            }
            
            # Intenta capturar datos del cuerpo de la petición para POST, PUT, PATCH
            if request.method in ['POST', 'PUT', 'PATCH'] and hasattr(request, 'data'):
                # Filtra información sensible
                safe_data = self._filter_sensitive_data(request.data)
                activity_data['request_data'] = safe_data
            
            UserActivity.objects.create(
                user=request.user,
                action_type=action_type,
                description=f"{action_type} en {request.path}",
                ip_address=self._get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                data=activity_data
            )
            
        return response
    
    def _get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    def _filter_sensitive_data(self, data):
        # Copia los datos para no modificar el original
        if not data:
            return {}
            
        if isinstance(data, dict):
            filtered_data = data.copy()
            # Lista de campos sensibles a filtrar
            sensitive_fields = ['password', 'token', 'secret']
            
            for field in sensitive_fields:
                if field in filtered_data:
                    filtered_data[field] = '[FILTRADO]'
                    
            return filtered_data
        return str(data)