from users.models import UserActivity
from django.utils.deprecation import MiddlewareMixin

class KnoxActivityMiddleware(MiddlewareMixin):
    def process_view(self, request, view_func, view_args, view_kwargs):
        # Ejecutado justo antes de la vista
        # Capturar logout antes de que ocurra
        if request.path.endswith('/logout/') or request.path.endswith('/logoutall/'):
            if hasattr(request, 'user') and request.user.is_authenticated:
                UserActivity.objects.create(
                    user=request.user,
                    action_type='LOGOUT',
                    description=f"Cierre de sesión con Knox - {request.user.username}",
                    ip_address=self._get_client_ip(request),
                    user_agent=request.META.get('HTTP_USER_AGENT', '')
                )
        
        return None  # Continuar con el flujo normal

    def process_response(self, request, response):
        # Capturar login después de que ocurra exitosamente
        if request.path.endswith('/login/') and response.status_code >= 200 and response.status_code < 300:
            if hasattr(request, 'user') and request.user.is_authenticated:
                UserActivity.objects.create(
                    user=request.user,
                    action_type='LOGIN',
                    description=f"Inicio de sesión con Knox - {request.user.username}",
                    ip_address=self._get_client_ip(request),
                    user_agent=request.META.get('HTTP_USER_AGENT', '')
                )
        
        return response

    def _get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip