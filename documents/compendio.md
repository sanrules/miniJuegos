# 📘 Compendio de Arquitectura — MiniJuegos de Banderas

## 1. Stack Tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | React | ^18.3.1 |
| Build | Vite | ^5.4.11 |
| Lenguaje | TypeScript | ^5.7.2 |
| Estilos | Tailwind CSS | ^3.4.15 |
| Animaciones | Framer Motion | ^12.42.2 |
| Efectos | canvas-confetti | ^1.9.4 |
| Mapamundi | react-simple-maps | ^3.0.0 |
| Banderas | flagcdn.com (SVG) | — |
| Voz | Web Speech API | — |
| Sonido | Web Audio API | — |

## 2. Estructura del Proyecto

```
src/
  App.tsx                     ← Orquestador: máquina de estados de pantallas
  data/
    countries.ts              ← Modelo de datos: 193 países + niveles + animales
  hooks/
    useSpeech.ts              ← Motor de voz (Web Speech API)
    useAdaptiveLearning.ts    ← Algoritmo adaptativo (pesos + localStorage)
    useLevelGreeting.ts       ← Saludo único por nivel
  utils/
    game.ts                   ← Constantes, tipos compartidos, distractores experto
    audio.ts                  ← Efectos de sonido (Web Audio API)
  components/
    WelcomeScreen (en App.tsx) ← Pantalla de inicio
    LevelSelection.tsx         ← Selección de nivel (4 modos)
    MapSelection.tsx           ← Selección de continente
    GameSelection.tsx          ← Selección de minijuego (6 juegos)
    AdivinaJuego.tsx           ← Juego 1: Adivina la bandera
    ParejasJuego.tsx           ← Juego 2: Hacer parejas
    RascaJuego.tsx             ← Juego 3: Rasca y descubre (bloques)
    IntrusoJuego.tsx           ← Juego 4: El intruso
    LluviaJuego.tsx            ← Juego 5: Lluvia de banderas
    PuzleJuego.tsx             ← Juego 6: El puzle roto
    CucuJuego.tsx              ← Juego 7: Cucú
    AnimalesJuego.tsx          ← Juego 8: La bandera de los animales
    AtlasInteractivo.tsx       ← Módulo 9: Atlas interactivo
    Celebration.tsx            ← Pantalla de celebración (post-partida)
```

## 3. Sistema de Navegación (App.tsx)

La aplicación usa una máquina de estados tipada con TypeScript:

```typescript
type Screen =
  | { type: 'welcome' }
  | { type: 'atlas' }
  | { type: 'level' }
  | { type: 'map'; level: Level }
  | { type: 'gameSelection'; level: Level; continent: Continent | null }
  | { type: 'game'; level: Level; game: GameId; continent: Continent | null }
  | { type: 'celebration'; score: number; game: GameId; level: Level; continent: Continent | null };
```

Flujo de navegación:

```
Bienvenida → Atlas (mapamundi)
           → Nivel → ¿Continentes? → Mapa → Selección de juego → Juego → Celebración
                   → Otros niveles → Selección de juego → Juego → Celebración
```

Todas las transiciones entre pantallas están protegidas por una guardia `navigateRef` (400ms) que evita dobles clics.

## 4. Modelo de Datos (src/data/countries.ts)

### 4.1 Interfaz Country

```typescript
interface Country {
  code: string;        // Código ISO 3166-1 alfa-2 ("ES", "JP")
  name: string;        // Nombre en español ("España", "Japón")
  capital: string;     // Capital ("Madrid", "Tokio")
  continent: 'EU' | 'AS' | 'AF' | 'AM' | 'OC';
  difficulty: 1 | 2 | 3;  // 1: Fácil, 2: Medio, 3: Difícil
  colorGroup: string;  // Agrupación por colores ("red-yellow", "tricolor")
  similar: string[];   // 3 códigos de banderas visualmente parecidas
  numCode: number;     // Código numérico ISO 3166-1
}
```

### 4.2 Catálogo

El catálogo contiene **193 países** con datos curados para los 48 originales y generados para los 145 restantes. Cada país tiene campos de dificultad, grupo de color, banderas similares y capital.

### 4.3 Sistemas de Agrupación

- **Continentes**: `EU` (Europa), `AS` (Asia), `AF` (África), `AM` (América), `OC` (Oceanía)
- **Dificultad**: 1 (Fácil, banderas icónicas), 2 (Medio), 3 (Difícil)
- **colorGroup**: Agrupaciones cromáticas para el juego del Intruso

### 4.4 Animales

21 animales mapeados a países (ej: 🐼 panda → CN, 🦁 león → KE, ZA, TZ). Cada entrada tiene `emoji`, `name` y `countryCodes[]`.

### 4.5 Niveles de Juego

| Nivel | Emoji | Filtro | Comportamiento |
|---|---|---|---|
| Explorador | 🧭 | difficulty === 1 | Solo banderas fáciles |
| Continentes | 🗺️ | continent === seleccionado | Filtra por continente |
| Mundial | 🌍 | Todos | Prioriza países con peso alto (más fallados) |
| Experto | 👑 | Todos | Usa distractores del array `similar` |

## 5. Hooks Compartidos

### 5.1 useSpeech.ts — Motor de Voz

- Envuelve `window.speechSynthesis`
- Busca voz en español (`es-ES`, `es-MX`, `es-AR`, etc.)
- Configuración: `pitch: 1.2`, `rate: 0.95`
- **Cancelación automática**: cada llamada a `speak()` ejecuta `speechSynthesis.cancel()` antes de hablar
- Expone: `{ speak, isSupported, isSpeaking, cancel }`

### 5.2 useAdaptiveLearning.ts — Algoritmo Adaptativo

- **Persistencia**: `localStorage` clave `flags-adaptive-weights`
- **Pesos**: cada país inicia con peso 10
  - Acierto: `-3` (mínimo 1)
  - Fallo: `+5` (sin límite superior)
- **Selección ponderada**: `P(i) = weight[i] / Σ(weights)`
- **Inicialización**: Si `localStorage` está vacío o corrupto, asigna peso 10 a todos los países
- Expone: `{ adjustWeight, getRandomCountry, getWeight, resetWeights, weights }`

### 5.3 useLevelGreeting.ts — Saludo Único

- Usa un `useRef` para asegurar que el saludo de nivel solo se reproduce una vez por pantalla, concatenándose con el texto del juego en la primera llamada.

### 5.4 audio.ts — Efectos de Sonido

- `AudioContext` singleton con inicialización diferida y reanudación automática si está suspendido
- `playSuccessSound()`: tono ascendente 400→800→1200 Hz, 0.3s
- `playErrorSound()`: tono descendente con vibrato 300→150→80 Hz, 0.35s
- `playClickSound()`: beep corto 600 Hz, 0.08s

## 6. Utilidades Compartidas (src/utils/game.ts)

- `FLAG_BASE = 'https://flagcdn.com'` — URL base para banderas SVG
- `FLAG_PLACEHOLDER` — SVG inline para cuando falla la carga de una bandera ( 🏳️ sobre gris)
- `handleFlagError(e)` — Handler que reemplaza la imagen rota por el placeholder
- `getExpertDistractors(target, pool, count)` — Modo experto: busca distractores en el array `similar` del target, luego mismo colorGroup, luego aleatorio
- `GameProps` — Interfaz compartida para todos los juegos: `{ level, poolCountries, onBack, onFinish? }`

## 7. Pantallas de Navegación

### 7.1 WelcomeScreen (en App.tsx)

Fondo degradado índigo/púrpura/rosa. Logo 🎌 animado flotante. Botón "▶️ ¡Jugar!" verde y botón "🗺️ Atlas" ámbar. Al tocar el fondo suelta la voz "¡Mini Juegos!".

### 7.2 LevelSelection.tsx

4 botones verticales con gradientes de colores:
- 🧭 **Explorador** (verde): saluda y navega tras 800ms
- 🗺️ **Continentes** (azul): navega al mapa de continentes
- 🌍 **Mundial** (púrpura): selección directa de juegos
- 👑 **Experto** (rojo): selección directa de juegos

Protección anti-doble clic con `navigatingRef`.

### 7.3 MapSelection.tsx

5 tarjetas en grid responsive (1→2→3→5 columnas). Cada tarjeta muestra un emoji animal del continente y el nombre. Al hacer clic saluda y navega. En PC, `onMouseEnter` activa la voz. Botón ⬅️ Atrás.

### 7.4 GameSelection.tsx

Lista vertical de 8 juegos con emoji y nombre. Muestra el nivel actual y el continente seleccionado. Cada juego tiene un color de borde distintivo en hover/focus.

## 8. Minijuegos

### 8.1 AdivinaJuego.tsx — Adivina la Bandera

**Mecánica**: 10 rondas. Se muestra una cuadrícula 2×2 con 4 banderas. La voz pregunta "¿Cuál es la bandera de [país]?".

**Opciones**:
- Normal: 3 distractores aleatorios del pool
- Experto: usa `getExpertDistractors()` con el array `similar`

**Feedback**:
- Acierto: borde verde, 🎉, `adjustWeight(true)`, pasa a siguiente ronda en 2.2s
- Fallo: borde rojo, animación shake, `adjustWeight(false)`, se bloquea solo esa opción 800ms

**Progreso**: 10 rondas únicas (anti-repetición por `usedCodesRef`). Muestra contador 🔢 N/10, estrellas ⭐ y botones Atrás/Terminar.

**Fallback**: Si el pool filtrado tiene menos de 3 distractores, se rellena con países de `difficulty: 1` del catálogo completo.

### 8.2 ParejasJuego.tsx — Hacer Parejas

**Mecánica**: Dos filas de 4 banderas. Fila superior ordenada, fila inferior desordenada. El niño toca una de arriba (dice su nombre por voz y se ilumina en amarillo) y luego su pareja abajo.

**Feedback**:
- Acierto: ambas se marcan en verde con ✅, suma 10 puntos
- Error: la bandera incorrecta de abajo tiembla (shake)

**Fin**: Al completar las 4 parejas, muestra modal con 🎉 y botón "🔄 Otra vez" o "⬅️ Atrás".

### 8.3 RascaJuego.tsx — Rasca y Descubre

**Mecánica**: La bandera objetivo se oculta bajo una rejilla **4×3 de 12 bloques** grises con ❓. Cada bloque es un botón de Framer Motion que al tocarlo se desvanece (`animate={{ opacity: 0 }}`). Al descubrir el 70% de los bloques, el resto se auto-revela.

**Opciones**: Las 3 banderas de respuesta están **siempre visibles** abajo, permitiendo responder en cualquier momento.

**Feedback**:
- Acierto: borde verde, 🎉, `adjustWeight(true)`, siguiente ronda en 2s
- Fallo: borde rojo, shake, `adjustWeight(false)`, se rehabilita en 800ms

### 8.4 IntrusoJuego.tsx — El Intruso

**Mecánica**: Muestra 4 banderas. 3 comparten el mismo `colorGroup`, 1 es diferente (intruso). El niño debe encontrar la diferente.

**Algoritmo**:
1. Agrupa el pool por `colorGroup`
2. Elige un grupo con ≥3 miembros
3. Selecciona 3 al azar del grupo
4. Elige 1 intruso de fuera del grupo

**Feedback**:
- Acierto: borde verde, animación bounce, voz "¡Esa es la diferente!"
  - Ajusta peso del intruso `(true)` y de las 3 normales `(false)`
- Fallo: shake, ajusta peso del intruso `(false)`

### 8.5 LluviaJuego.tsx — Lluvia de Banderas

**Mecánica**: Arcade con temporizador de 30 segundos. Banderas caen desde arriba (~30s hasta el suelo). La voz ordena "¡Atrapa las banderas de [país]!".

**Comportamiento**:
- `FALL_SPEED = 0.38px/frame` con `requestAnimationFrame`
- `SPAWN_INTERVAL = 2800ms` entre oleadas
- Aparecen 3 banderas por oleada: 1 correcta + 2 distractores
- Modo experto: distractores del array `similar`

**Feedback**:
- Acierto: la bandera explota (se elimina del DOM), voz "¡Ahora atrapa las de [nuevo país]!"
- Fallo: solo ajusta peso (no hay penalización visual)

**Fin**: Al llegar a 0 segundos, muestra pantalla de resultados con estrellas.

### 8.6 PuzleJuego.tsx — El Puzle Roto

**Mecánica**: Muestra la **mitad izquierda** de una bandera SVG (usando `background-position`). Abajo, 2 opciones de "mitad derecha". Al tocar la correcta, la pieza vuela desde la izquierda con físicas de muelle (Framer Motion spring) y se fusiona.

**Feedback**:
- Acierto: confeti, voz "¡Muy bien! ¡[país]!", siguiente ronda en 2.5s
- Fallo: shake 600ms

### 8.7 CucuJuego.tsx — Cucú, ¿Quién está ahí?

**Mecánica**: 3 emojis gigantes (🌳, ☁️, 🪨) en grid. La bandera está escondida detrás de uno de ellos, asomando solo una esquinita.

**Aleatorización**: Cada ronda se baraja el orden de los 3 emojis (`shuffleSpots`), y la bandera se asigna siempre al índice 0 del array barajado. Así la posición visual cambia cada ronda.

**Feedback**:
- Acierto: el emoji correcto vuela hacia arriba (`y: -300`), aparece la bandera con animación de muelle, confeti, voz "¡Muy bien! ¡Cucú! ¡[país]!"
- Fallo: el emoji tiembla (shake) y salta un animal sorpresa (🐦, 🐿️, 🦊, 🐸, 🦋) durante 800ms

### 8.8 AnimalesJuego.tsx — La Bandera de los Animales

**Mecánica**: 5 rondas. Un emoji de animal rebota en el centro (`animate-float`). La voz dice "¡Hola! Soy un [animal] y vivo aquí. ¿Cuál es mi bandera?". El niño elige entre 2 banderas. Al tocar una bandera, se dice su nombre por voz.

**Selección de país**: Se elige un animal aleatorio del array `animals`, luego un país aleatorio de sus `countryCodes`. El segundo país es un distractor aleatorio del pool.

**Feedback**:
- Acierto: el animal rebota (bounce), voz "¡Muy bien!", siguiente ronda en 2.2s
- Fallo: shake 800ms

### 8.9 AtlasInteractivo.tsx — Atlas Interactivo

**Mapamundi**: Usa `react-simple-maps` con proyección `geoEqualEarth`. Carga geografías desde `world-atlas@2/countries-110m.json`. Incluye `ZoomableGroup` para pinza/zoom/pan en móviles.

**Marcadores**: Cada país tiene un `<Marker>` con un círculo blanco y la bandera SVG. Coordenadas [lng, lat] para los 193 países.

**Interacción**:
- Al tocar un país: su trazado se ilumina en amarillo con borde naranja
- Tarjeta inferior con Framer Motion (spring):
  - 🏷️ Bandera
  - 🏛️ Capital
  - 🌍 Continente
- Voz: "¡Has tocado [país]! Su capital es [capital] y está en [continente]"

**Estados de acierto**: cada país en el mapa tiene `fill` verde si está en el catálogo, gris si no.

## 9. Celebration.tsx — Pantalla de Celebración

Modal que aparece al terminar una partida. Incluye:
- Confeti animado con `canvas-confetti`
- Emoji giratorio (🎉 o 🏆 según puntuación)
- Estrellas animadas (Framer Motion spring, escalonadas)
- Botón "Seguir" para volver a la selección de juegos

## 10. Experiencia de Usuario

### Navegación
- **Móvil/tablet**: tocar activa voz y cambia de pantalla inmediatamente
- **PC**: en la selección de continente, `onMouseEnter` activa la voz antes del clic

### Diseño Visual
- **Mobile-first** con Tailwind CSS
- Botones táctiles grandes (`min-h-[120px]`, `p-6`, etc.)
- Sin estados `hover` obstructivos en móviles
- Texto mínimo; puntuación con ⭐, navegación con ⬅️🏁, feedback con 🎉❌
- Cada pantalla/juego tiene su propio degradado de fondo

### Sonido y Voz
- La Web Speech API (useSpeech) se usa para todas las locuciones en español
- Los efectos de sonido (audio.ts) se usan para feedback de acierto/error
- Cada llamada a `speak()` cancela la anterior automáticamente
- Los juegos aplican `setTimeout` de 400-1000ms antes de hablar para evitar colisiones con transiciones

### Algoritmo Adaptativo
- Persiste pesos en `localStorage`
- Inicializa todos los países con peso 10
- Acierto resta 3 (mínimo 1), fallo suma 5
- Selección ponderada: a más peso, más probabilidad de salir
- Filtro anti-repetición: excluye el último país jugado

### Manejo de Errores
- **localStorage**: try-catch en lectura/escritura, inicializa valores por defecto si falla
- **Imágenes rotas**: `handleFlagError` reemplaza la bandera con un placeholder SVG gris con 🏳️
- **Web Speech API**: verifica `isSupported` antes de llamar, maneja `onerror` en utterance
- **AudioContext**: maneja estado `suspended` (autoplay policy) con `.resume()`
- **Pools pequeños**: si un continente tiene pocos países, se rellenan distractores con `difficulty: 1` del catálogo completo

## 11. Especificaciones Técnicas

### CDN de Banderas
```
https://flagcdn.com/{code.toLowerCase()}.svg
```
Ejemplo: `ES` → `https://flagcdn.com/es.svg`

### Mapa Mundial (Atlas)
- Fuente de geodatos: `world-atlas@2/countries-110m.json` (CDN jsdelivr)
- Proyección: `geoEqualEarth` con `scale: 180`, centro `[0, 20]`
- Zoom: `minZoom: 0.8`, `maxZoom: 5`

### Constantes de Juego
| Juego | Constante | Valor |
|---|---|---|
| Adivina | RONDAS | 10 |
| Parejas | PARES | 4 |
| Rasca | Bloques | 12 (4×3) |
| Rasca | Auto-revelado | 70% |
| Lluvia | Duración | 30s |
| Lluvia | Velocidad caída | 0.38px/frame |
| Lluvia | Intervalo spawn | 2800ms |
| Animales | Rondas | 5 |
