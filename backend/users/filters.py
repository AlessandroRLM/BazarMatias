# app/filters.py
import django_filters
from django.contrib.contenttypes.models import ContentType
from .models import UserActivity

class UserActivityFilter(django_filters.FilterSet):
    # Filtros para campos estándar
    action_type = django_filters.ChoiceFilter(choices=UserActivity.ACTION_TYPES)
    content_type = django_filters.ModelChoiceFilter(queryset=ContentType.objects.all())

    # Filtros para el JSONField 'data' (ej: data__status_type)
    data__status_type = django_filters.CharFilter(field_name="data__status_type", lookup_expr="exact")

    # Filtro por rango de fechas en timestamp
    timestamp__range = django_filters.DateTimeFromToRangeFilter(field_name="timestamp")

    class Meta:
        model = UserActivity
        fields = {
            'user': ['exact'],
            'timestamp': ['exact', 'year__gt', 'year__lt'],
        }

    def filter_by_content_object(self, queryset, name, value):
        """
        Filtra por el objeto genérico (ej: ?content_object=1&content_type=app.model)
        """
        content_type_model = self.data.get("content_type")
        if content_type_model and value:
            app_label, model = content_type_model.split(".")
            content_type = ContentType.objects.get(app_label=app_label, model=model)
            return queryset.filter(content_type=content_type, object_id=value)
        return queryset