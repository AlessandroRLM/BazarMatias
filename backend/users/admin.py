from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    fieldsets = list(UserAdmin.fieldsets) # Convierte a lista para modificarla
    fieldsets.append(
        ("Additional Info", {
            "fields": ("formatted_rut", "position")
        })
    )

    readonly_fields = ("formatted_rut", "national_id")  # No se pueden editar

    list_display = (
        "username", "email", "first_name", "last_name",
        "formatted_rut", "position", "is_staff", "is_active"
    )

    def formatted_rut(self, obj):
        return obj.formatted_rut
    formatted_rut.short_description = "RUT"

admin.site.register(User, CustomUserAdmin)
