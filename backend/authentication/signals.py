from django.dispatch import receiver
from knox.signals import token_expired
from .models import UserActivity

#Signal para registrar la expiración del token
@receiver(token_expired)
def knox_token_expired_callback(sender, **kwargs):
    user = kwargs.get('user', None)
    if user:
        UserActivity.objects.create(
            user=user,
            action_type='LOGOUT',
            description=f"Token expirado para {user.username}"
        )