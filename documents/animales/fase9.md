### 🌴 FASE 9: Menú "Mundos" y la Base de Datos Animal

**Objetivo:** Crear la pantalla de bienvenida donde el niño elige entre 🗺️ "Mundo Geografía" y 🦁 "Mundo Animales", y ampliar el catálogo de animales vinculados a países.

1. **Pantalla de Selección de Mundo:** Una nueva vista inicial con dos botones gigantes:

    - 🗺️ **Mundo Banderas:** Te lleva a tu flujo actual de selección de nivel y juegos.

    - 🦁 **Mundo Animales:** Sonido de selva y te lleva al nuevo menú de animales.

2. **Ampliación de `countries.ts`:** Ampliar el array de animales para tener al menos 15 especies bien repartidas por hábitats y países de origen (ej: 🦙 Llama -> Perú `PE`, 🐫 Camello -> Arabia Saudita `SA`, 🦁 León -> Sudáfrica `ZA`, 🐯 Tigre -> India `IN`).

# 📄 Outline Técnico: FASE 9 - Arquitectura de Mundos y Expansión Animal

Esta fase marca la evolución de nuestra aplicación de un juego de banderas a una **plataforma educativa multi-mundo** inspirada en la filosofía de exploración de _Pipo Club_. Aquí reestructuramos el punto de entrada de la aplicación y preparamos la base de datos para conectar los animales con sus respectivos países de origen.

## 🎯 1. Objetivos del Hito

- **Reestructurar la navegación raíz:** Transformar el punto de entrada de la app en un "Hub de Mundos" (Geografía vs. Animales) sin fricciones.

- **Enriquecer el modelo de datos:** Ampliar el catálogo de animales vinculados a países en `countries.ts` para habilitar las mecánicas de juego de 3 años de las fases posteriores.

- **Asegurar la consistencia del motor de voz:** Mantener la experiencia de audio 100% libre de textos instructivos para niños no lectores.


## 👥 2. Casos de Uso (User Stories)

### Caso de Uso A: Selección del "Mundo" por el niño (3 años)

- **Acción:** El niño abre la aplicación. Ve dos botones gigantescos que vibran suavemente: uno con un mapamundi 🗺️ y otro con la cara de un león 🦁.

- **Feedback Inmediato:**

    - Al pasar el dedo o tocar el mapa 🗺️: la app dice _"¡Mundo Geografía! ¡Vamos a viajar!"_.

    - Al pasar el dedo o tocar el león 🦁: la app dice _"¡Mundo Animales! ¡A jugar con los animales!"_ y suena un simpático rugido sintetizado.

- **Resultado:** El niño decide a qué universo entrar con un solo toque, sintiéndose en control de su aprendizaje.


### Caso de Uso B: Conexión Cognitiva (Geografía-Biodiversidad)

- **Acción:** El sistema lee el nuevo catálogo ampliado para preparar un juego en fases posteriores.

- **Resultado:** Gracias al catálogo estructurado, la app sabe que si muestra un koala 🐨 debe sugerir como respuesta correcta la bandera de Australia `AU`.


## 🛠️ 3. Descripción de la Implementación

### A. Ampliación del Modelo de Datos (`src/data/countries.ts`)

Para que los juegos de animales de las siguientes fases tengan el rendimiento y la cohesión que buscamos, debemos redefinir e incrementar la constante `animals`.

#### Nueva Interfaz Extendida para TypeScript:

TypeScript

```
export interface AnimalEntry {
  emoji: string;
  name: string;
  countryCodes: string[]; // Códigos ISO de países de origen (ej. ['AU'] para Australia)
  habitat: 'jungle' | 'farm' | 'ocean' | 'forest' | 'savanna'; // Para cargar el escenario adecuado
  soundType: 'roar' | 'trumpet' | 'chirp' | 'boing' | 'splash'; // Para el sintetizador de audio
}
```

#### Propuesta de Catálogo Ampliado (Mínimo 15 especies):

En `countries.ts`, sustituiremos el array básico por uno con mayor diversidad geográfica y de hábitats:

- 🐨 **Koala:** `['AU']` | Hábitat: `forest` | Sonido: `boing`

- 🦘 **Canguro:** `['AU']` | Hábitat: `savanna` | Sonido: `boing`

- 🐼 **Oso Panda:** `['CN']` | Hábitat: `forest` | Sonido: `chirp`

- 🦁 **León:** `['KE', 'ZA']` | Hábitat: `savanna` | Sonido: `roar`

- 🐻 **Oso Polar:** `['CA']` | Hábitat: `forest` (Ártico) | Sonido: `roar`

- 🦅 **Águila:** `['US']` | Hábitat: `forest` | Sonido: `chirp`

- 🐫 **Camello:** `['SA', 'EG']` | Hábitat: `savanna` (Desierto) | Sonido: `boing`

- 🦙 **Llama:** `['PE', 'BO']` | Hábitat: `forest` (Montaña) | Sonido: `boing`

- 🐮 **Vaca:** `['ES', 'FR', 'CH']` | Hábitat: `farm` | Sonido: `boing` (Muuu)

- 🐵 **Mono:** `['BR', 'IN']` | Hábitat: `jungle` | Sonido: `chirp`

- 🐬 **Delfín:** `['FJ', 'NZ']` | Hábitat: `ocean` | Sonido: `splash`

- 🐘 **Elefante:** `['IN', 'KE']` | Hábitat: `savanna` | Sonido: `trumpet`

- 🐧 **Pingüino:** `['ZA', 'AR']` | Hábitat: `ocean` (Antártico) | Sonido: `chirp`

- 🐙 **Pulpo:** `['JP', 'PG']` | Hábitat: `ocean` | Sonido: `splash`

- 🦆 **Pato:** `['NL', 'DE']` | Hábitat: `farm` | Sonido: `chirp`


### B. El Componente Selector de Mundos (`src/components/WorldSelector.tsx`)

Este componente será el nuevo portal de entrada.

- **UI Layout:** Dos grandes secciones divididas vertical u horizontalmente mediante flexbox/grid.

    - **Lado Izquierdo (Geografía):** Gradiente azul brillante (`from-blue-400 to-indigo-500`). Un emoji de globo terráqueo interactivo que gira al pasar el cursor o hacer click.

    - **Lado Derecho (Animales):** Gradiente verde sabana (`from-emerald-400 to-green-600`). Un emoji de león o panda animado que rebota.

- **UX Táctil:** Un solo toque en cualquier lado ejecuta el audio correspondiente y dispara la transición hacia la siguiente pantalla (`onSelectWorld('flags' | 'animals')`).


### C. Enrutamiento en `src/App.tsx`

El flujo de estados principales de la aplicación se reordena de la siguiente manera:

```
[ Bienvenida / Splash ]
          │
          ▼
 [ WorldSelector ] <───────────┐
    │          │               │ (Botón Atrás)
    ▼          ▼               │
[Geografía] [Animales] ────────┘
```

## 💡 4. Buenas Prácticas para esta Fase

- **Evitar solapamientos de audio (Race Conditions):** Como el niño puede tocar compulsivamente el botón de "Geografía" y luego "Animales", el manejador de click del `WorldSelector` debe invocar `speechSynthesis.cancel()` de inmediato antes de lanzar la locución del nuevo mundo seleccionado.

- **Normalización de Datos:** No dupliques información. Para saber qué bandera pintar al lado de un animal, el sistema debe buscar en el array de países utilizando el código ISO `countryCodes` que vincula ambas colecciones.

- **CSS Limpio:** Utiliza clases de Tailwind que varíen el tamaño de los emojis dinámicamente según la pantalla para que nunca se desborden en móviles pequeños (ej: `text-6xl sm:text-8xl md:text-9xl`).


## 🧪 5. Batería de Pruebas (Quality Assurance)

Pásale estas pruebas a OpenCode para verificar que la Fase 9 no tenga fallas de rendimiento o de lógica antes de construir los juegos de la Fase 10:

### 🧪 Test 1: Comprobación de Tipado en TypeScript (Frontera)

- **Prueba:** Añadir un animal al array `animals` con un hábitat o sonido que no esté en la definición del tipo (ej: `habitat: 'space'`).

- **Resultado esperado:** El compilador de TypeScript debe lanzar un error en tiempo de desarrollo impidiendo la construcción del proyecto.


### 🧪 Test 2: Comprobación de Integridad Referencial (Cruce de Datos)

- **Prueba:** Ejecutar un test lógico que compruebe que todos los códigos de país asignados a los animales en `countryCodes` existen realmente en el array de países `countries`.

- **Resultado esperado:** El juego no debe tener "códigos huérfanos". Si un animal está vinculado a `"AU"`, la app debe confirmar que `"AU"` existe en el catálogo de países para evitar pantallas en blanco[cite: 1].


### 🧪 Test 3: Rendimiento del "Doble Toque Accidental"

- **Prueba:** Tocar el botón de "Mundo Animales" tres veces súper rápido en una pantalla táctil.

- **Resultado esperado:** La aplicación no debe montar tres instancias de la pantalla de juegos de animales en la pila de estados de React, ni debe reproducir el sonido del animal en bucle de eco. El cambio de pantalla debe ser atómico y el audio debe interrumpirse limpiamente.