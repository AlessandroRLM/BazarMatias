from functools import wraps
from .models import UserActivity
from django.contrib.contenttypes.models import ContentType

def log_activity(action_type, description=None):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(viewset, request, *args, **kwargs):
            # Ejecutar la vista original
            response = view_func(viewset, request, *args, **kwargs)
            
            if request.user.is_authenticated:
                content_object = None
                object_id = None
                content_type = None
                
                # Si es un detalle y tenemos un objeto
                if hasattr(viewset, 'get_object') and kwargs.get('pk'):
                    try:
                        content_object = viewset.get_object()
                        object_id = content_object.pk
                        content_type = ContentType.objects.get_for_model(content_object)
                    except:
                        pass
                
                # Determinar la descripción
                action_description = description
                if not action_description:
                    model_name = viewset.__class__.__name__.replace('ViewSet', '')
                    action_description = f"{action_type} {model_name}"
                    if object_id:
                        action_description += f" ID: {object_id}"
                
                UserActivity.objects.create(
                    user=request.user,
                    action_type=action_type,
                    description=action_description,
                    content_type=content_type,
                    object_id=object_id,
                    ip_address=request.META.get('REMOTE_ADDR', ''),
                    user_agent=request.META.get('HTTP_USER_AGENT', '')
                )
                
            return response
        return _wrapped_view
    return decorator