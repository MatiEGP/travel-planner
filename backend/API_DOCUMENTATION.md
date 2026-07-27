# API Documentation - Travel Planner MVP

Esta documentación detalla los endpoints expuestos por el backend de la aplicación **Travel Planner**. Cada recurso cuenta con sus respectivas rutas, métodos HTTP, parámetros esperados y tipos de respuesta. Esta guía está orientada a facilitar la integración con el frontend.

---

## 1. Usuarios (`/api/usuarios`)

Endpoints para la gestión de usuarios. Actualmente permite crear usuarios libremente y listarlos, útil para propósitos del MVP y desarrollo del frontend.

### 1.1 Registrar Usuario
- **Ruta:** `POST /api/usuarios`
- **Descripción:** Crea un nuevo usuario en la base de datos.
- **Request Body (`UsuarioRequestDTO`):**
  ```json
  {
    "nombre": "String",
    "email": "String",
    "password": "String"
  }
  ```
- **Response `201 Created` (`UsuarioResponseDTO`):**
  ```json
  {
    "id": 1,
    "nombre": "String",
    "email": "String",
    "fechaRegistro": "2023-10-27T10:00:00" // Formato LocalDateTime
  }
  ```

### 1.2 Obtener Usuario por ID
- **Ruta:** `GET /api/usuarios/{id}`
- **Parámetros de Ruta:** `id` (Long) - ID del usuario.
- **Descripción:** Retorna los datos de un usuario específico.
- **Response `200 OK` (`UsuarioResponseDTO`):** (Ver estructura arriba).

### 1.3 Listar Todos los Usuarios
- **Ruta:** `GET /api/usuarios`
- **Descripción:** Obtiene un listado de todos los usuarios registrados.
- **Response `200 OK`:** Arreglo de objetos `UsuarioResponseDTO`.

---

## 2. Planificaciones (`/api/planificaciones`)

Endpoints para gestionar los viajes/planificaciones de los usuarios.

### 2.1 Crear Planificación
- **Ruta:** `POST /api/planificaciones`
- **Descripción:** Crea una nueva planificación vinculada a un usuario específico.
- **Request Body (`PlanificacionRequestDTO`):**
  ```json
  {
    "usuarioId": 1,          // ID del usuario dueño de la planificación
    "titulo": "String",
    "descripcion": "String",
    "fechaInicio": "YYYY-MM-DD", // Formato LocalDate
    "fechaFin": "YYYY-MM-DD"     // Formato LocalDate
  }
  ```
- **Response `201 Created` (`PlanificacionResponseDTO`):**
  ```json
  {
    "id": 1,
    "titulo": "String",
    "descripcion": "String",
    "fechaInicio": "YYYY-MM-DD",
    "fechaFin": "YYYY-MM-DD"
  }
  ```

### 2.2 Obtener Planificación por ID
- **Ruta:** `GET /api/planificaciones/{id}`
- **Parámetros de Ruta:** `id` (Long) - ID de la planificación.
- **Descripción:** Retorna los detalles de una planificación.
- **Response `200 OK` (`PlanificacionResponseDTO`):** (Ver estructura arriba).

### 2.3 Listar Planificaciones de un Usuario
- **Ruta:** `GET /api/planificaciones/usuario/{usuarioId}`
- **Parámetros de Ruta:** `usuarioId` (Long) - ID del usuario.
- **Descripción:** Retorna todas las planificaciones creadas por un usuario determinado.
- **Response `200 OK`:** Arreglo de objetos `PlanificacionResponseDTO`.

### 2.4 Eliminar Planificación
- **Ruta:** `DELETE /api/planificaciones/{id}`
- **Parámetros de Ruta:** `id` (Long) - ID de la planificación.
- **Descripción:** Elimina una planificación existente.
- **Response `204 No Content`:** Sin contenido en el body.

---

## 3. Destinos (`/api/destinos`)

Endpoints para gestionar los destinos correspondientes a una planificación de viaje.

### 3.1 Crear Destino
- **Ruta:** `POST /api/destinos`
- **Descripción:** Agrega un nuevo destino a una planificación existente.
- **Request Body (`DestinoRequestDTO`):**
  ```json
  {
    "planificacionId": 1, // ID de la planificación a la que pertenece
    "nombre": "String",
    "pais": "String",
    "ciudad": "String",
    "notas": "String"
  }
  ```
- **Response `201 Created` (`DestinoResponseDTO`):**
  ```json
  {
    "id": 1,
    "nombre": "String",
    "pais": "String",
    "ciudad": "String",
    "notas": "String"
  }
  ```

### 3.2 Obtener Destino por ID
- **Ruta:** `GET /api/destinos/{id}`
- **Parámetros de Ruta:** `id` (Long) - ID del destino.
- **Descripción:** Retorna los detalles de un destino.
- **Response `200 OK` (`DestinoResponseDTO`):** (Ver estructura arriba).

### 3.3 Listar Destinos de una Planificación
- **Ruta:** `GET /api/destinos/planificacion/{planificacionId}`
- **Parámetros de Ruta:** `planificacionId` (Long) - ID de la planificación.
- **Descripción:** Retorna todos los destinos asociados a una planificación específica.
- **Response `200 OK`:** Arreglo de objetos `DestinoResponseDTO`.

### 3.4 Eliminar Destino
- **Ruta:** `DELETE /api/destinos/{id}`
- **Parámetros de Ruta:** `id` (Long) - ID del destino.
- **Descripción:** Elimina un destino específico.
- **Response `204 No Content`:** Sin contenido en el body.

---

## 4. Actividades (`/api/actividades`)

Endpoints para organizar las actividades de un destino en particular.

### 4.1 Crear Actividad
- **Ruta:** `POST /api/actividades`
- **Descripción:** Agrega una actividad o evento a realizar dentro de un destino.
- **Request Body (`ActividadRequestDTO`):**
  ```json
  {
    "destinoId": 1, // ID del destino asociado
    "nombre": "String",
    "fechaHora": "YYYY-MM-DDTHH:MM:SS", // Formato LocalDateTime
    "notas": "String"
  }
  ```
- **Response `201 Created` (`ActividadResponseDTO`):**
  ```json
  {
    "id": 1,
    "nombre": "String",
    "fechaHora": "YYYY-MM-DDTHH:MM:SS",
    "notas": "String"
  }
  ```

### 4.2 Obtener Actividad por ID
- **Ruta:** `GET /api/actividades/{id}`
- **Parámetros de Ruta:** `id` (Long) - ID de la actividad.
- **Descripción:** Retorna los detalles de una actividad específica.
- **Response `200 OK` (`ActividadResponseDTO`):** (Ver estructura arriba).

### 4.3 Listar Actividades de un Destino
- **Ruta:** `GET /api/actividades/destino/{destinoId}`
- **Parámetros de Ruta:** `destinoId` (Long) - ID del destino.
- **Descripción:** Lista todas las actividades programadas para un destino particular (Nota: el backend las devuelve ordenadas por fecha/hora ascendente).
- **Response `200 OK`:** Arreglo de objetos `ActividadResponseDTO`.

### 4.4 Eliminar Actividad
- **Ruta:** `DELETE /api/actividades/{id}`
- **Parámetros de Ruta:** `id` (Long) - ID de la actividad.
- **Descripción:** Elimina una actividad.
- **Response `204 No Content`:** Sin contenido en el body.
