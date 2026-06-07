# Women in Tech - Frontend

Frontend oficial de la plataforma **Women in Tech**, desarrollado con Vue 3 y Vite.

## Descripción

Esta aplicación web permite a los usuarios consultar información sobre:

* Eventos
* Programas
* Comunidad
* Recursos
* Testimonios
* Información institucional

Además incluye un panel administrativo para la gestión del contenido del sitio.

## Tecnologías utilizadas

* Vue 3
* Vue Router
* Pinia
* Axios
* Tailwind CSS
* Vite

## Requisitos

* Node.js 20+
* npm 10+

## Instalación

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Ingresar al proyecto:

```bash
cd woman-in-tech-frontend/frontend
```

Instalar dependencias:

```bash
npm install
```

## Ejecución en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en:

```text
http://localhost:5173
```

## Build de producción

```bash
npm run build
```

## Estructura del proyecto

```text
src/
├── assets/
├── components/
├── layouts/
├── pages/
│   ├── admin/
│   └── public/
├── router/
├── services/
├── stores/
├── utils/
└── App.vue
```

## Funcionalidades

### Sitio Público

* Página principal
* Sobre nosotros
* Eventos
* Programas
* Comunidad
* Recursos
* Testimonios
* Contacto

### Panel Administrativo

* Gestión de eventos
* Gestión de programas
* Gestión de recursos
* Gestión de testimonios
* Gestión de miembros de la comunidad
* Gestión de intereses
* Autenticación de administradores

## Autores

Proyecto desarrollado por Daniel Lancheros y Juan Giraldo, para la asignatura de Informática Social.
