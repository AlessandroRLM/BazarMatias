# BazarMatias

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## 📋 Descripción

BazarMatias es un sistema integral de gestión para tiendas minoristas que permite administrar inventario, ventas, proveedores y generar reportes. Diseñado con una arquitectura moderna que separa el frontend del backend, este sistema proporciona una interfaz de usuario intuitiva y potentes capacidades de gestión de datos.

## 🚀 Características Principales

- **Gestión de Inventario**: Control completo de productos, categorías y stock
- **Sistema de Ventas**: Procesamiento de ventas y seguimiento de transacciones
- **Gestión de Proveedores**: Administración de proveedores y pedidos
- **Reportes y Análisis**: Generación de informes detallados en múltiples formatos
- **Autenticación y Seguridad**: Sistema robusto de autenticación y control de acceso
- **Interfaz Moderna**: UI/UX intuitiva y responsive construida con React y Material UI

## 🛠️ Tecnologías

### Backend
- **Django**: Framework web de alto nivel con Django REST Framework
- **MongoDB**: Base de datos NoSQL para almacenamiento de datos
- **Django REST Knox**: Autenticación basada en tokens
- **DRF Spectacular**: Documentación automática de API
- **WeasyPrint**: Generación de reportes en PDF
- **OpenPyXL**: Manejo de archivos Excel

### Frontend
- **React 19**: Biblioteca JavaScript para construir interfaces de usuario
- **TypeScript**: Superset tipado de JavaScript
- **Vite**: Herramienta de construcción rápida para desarrollo moderno
- **TanStack Router**: Enrutamiento type-safety para React
- **TanStack Query**: Gestión de estado del servidor y caché
- **TanStack Table**: Tablas potentes y flexibles
- **Joy UI (JUI)**: Biblioteca de componentes de UI
- **React Hook Form**: Manejo de formularios con validación
- **Zod**: Validación de esquemas
- **Recharts/MUI X-Charts**: Visualización de datos

### Infraestructura
- **Docker**: Contenedorización para desarrollo y despliegue consistentes
- **Docker Compose**: Orquestación de servicios múltiples

## 🏗️ Arquitectura

El proyecto sigue una arquitectura de tres capas con los siguientes componentes:

- **Capa de presentación**: Aplicación React con TypeScript
- **Capa de aplicación**: API REST con Django REST Framework
- **Capa de datos**: MongoDB para almacenamiento

## 📦 Instalación y Configuración

### Prerrequisitos
- Docker y Docker Compose
- Git

### Pasos de Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/BazarMatias.git
   cd BazarMatias
   ```

2. Configurar variables de entorno:
   ```bash
   # Copiar el archivo de ejemplo
   cp .env.example .env
   
   # Editar el archivo .env con tus configuraciones
   ```

3. Iniciar los servicios con Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. Acceder a las aplicaciones:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000/api
   - Documentación API: http://localhost:4000/api/schema/swagger-ui/
   - Mongo Express: http://localhost:8081

## 🔧 Desarrollo

### Estructura del Proyecto

```
BazarMatias/
├── backend/                # Aplicación Django
│   ├── authentication/     # Autenticación y autorización
│   ├── inventory/          # Gestión de inventario
│   ├── reports/            # Generación de reportes
│   ├── sales/              # Procesamiento de ventas
│   ├── suppliers/          # Gestión de proveedores
│   └── users/              # Administración de usuarios
├── frontend/               # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── contexts/       # Contextos de React
│   │   ├── hooks/          # Hooks personalizados
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── routes/         # Configuración de rutas
│   │   └── services/       # Servicios de API
└── docker-compose.yml      # Configuración de Docker
```

### Comandos Útiles

#### Backend
```bash
# Entrar al contenedor del backend
docker exec -it backend bash

# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createcustomsuperuser
```

#### Frontend
```bash
# Entrar al contenedor del frontend
docker exec -it frontend sh

# Instalar nuevas dependencias
bun add nombre-paquete

# Ejecutar linter
bun run lint
```

## 📄 API

La API REST está documentada usando DRF Spectacular. Puedes acceder a la documentación interactiva en:

- Swagger UI: http://localhost:4000/api/schema/swagger-ui/
- ReDoc: http://localhost:4000/api/schema/redoc/

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Haz fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

Para preguntas o soporte, por favor abre un issue en el repositorio o contacta al equipo de desarrollo.

---

Desarrollado con ❤️ por el equipo de BazarMatias
