# ✈️ Travel Planner - Web Application MVP

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![CI Backend](https://img.shields.io/badge/CI-Maven%20%2B%20PostgreSQL-6DB33F?logo=githubactions&logoColor=white)](/.github/workflows/maven.yml)
[![CI Frontend](https://img.shields.io/badge/CI-ESLint%20%2B%20Vite%20Build-646CFF?logo=githubactions&logoColor=white)](/.github/workflows/frontend-ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Una aplicación web fullstack diseñada para organizar itinerarios de viajes, gestionar destinos y programar actividades de forma intuitiva y estructurada.

## 🎓 Origen del Proyecto

Este proyecto nace de la **readaptación y evolución de un trabajo práctico universitario**. Con el objetivo de llevar la aplicación a un nivel profesional y convertirla en una pieza sólida para mi portfolio fullstack, se realizaron las siguientes mejoras integrales:

* 🔄 **Migración y Refactorización del Backend**: Reestructuración completa de la API REST en Java con Spring Boot, adoptando una arquitectura limpia en capas (Controllers ➔ Services ➔ Repositories) y desacoplamiento estricto de entidades de dominio mediante DTOs (`RequestDTO` / `ResponseDTO`).
* 🎨 **Rediseño Total del Frontend**: Reconstrucción de la interfaz de usuario desde cero utilizando **React 19**, **TypeScript** y **TailwindCSS v4**, aplicando principios de UX/UI moderna, diseño responsive, componentes modulares y una paleta cromática acorde a la temática de viajes.
* 🐳 **Containerización con Docker**: Toda la infraestructura (backend, frontend y base de datos PostgreSQL) está orquestada mediante Docker Compose, con perfiles diferenciados para **producción** y **desarrollo**.
* ⚙️ **Pipelines de CI/CD**: Integración continua con GitHub Actions para validar automáticamente cada push y Pull Request, tanto en el backend (build + tests contra PostgreSQL real) como en el frontend (lint + build).

---

## 📖 Tabla de Contenidos
- [Origen del Proyecto](#-origen-del-proyecto)
- [Características Principales](#-características-principales)
- [Arquitectura y Tecnologías](#-arquitectura-y-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación de la API](#-documentación-de-la-api)
- [Instalación y Configuración Local](#-instalación-y-configuración-local)
  - [Opción A: Con Docker (Recomendado)](#opción-a-con-docker-recomendado)
  - [Opción B: Sin Docker (Ejecución Manual)](#opción-b-sin-docker-ejecución-manual)
- [Variables de Entorno](#-variables-de-entorno)
- [Pipelines de CI/CD](#-pipelines-de-cicd)
- [Buenas Prácticas y SCM](#-buenas-prácticas-y-scm)
- [Próximos Pasos (Roadmap v2.0)](#-próximos-pasos-roadmap-v20)

---

## ✨ Características Principales

- 👥 **Gestión de Usuarios**: Registro y administración de usuarios en la plataforma.
- 🧳 **Planificación de Viajes**: Creación de itinerarios con título, descripción y rango de fechas (inicio / fin).
- 📍 **Gestión de Destinos**: Asociación jerárquica de múltiples destinos (país, ciudad, notas) a cada planificación.
- ⏰ **Itinerario de Actividades**: Programación detallada de actividades con fecha, hora exacta y anotaciones específicas por destino.
- 🎨 **UI/UX Moderna & Responsive**: Diseñada con una paleta de colores de viaje (turquesa, azul y verde), cards dinámicas, estados de carga y manejo centralizado de errores.
- 🔄 **AuthContext Temporal**: Sistema desacoplado de gestión de sesión mock listo para migrar a autenticación JWT sin modificar los componentes consumidores.
- 📄 **OpenAPI / Swagger UI**: Documentación interactiva de la API disponible automáticamente en desarrollo vía SpringDoc.

---

## 🛠️ Arquitectura y Tecnologías

### **Backend**
- **Lenguaje**: Java 17
- **Framework**: Spring Boot 4.1 (Spring Web MVC, Spring Data JPA)
- **Persistencia**: Hibernate / **PostgreSQL 17** (vía Docker en desarrollo y producción)
- **Documentación API**: SpringDoc OpenAPI 3 (`springdoc-openapi-starter-webmvc-ui`)
- **Herramientas**: Lombok, Maven Wrapper (`mvnw`)
- **Arquitectura**: Controlador - Servicio - Repositorio con mapeo estricto de DTOs (`RequestDTO` / `ResponseDTO`)

### **Frontend**
- **Biblioteca UI**: React 19 + TypeScript
- **Bundler**: Vite 6.x
- **Estilos**: TailwindCSS v4 + PostCSS
- **Enrutamiento**: React Router DOM v7
- **HTTP Client**: Axios (con interceptores globales de respuesta)
- **Servidor de producción**: Nginx (Alpine) dentro del contenedor Docker

### **Infraestructura & DevOps**
- **Contenedores**: Docker + Docker Compose
- **CI/CD**: GitHub Actions (pipelines separados para backend y frontend)
- **Base de datos**: PostgreSQL 17 Alpine (containerizada)

---

## 📁 Estructura del Monorepo

```text
travel-planner/
├── .github/
│   └── workflows/
│       ├── maven.yml              # CI: Build y tests del backend contra PostgreSQL
│       └── frontend-ci.yml        # CI: Lint (ESLint) y Build (Vite) del frontend
├── backend/                       # Proyecto Spring Boot
│   ├── Dockerfile                 # Multi-stage build: JDK (build) → JRE (run)
│   ├── pom.xml
│   └── src/main/java/com/travelplanner/api/
│       ├── controllers/           # Endpoints REST (Usuario, Planificacion, Destino, Actividad)
│       ├── dtos/                  # Data Transfer Objects (Request / Response)
│       ├── models/                # Entidades JPA
│       ├── repositories/          # Interfaces JpaRepository
│       └── services/              # Lógica de negocio
├── frontend/                      # Single Page Application (React + Vite)
│   ├── Dockerfile                 # Multi-stage build: Node (build) → Nginx (serve)
│   ├── nginx.conf                 # Configuración de Nginx para SPA (React Router)
│   └── src/
│       ├── api/                   # Cliente Axios & interceptores
│       ├── components/            # Componentes modulares (Forms, Cards, Managers)
│       ├── context/               # AuthContext (Estado de sesión)
│       ├── layouts/               # MainLayout con Header & Footer
│       ├── pages/                 # Home, Admin, Planificaciones, Destinos, Actividades
│       ├── router/                # Configuración de React Router
│       ├── services/              # Capa de consumo API
│       └── types/                 # Interfaces de TypeScript
├── docker-compose.yml             # Orquestación de producción (build desde Dockerfiles)
├── docker-compose.dev.yml         # Orquestación de desarrollo (hot-reload, sin compilar)
├── .env.example                   # Plantilla de variables de entorno (copiar a .env)
├── API_DOCUMENTATION.md           # Especificación técnica de endpoints REST
└── DEVELOPMENT_GUIDELINES.md      # Guías de SCM, branching strategy y Conventional Commits
```

---

## 🔗 Documentación de la API

La aplicación expone una API RESTful completamente documentada. Puedes consultar la especificación detallada con ejemplos de payload y respuestas en [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

Adicionalmente, en entornos de desarrollo, **SpringDoc OpenAPI** genera automáticamente una interfaz interactiva **Swagger UI** accesible en:

> `http://localhost:8080/swagger-ui/index.html`

### Resumen de Endpoints Principales

| Recurso | Método | Ruta | Descripción |
| :--- | :--- | :--- | :--- |
| **Usuarios** | `POST` | `/api/usuarios` | Registrar nuevo usuario |
| **Usuarios** | `GET` | `/api/usuarios` | Listar todos los usuarios |
| **Planificaciones** | `POST` | `/api/planificaciones` | Crear nuevo viaje para un usuario |
| **Planificaciones** | `GET` | `/api/planificaciones/usuario/{id}` | Listar viajes por usuario |
| **Destinos** | `POST` | `/api/destinos` | Agregar destino a un viaje |
| **Destinos** | `GET` | `/api/destinos/planificacion/{id}` | Listar destinos por viaje |
| **Actividades** | `POST` | `/api/actividades` | Programar actividad en un destino |
| **Actividades** | `GET` | `/api/actividades/destino/{id}` | Listar actividades cronológicas |

---

## 🚀 Instalación y Configuración Local

### **Requisitos Previos**

| Herramienta | Versión mínima | Requerido para |
| :--- | :--- | :--- |
| **Docker Desktop** | Última estable | Opción A (recomendada) |
| **Java JDK** | 17 | Opción B (manual) |
| **Node.js** | 18.0.0 | Opción B (manual) |
| **npm** | 9.0.0 | Opción B (manual) |

---

### **0. Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/travel-planner.git
cd travel-planner
```

---

### **Configurar las variables de entorno**

Antes de levantar cualquier entorno, crea el archivo `.env` a partir de la plantilla incluida:

```bash
cp .env.example .env
```

Luego edita `.env` con tus valores. Consulta la sección [Variables de Entorno](#-variables-de-entorno) para más detalles.

---

### Opción A: Con Docker (Recomendado)

Esta opción levanta toda la infraestructura (PostgreSQL, backend y frontend) de forma automatizada con un solo comando. No requiere tener Java ni Node.js instalados localmente.

#### 🔧 Modo Desarrollo (con hot-reload)

Utiliza `docker-compose.dev.yml`. El backend y el frontend montan el código fuente como volumen, por lo que los cambios se reflejan sin reconstruir las imágenes.

```bash
docker compose -f docker-compose.dev.yml up
```

| Servicio | URL |
| :--- | :--- |
| Frontend (Vite dev server) | `http://localhost:5173` |
| Backend (Spring Boot) | `http://localhost:8080` |
| PostgreSQL | `localhost:5433` |

#### 🚢 Modo Producción

Utiliza `docker-compose.yml`. Construye las imágenes optimizadas desde los `Dockerfile`s (multi-stage build).

```bash
docker compose up --build
```

| Servicio | URL |
| :--- | :--- |
| Frontend (Nginx) | `http://localhost:80` |
| Backend (JAR embebido) | `http://localhost:8080` |
| PostgreSQL | `localhost:5433` |

> Para detener y eliminar los contenedores: `docker compose down`. Para eliminar también los volúmenes (base de datos): `docker compose down -v`.

---

### Opción B: Sin Docker (Ejecución Manual)

#### **1. Levantar el Backend (Spring Boot)**

Asegúrate de tener una instancia de PostgreSQL corriendo y configura las variables de entorno correspondientes (ver `.env.example`).

```bash
cd backend
./mvnw spring-boot:run
```
> El servidor backend iniciará en `http://localhost:8080`.

#### **2. Levantar el Frontend (React + Vite)**
En una nueva terminal:
```bash
cd frontend
npm install
npm run dev
```
> La aplicación web estará disponible en `http://localhost:5173`.

---

## 🔐 Variables de Entorno

El proyecto utiliza un archivo `.env` en la raíz del monorepo que Docker Compose lee automáticamente. Crea este archivo copiando la plantilla:

```bash
cp .env.example .env
```

| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `POSTGRES_DB` | Nombre de la base de datos | `travel_planner_db` |
| `POSTGRES_USER` | Usuario de PostgreSQL | `tp_user` |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL | `una_contrasena_segura` |
| `CORS_ALLOWED_ORIGINS` | Orígenes permitidos para CORS en el backend | `http://localhost:5173` |
| `VITE_BACKEND_API_URL` | URL base de la API consumida por el frontend | `http://localhost:8080` |

> ⚠️ **Nunca subas el archivo `.env` al repositorio.** Está incluido en el `.gitignore`. El archivo `.env.example` es la plantilla pública sin valores sensibles.

---

## ⚙️ Pipelines de CI/CD

El proyecto cuenta con **dos pipelines de GitHub Actions** que se ejecutan automáticamente en cada `push` y `pull_request` hacia las ramas `main`, `develop`, `feature/*` y `fix/*`, **solo cuando hay cambios en el directorio correspondiente** (path filtering).

### 🔵 Backend CI (`maven.yml`)

Levanta un servicio de **PostgreSQL 17** real dentro del runner de GitHub para ejecutar los tests de integración con la base de datos correcta.

| Paso | Detalle |
| :--- | :--- |
| Setup JDK | Temurin 17, con caché de dependencias Maven |
| Servicio PostgreSQL | `postgres:17-alpine` con health check |
| Build & Test | `mvn -B clean verify` contra la BD de CI |
| Dependency Graph | Envío del grafo de dependencias a GitHub para alertas de Dependabot |

### 🟣 Frontend CI (`frontend-ci.yml`)

| Paso | Detalle |
| :--- | :--- |
| Setup Node.js | Node 22, con caché de `npm` |
| Install | `npm install --no-fund` |
| Lint | `npm run lint` (ESLint) |
| Build | `npm run build` (TypeScript + Vite) |

> Un Pull Request cuyas validaciones de CI fallen **no debe ser mergeado** hasta que todos los errores sean corregidos.

---

## 📐 Buenas Prácticas y SCM

El desarrollo de este proyecto sigue estrictos estándares de ingeniería de software:

- **Estrategia de Ramas**: Feature Branch Workflow (`main`, `develop`, `feature/*`, `fix/*`).
- **Conventional Commits**: Mensajes con formato `tipo(alcance): descripción` (ej. `feat(frontend): add planificaciones manager`).
- **Type Safety**: TypeScript estricto sin uso de `any` explícito.
- **Separación de Responsabilidades**: Componentes desacoplados de la lógica de red a través de servicios dedicados.

Para más detalle sobre las directivas de desarrollo, consulta [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md).

---