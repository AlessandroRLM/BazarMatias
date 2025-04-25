from django.db import models
from django.utils import timezone
from django_mongodb_backend.fields import ObjectIdAutoField

class FailedLoginAttempt(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    email = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField()
    attempts = models.IntegerField(default=0)
    last_attempt = models.DateTimeField(auto_now=True)
    is_blocked = models.BooleanField(default=False)
    blocked_until = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.email} - {self.attempts} intentos"
