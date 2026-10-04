# 🧭 Fuimonos — Travel Planner v1.2.0

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-4.x-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![CI Backend](https://img.shields.io/badge/CI-Maven%20%2B%20JaCoCo-6DB33F?logo=githubactions&logoColor=white)](/.github/workflows/maven.yml)
[![CI Frontend](https://img.shields.io/badge/CI-ESLint%20%2B%20Vitest%20%2B%20Build-646CFF?logo=githubactions&logoColor=white)](/.github/workflows/frontend-ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Fuimonos** es una aplicación web fullstack para organizar itinerarios de viajes, gestionar destinos, programar actividades y controlar gastos — todo desde una interfaz moderna con soporte de modo oscuro.

## 🎓 Origen del Proyecto

Este proyecto nace de la **readaptación y evolución de un trabajo práctico universitario**. Con el objetivo de llevarlo a un nivel profesional y convertirlo en una pieza sólida de portfolio fullstack, se realizaron mejoras integrales a lo largo de múltiples versiones:

* 🏗️ **Arquitectura Profesional**: Backend reestructurado con **Package-by-Feature** y frontend migrado a **Feature-Sliced Design (FSD)**, priorizando cohesión de dominio sobre capas técnicas.
* 🎨 **Rediseño Total de UI/UX**: Interfaz reconstruida con **React 19**, **TypeScript 6** y **TailwindCSS v4**, aplicando glassmorfismo, paleta Coral + Slate, modo oscuro y transiciones fluidas con Framer Motion.
* 🔐 **Seguridad Robusta**: Autenticación JWT con **Refresh Tokens** vía cookies `HttpOnly`, interceptores automáticos de renovación y protección de rutas por rol.
* 🐳 **Containerización con Docker**: Infraestructura completa orquestada con Docker Compose, con perfiles diferenciados para producción y desarrollo.
* 🧪 **Testing & CI/CD**: Suites de tests en ambos extremos (**Vitest** + Testing Library en frontend, **JUnit** + JaCoCo en backend) con pipelines de GitHub Actions que verifican lint, build, tests y cobertura en cada push.

---

## 📖 Tabla de Contenidos
- [Origen del Proyecto](#-origen-del-proyecto)
- [Características Principales](#-características-principales)
- [Arquitectura y Tecnologías](#️-arquitectura-y-tecnologías)
- [Estructura del Proyecto](#-estructura-del-monorepo)
- [Documentación de la API](#-documentación-de-la-api)
- [Instalación y Configuración Local](#-instalación-y-configuración-local)
  - [Opción A: Con Docker (Recomendado)](#opción-a-con-docker-recomendado)
  - [Opción B: Sin Docker (Ejecución Manual)](#opción-b-sin-docker-ejecución-manual)
- [Variables de Entorno](#-variables-de-entorno)
- [Pipelines de CI/CD](#️-pipelines-de-cicd)
- [Buenas Prácticas y SCM](#-buenas-prácticas-y-scm)

---

## ✨ Características Principales

- 🔐 **Autenticación JWT + Refresh Tokens**: Spring Security con tokens de acceso `Bearer` y renovación automática mediante Refresh Tokens almacenados en cookies `HttpOnly`. Control de acceso basado en roles (`ADMIN` / `CLIENT`).
- 🌙 **Modo Oscuro**: Soporte completo de tema claro/oscuro con toggle persistente y transiciones suaves.
- 🧳 **Planificación de Viajes**: Creación de itinerarios con título, descripción y rango de fechas, con selectores de calendario y formularios validados con Zod.
- 📍 **Gestión de Destinos**: Asociación jerárquica de múltiples destinos (país, ciudad, notas) a cada planificación.
- 📅 **Itinerario Detallado**: Cronograma organizado por días con ítems individuales (actividades, traslados, alojamiento) ordenados por hora.
- 💰 **Control de Gastos**: Registro y seguimiento de costos por categoría asociados a cada viaje.
- ⏰ **Actividades por Destino**: Programación detallada de actividades con fecha, hora exacta y anotaciones específicas.
- 🎨 **UI/UX Moderna**: Landing page "Yendiendo" con glassmorfismo, transiciones de página con overlay animado, barra de progreso global y diseño responsive con paleta Coral + Slate.
- 📄 **OpenAPI / Swagger UI**: Documentación interactiva de la API generada automáticamente por SpringDoc, con soporte para autorización Bearer JWT.

---

## 🛠️ Arquitectura y Tecnologías

### **Backend**
- **Lenguaje**: Java 17
- **Framework**: Spring Boot 4.1 (Spring Web MVC, Spring Data JPA, Spring Security)
- **Seguridad**: JWT (JJWT) con Access + Refresh Tokens, BCrypt Password Encoder, cookies `HttpOnly`
- **Persistencia**: Hibernate / **PostgreSQL 17** (vía Docker en desarrollo y producción)
- **Documentación API**: SpringDoc OpenAPI 3 (`springdoc-openapi-starter-webmvc-ui`)
- **Testing**: JUnit 5 + Mockito + JaCoCo (cobertura)
- **Herramientas**: Lombok, Maven Wrapper (`mvnw`)
- **Arquitectura**: **Package-by-Feature** — cada feature (`auth`, `planificaciones`, `destinos`, `actividades`, `usuarios`) agrupa su controlador, servicio, repositorio, entidades y DTOs

### **Frontend**
- **Biblioteca UI**: React 19 + TypeScript 6
- **Bundler**: Vite 8.x
- **Estilos**: TailwindCSS v4 + PostCSS
- **Animaciones**: Framer Motion
- **Enrutamiento**: React Router DOM v7
- **Formularios**: React Hook Form + Zod (validación de esquemas)
- **HTTP Client**: Axios (con interceptores de refresh token y cancelación vía AbortController)
- **Testing**: Vitest 4.x + Testing Library (React, jest-dom, user-event) + cobertura v8
- **Servidor de producción**: Nginx (Alpine) dentro del contenedor Docker
- **Arquitectura**: **Feature-Sliced Design (FSD)** — dominio organizado en `features/` con slices independientes (`api/`, `components/`, `containers/`, `pages/`, `types/`)

### **Infraestructura & DevOps**
- **Contenedores**: Docker + Docker Compose
- **CI/CD**: GitHub Actions (pipelines separados para backend y frontend con upload de reportes de cobertura)
- **Base de datos**: PostgreSQL 17 Alpine (containerizada)

---

## 📁 Estructura del Monorepo

```text
travel-planner/
├── .github/
│   └── workflows/
│       ├── maven.yml              # CI: Build, tests y cobertura JaCoCo del backend
│       └── frontend-ci.yml        # CI: Lint, build, tests y cobertura Vitest del frontend
├── backend/                       # API REST — Spring Boot (Package-by-Feature)
│   ├── Dockerfile                 # Multi-stage build: JDK (build) → JRE (run)
│   ├── pom.xml
│   ├── API_DOCUMENTATION.md       # Especificación técnica detallada de endpoints REST
│   └── src/main/java/com/travelplanner/api/
│       ├── actividades/           # Feature: Actividades (entity, controller, service, repo, DTOs)
│       ├── auth/                  # Feature: Autenticación (JWT, refresh tokens, login/registro)
│       ├── config/                # Seguridad (SecurityConfig, JwtAuthFilter, CorsConfig, OpenAPI)
│       ├── destinos/              # Feature: Destinos (entity, controller, service, repo, DTOs)
│       ├── exceptions/            # Manejo centralizado de excepciones
│       ├── planificaciones/       # Feature: Planificaciones, Costos e Itinerarios
│       └── usuarios/              # Feature: Usuarios y Roles
├── frontend/                      # SPA — React + Vite (Feature-Sliced Design)
│   ├── Dockerfile                 # Multi-stage build: Node (build) → Nginx (serve)
│   ├── nginx.conf                 # Configuración de Nginx para SPA (React Router)
│   ├── FRONTEND_GUIDELINES.md     # Guías de diseño: paleta Coral+Slate, glassmorfismo, layouts
│   └── src/
│       ├── components/            # Componentes reutilizables (landing, itinerary, ui pickers)
│       ├── context/               # ThemeContext (modo oscuro)
│       ├── features/              # Slices de dominio FSD
│       │   ├── actividades/       #   api/, components/, containers/, pages/, types/
│       │   ├── auth/              #   api/, containers/, context/ (AuthContext), pages/
│       │   ├── destinos/          #   api/, components/, containers/, pages/, types/
│       │   ├── planificaciones/   #   api/ (costo, itinerario, planificacion), components/, pages/
│       │   └── usuarios/          #   api/, components/, containers/, pages/, types/
│       ├── layouts/               # AuthLayout, RootLayout, MainLayout, PlannerLayout
│       ├── router/                # Configuración de React Router
│       ├── shared/                # API client (Axios + tokenStore), AppShell, ErrorBoundary, Header
│       └── utils/                 # Utilidades (tripUtils)
├── docker-compose.prod.yml        # Orquestación de producción (build desde Dockerfiles)
├── docker-compose.dev.yml         # Orquestación de desarrollo (hot-reload, sin compilar)
├── .env.example                   # Plantilla de variables de entorno (copiar a .env)
└── DEVELOPMENT_GUIDELINES.md      # Guías de SCM, branching strategy y Conventional Commits
```

---

## 🔗 Documentación de la API

La aplicación expone una API RESTful completamente documentada. Puedes consultar la especificación detallada con ejemplos de payload y respuestas en [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md).

En entornos de desarrollo, **SpringDoc OpenAPI** genera automáticamente una interfaz interactiva **Swagger UI** accesible en:

> `http://localhost:8080/swagger-ui/index.html` *(incluye botón **Authorize** para autenticación Bearer)*

### Resumen de Endpoints Principales

| Recurso | Método | Ruta | Acceso / Rol | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| **Autenticación** | `POST` | `/api/auth/registro` | Público | Registrar nuevo usuario (`CLIENT`) |
| **Autenticación** | `POST` | `/api/auth/login` | Público | Iniciar sesión (devuelve access token + refresh cookie) |
| **Autenticación** | `POST` | `/api/auth/refresh` | Cookie | Renovar access token mediante refresh token |
| **Autenticación** | `POST` | `/api/auth/logout` | Autenticado | Cerrar sesión e invalidar refresh token |
| **Autenticación** | `GET` | `/api/auth/me` | Autenticado | Obtener datos de la sesión activa |
| **Usuarios** | `GET` | `/api/usuarios` | `ADMIN` | Listar todos los usuarios del sistema |
| **Planificaciones**| `POST` | `/api/planificaciones` | `CLIENT` / `ADMIN` | Crear nuevo viaje para un usuario |
| **Planificaciones**| `GET` | `/api/planificaciones/usuario/{id}` | `CLIENT` / `ADMIN` | Listar viajes por usuario |
| **Destinos** | `POST` | `/api/destinos` | `CLIENT` / `ADMIN` | Agregar destino a un viaje |
| **Destinos** | `GET` | `/api/destinos/planificacion/{id}` | `CLIENT` / `ADMIN` | Listar destinos por viaje |
| **Actividades** | `POST` | `/api/actividades` | `CLIENT` / `ADMIN` | Programar actividad en un destino |
| **Actividades** | `GET` | `/api/actividades/destino/{id}` | `CLIENT` / `ADMIN` | Listar actividades cronológicas |
| **Costos** | `POST` | `/api/costos` | `CLIENT` / `ADMIN` | Registrar un costo/gasto |
| **Costos** | `GET` | `/api/costos/planificacion/{id}` | `CLIENT` / `ADMIN` | Listar costos de un viaje |
| **Itinerarios** | `GET` | `/api/itinerarios/planificacion/{id}/dias` | `CLIENT` / `ADMIN` | Listar cronograma por días e ítems |

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
git clone https://github.com/MatiEGP/travel-planner.git
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

Utiliza `docker-compose.prod.yml`. Construye las imágenes optimizadas desde los `Dockerfile`s (multi-stage build).

```bash
docker compose -f docker-compose.prod.yml up --build
```

| Servicio | URL |
| :--- | :--- |
| Frontend (Nginx) | `http://localhost:80` |
| Backend (JAR embebido) | `http://localhost:8080` |
| PostgreSQL | `localhost:5433` |

> Para detener los contenedores: `docker compose -f docker-compose.prod.yml down` (o `-f docker-compose.dev.yml down`). Para eliminar también los volúmenes de base de datos: agregar `-v`.

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

#### **3. Ejecutar Tests**
```bash
# Backend
cd backend
./mvnw test

# Frontend
cd frontend
npm run test              # Tests sin cobertura
npm run test:coverage     # Tests con reporte de cobertura v8
```

---

## 🔐 Variables de Entorno

El proyecto utiliza un archivo `.env` en la raíz del monorepo que Docker Compose lee automáticamente. Crea este archivo copiando la plantilla:

```bash
cp .env.example .env
```

| Variable | Descripción | Ejemplo / Default |
| :--- | :--- | :--- |
| `POSTGRES_DB` | Nombre de la base de datos | `travel_planner_db` |
| `POSTGRES_USER` | Usuario de PostgreSQL | `tp_user` |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL | `una_contrasena_segura` |
| `CORS_ALLOWED_ORIGINS` | Orígenes permitidos para CORS en el backend | `http://localhost:5173` |
| `VITE_BACKEND_API_URL` | URL base de la API consumida por el frontend | `http://localhost:8080` |
| `JWT_SECRET` | Clave simétrica HMAC-SHA256 (mín. 256 bits en Base64URL) | `base64url_encoded_secret_key` |
| `JWT_EXPIRATION_MS` | Tiempo de vida del access token en ms | `86400000` (24h dev) / `900000` (15m prod) |
| `JWT_REFRESH_EXPIRATION_MS` | Tiempo de vida del refresh token en ms | `604800000` (7 días) |
| `JWT_COOKIE_SECURE` | Flag `Secure` para cookies `HttpOnly` (HTTPS) | `false` (dev) / `true` (prod) |
| `SWAGGER_ENABLED` | Habilita o deshabilita Swagger UI / OpenAPI docs | `true` (dev) / `false` (prod) |

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
| Coverage Report | Upload de reporte JaCoCo como artefacto (retención 14 días) |
| Dependency Graph | Envío del grafo de dependencias a GitHub para alertas de Dependabot |

### 🟣 Frontend CI (`frontend-ci.yml`)

| Paso | Detalle |
| :--- | :--- |
| Setup Node.js | Node 22, con caché de `npm` |
| Install | `npm install --no-fund` |
| Lint | `npm run lint` (ESLint) |
| Build | `npm run build` (TypeScript + Vite) |
| Test & Coverage | `npm run test:coverage` (Vitest + v8 coverage) |
| Coverage Report | Upload de reporte de cobertura como artefacto (retención 14 días) |

> Un Pull Request cuyas validaciones de CI fallen **no debe ser mergeado** hasta que todos los errores sean corregidos.

---

## 📐 Buenas Prácticas y SCM

El desarrollo de este proyecto sigue estrictos estándares de ingeniería de software:

- **Estrategia de Ramas**: Git Flow (`main`, `develop`, `feature/*`, `fix/*`, `release/*`).
- **Conventional Commits**: Mensajes con formato `tipo(alcance): descripción` (ej. `feat(frontend): add planificaciones manager`).
- **Type Safety**: TypeScript estricto sin uso de `any` explícito.
- **Arquitectura por Dominio**: Backend en Package-by-Feature y frontend en Feature-Sliced Design, priorizando cohesión de negocio sobre capas técnicas.
- **Validación de Formularios**: Esquemas declarativos con Zod + React Hook Form.
- **Testing**: Vitest con Testing Library en frontend; JUnit 5 con Mockito y JaCoCo en backend.
- **Separación de Responsabilidades**: Componentes de presentación desacoplados de lógica de red mediante servicios y hooks dedicados.

Para más detalle sobre las directivas de desarrollo, consulta [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md). Para las guías de diseño visual del frontend, consulta [frontend/FRONTEND_GUIDELINES.md](./frontend/FRONTEND_GUIDELINES.md).

---