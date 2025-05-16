FROM python:3.12-alpine3.21

WORKDIR /backend

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Instalar dependencias del sistema para WeasyPrint y fuentes
RUN apk update && apk add --no-cache \
    build-base \
    cairo-dev \
    pango-dev \
    gdk-pixbuf-dev \
    libffi-dev \
    py3-cffi \
    py3-pillow \
    py3-pip \
    libxml2-dev \
    libxslt-dev \
    musl-dev \
    jpeg-dev \
    zlib-dev \
    freetype-dev \
    harfbuzz-dev \
    fontconfig \
    ttf-dejavu \
    && pip install --upgrade pip

# Copiar e instalar dependencias Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código del proyecto
COPY . .

EXPOSE 4000

CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:4000"]