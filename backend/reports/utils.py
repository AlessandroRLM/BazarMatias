from django.template.loader import get_template
from django.http import HttpResponse
from weasyprint import HTML

def render_to_pdf(template_path, context, filename):
    template = get_template(template_path)
    html_string = template.render({'data': context})
    pdf_file = HTML(string=html_string).write_pdf()
    response = HttpResponse(pdf_file, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    return response
