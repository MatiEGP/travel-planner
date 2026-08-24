# FRONTEND GUIDELINES

Este documento contiene las especificaciones visuales extraídas de los diseños de referencia para guiar el desarrollo de la interfaz de usuario de nuestra aplicación de viajes. 

## 1. Paleta de Colores

### Tema Principal (Wander - Buscador de Alojamientos de Lujo)
*   **Fondo Primario:** Blanco `#FFFFFF`.
*   **Fondo Oscuro (Hero/Footer):** Negro `#000000` o `#111111`.
*   **Texto Principal:** Negro `#000000` sobre fondos claros, Blanco `#FFFFFF` sobre fondos oscuros.
*   **Texto Secundario (Mutado):** Gris oscuro `#555555` o `#717171` (para subtítulos, descripciones de camas/noches, y placeholders).
*   **Acento Positivo (Ahorro):** Verde esmeralda `#008A52` (usado para textos como "$90 less than other sites").
*   **Acento Informativo (Etiquetas):** Azul brillante `#0066FF` (usado en etiquetas flotantes como "Luxury" sobre las imágenes).
*   **Superficies/Botones secundarios:** Gris muy claro `#F7F7F7` o `#EBEBEB` (fondos de inputs en la barra de búsqueda, botones inactivos).
*   **Bordes y Divisores:** Gris claro `#E2E2E2` o `#DDDDDD` para líneas sutiles.

### Tema Secundario (Wanderlog - Planificador de Viajes)
*   **Color de Marca/Acción (Primary):** Naranja/Rojo `#F5533D` (usado en botones principales como "Explora todo", "Nueva lista", "Añadir fechas del viaje", y logos).
*   **Acento Púrpura (IA):** Gradiente o púrpura sólido `#8B5CF6` (usado para el botón "Asistente de IA").
*   **Fondo de Aplicación/Sidebar:** Gris perla/off-white `#F4F5F7` o `#F9F9F9`.
*   **Superficies (Cards):** Blanco `#FFFFFF` con sombras muy sutiles (`box-shadow: 0 1px 4px rgba(0,0,0,0.08)`).
*   **Bordes:** Gris muy claro `#EEEEEE`.

## 2. Tipografía
*   **Familia Tipográfica:** Sans-serif moderna y limpia (estilo Inter, Circular, Roboto o SF Pro).
*   **Pesos:**
    *   **Bold (700) / SemiBold (600):** Títulos principales (H1, H2), nombres de propiedades, precios, nombres de usuario, etiquetas de botones.
    *   **Medium (500):** Subtítulos, elementos de navegación, etiquetas pequeñas.
    *   **Regular (400):** Texto de descripciones largas, placeholders en inputs, detalles menores.
*   **Tamaños (Aproximados):**
    *   Hero H1 (Wander): 48px - 56px, tracking (espaciado de letras) ligeramente negativo.
    *   Section H2: 24px - 28px.
    *   Card Titles: 16px.
    *   Body text / Subtitles: 14px.
    *   Small text (etiquetas, descuentos, reviews): 12px - 13px.

## 3. Componentes UI

### 3.1. Navbars (Barras de Navegación)
**Variante Wander (Búsqueda Central):**
*   **Layout:** Flexbox, `justify-content: space-between`, `align-items: center`. Altura aprox: 80px. Fondo transparente (sobre hero image) o blanco (sobre contenido).
*   **Izquierda:** Logo de la marca "Wander" en texto bold con ícono.
*   **Centro (Píldora de Búsqueda):** 
    *   Contenedor con `border-radius: 999px`. 
    *   Fondo blanco, sombra pronunciada (`box-shadow: 0 4px 20px rgba(0,0,0,0.15)`). 
    *   Dividido internamente con líneas verticales grises muy sutiles.
    *   Campos: "Where" (con ícono de lupa), "When", "Who". Textos en gris claro.
    *   Botón "Search": Negro, redondeado (`border-radius: 999px`), padding horizontal amplio.
*   **Derecha:** Botón secundario redondeado ("List on Wander") fondo gris claro o translúcido, y botón de menú hamburguesa.

**Variante Wanderlog (Dashboard de Planificación):**
*   **Navbar Superior:** Fondo blanco, altura ~60px, borde inferior gris. 
    *   Izquierda: Controles de "Deshacer/Rehacer".
    *   Centro: Selector "Plan de viaje".
    *   Derecha: Botones oscuros ("Compartir", "Descarga la app"), menú de 3 puntos, avatar de usuario circular.
*   **Sidebar Izquierdo (Wanderlog):** 
    *   Fondo blanco. Ancho fijo (aprox 240px). 
    *   Menú de navegación vertical. Elemento activo ("Notas") con fondo gris claro y borde izquierdo (o indicador visual).
    *   Incluye botón flotante y llamativo "Asistente de IA" que sobresale del sidebar con forma de pestaña redondeada (color púrpura/magenta).

### 3.2. Botones (Buttons)
*   **Primary (Wanderlog - Acciones principales):**
    *   Fondo Naranja/Rojo (`#F5533D`). Texto en blanco, Bold. `border-radius: 999px` (píldora) o `8px` dependiendo de si es botón de acción rápida o formulario.
*   **Primary (Wander - Búsqueda):**
    *   Fondo Negro. Texto Blanco. `border-radius: 999px`.
*   **Secondary / Neutral:**
    *   Fondo blanco o gris muy claro con borde sutil. Texto en negro. Ej: botones "+", "Añadir un lugar", "Editar".
*   **Icon Buttons:** 
    *   Botón de favorito (Corazón): Transparente con borde blanco cuando no está seleccionado, ubicado en la esquina superior derecha de las imágenes de las cards.

### 3.3. Cards (Tarjetas de contenido)

**Variante: Propiedades (Wander Grid)**
*   **Contenedor principal:** Sin fondo ni bordes visibles. La estructura la da la imagen y el texto inferior.
*   **Imagen:** 
    *   Aspect ratio cercano a 1:1 o 4:3. 
    *   `border-radius: 12px`. 
    *   Debe llenar el ancho del contenedor.
*   **Superposiciones (Overlays) sobre la imagen:**
    *   Top Left: Badge "Luxury". Fondo azul brillante, texto e ícono de estrella en blanco. `border-radius: 4px`, padding pequeño (ej. 4px 8px).
    *   Top Right: Ícono de corazón (Stroke blanco, sin relleno).
*   **Información (Debajo de la imagen):**
    *   Padding top: ~12px.
    *   Fila 1 (Flex between): Nombre de propiedad (Bold, 16px) + Puntuación (Ícono estrella negra + "4.5" a la derecha).
    *   Fila 2: Detalles (Ej. "3 beds - $1,095 for 2 nights"). Color gris (`#717171`), 14px.
    *   Fila 3: Mensaje promocional (Ej. "+$90 less than other sites"). Color verde (`#008A52`), 13px.

**Variante: Lugares / Guías (Wanderlog)**
*   **Contenedor:** Fondo blanco, `border-radius: 12px`, borde gris muy sutil (`1px solid #E2E2E2`) o sombra ligera.
*   **Estructura:** 
    *   Imagen superior (`border-radius: 12px 12px 0 0`, ancho completo).
    *   Contenido inferior con padding (16px).
    *   Título (Bold, negro).
    *   Subtítulo (Regular, gris).
    *   Avatar pequeño del autor + Nombre en la parte inferior.

**Variante: Feature Cards (Wander Sección Oscura)**
*   Fondo negro.
*   Ícono pequeño en un contenedor cuadrado redondeado gris oscuro.
*   Título en blanco (Bold).
*   Texto descriptivo en gris (Regular).

### 3.4. Inputs y Listas (Planificador)
*   **Campos "Añadir un lugar":** Contenedores rectangulares con `border-radius: 8px`. Fondo gris muy claro. Placeholder con ícono de pin de ubicación. A la derecha, botones de acciones rápidas (íconos de notas, listas).
*   **Items de Lista Recomendados:** Pequeñas píldoras o cards horizontales con una imagen miniatura a la izquierda, nombre del lugar, y un botón "+" a la derecha para añadir.

## 4. Layout y Espaciado

### Sistema de Grid y Contenedores
*   **Wander (Grid de Alojamientos):** Uso intensivo de CSS Grid. 
    *   Desktop: 4 columnas (`grid-template-columns: repeat(4, 1fr)`).
    *   Gap (espaciado entre columnas y filas): ~24px a 32px.
*   **Max Width:** Los layouts principales (como el grid de propiedades) parecen tener un ancho máximo de contenedor (ej. `max-width: 1280px` o `1440px`) centrado con `margin: 0 auto` y padding lateral de ~40px.

### Secciones Específicas
*   **Wander Hero (Imagen de fondo):**
    *   La imagen cubre todo el header. Navbar flotante encima.
    *   Texto "Find your happy place" centrado vertical y horizontalmente.
    *   Tipografía muy grande, sombra de texto ligera para legibilidad sobre la imagen.
*   **Wander Feature Section (Fondo Negro):**
    *   Layout de 2 columnas (50% / 50%).
    *   Izquierda: Texto grande ("The way travel should be...") y una imagen de demostración superpuesta.
    *   Derecha: Grid interno de 2x3 o 2x2 para las características (ícono + título + texto).
*   **Wanderlog Dashboard (Planificador):**
    *   Layout de 3 columnas principales: 
        1. Sidebar izquierdo (navegación y Asistente IA).
        2. Columna central (Principal): Ancha, contiene el hero banner de la ciudad ("Viaje a Argentina"), carruseles de lugares explorados, e inputs para añadir itinerario.
        3. Columna derecha (Secundaria): Menos ancha, contiene herramientas adicionales, mapa, etc.

## 5. Detalles Visuales Adicionales
*   **Bordes Redondeados (Border Radius):** Se usan de manera consistente.
    *   Cards e Imágenes principales: `12px` o `16px`.
    *   Botones pequeños / Inputs: `8px`.
    *   Barras de búsqueda principales / Botones CTA primarios: `999px` (Completamente redondeados).
*   **Avatares:** Siempre circulares (`border-radius: 50%`).
*   **Sombras (Box Shadows):** Se usan principalmente de forma sutil en componentes flotantes (como la barra de búsqueda central o el botón flotante de IA) para crear profundidad sobre los elementos de fondo, mientras que las tarjetas del grid principal son planas.
