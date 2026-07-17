En la **Fase 10** vamos a programar los dos primeros juegos interactivos de este nuevo universo: **"El Bosque de los Sonidos"** (el rincón de exploración libre y sensorial puro, muy estilo _Pipo Club_) y **"Safari: ¡Busca, Busca!"** (el primer reto guiado de atención visual).

Aquí tienes el esquema de ingeniería detallado para que OpenCode lo implemente a la perfección.

## 📄 Outline Técnico: FASE 10 - Escenarios Interactivos y Primeros Juegos de Animales

### 🎯 1. Objetivos del Hito

- **Desarrollar el Generador de Escenarios:** Crear fondos dinámicos y coloridos adaptados al hábitat seleccionado utilizando únicamente Tailwind CSS.

- **Sintetizar Sonidos de Animales:** Diseñar un motor de audio nativo mediante la Web Audio API que genere efectos sonoros divertidos para cada tipo de animal sin descargar archivos.

- **Implementar las Mecánicas de Juego:** Programar un entorno de exploración libre y un juego de "buscar y encontrar" adaptado a la psicomotricidad de un niño de 3 años (toques simples y objetivos grandes).


### 👥 2. Casos de Uso (User Stories)

#### Caso de Uso A: Exploración en "El Bosque de los Sonidos"

- **Acción:** El niño entra al juego y selecciona el hábitat "Océano" 🌊. La pantalla se tiñe de un degradado azul marino y aparecen flotando un delfín 🐬, un pulpo 🐙 y un pingüino 🐧. El niño toca al delfín.

- **Feedback:** El delfín da una pirueta de 360 grados en el aire mediante _Framer Motion_ y el juego reproduce un sonido de chapoteo brillante. No hay marcadores, ni cronómetros, ni pantallas de error.

- **Resultado:** Estimulación temprana basada en la curiosidad y la causa-efecto inmediata.


#### Caso de Uso B: El Reto del "Safari"

- **Acción:** El niño entra al modo Safari en la "Granja" 🚜. La voz del juego dice: _“¿Dónde está la vaca? 🐮”_. En la pantalla se mueven suavemente una vaca, un pato y una oveja.

- **Feedback:** Si el niño toca al pato, este tiembla ligeramente y hace "cuac", pero el juego le vuelve a recordar por voz: _“Busca la vaca 🐮”_. Al tocar la vaca, explota confeti y la app pasa a la siguiente ronda eligiendo otro animal.


### 🛠️ 3. Descripción de la Implementación

### A. El Sintetizador de Sonidos de Animales (`src/utils/animalAudio.ts`)

Para mantener el proyecto con bajo mantenimiento y gratuito, ampliaremos nuestra utilidad de audio nativa (`AudioContext`). Le daremos a OpenCode pautas lógicas para emular "sonidos cartoon" modulando frecuencias:

- `roar` (Oso/León): Ondas tipo _sawtooth_ de muy baja frecuencia (80Hz - 120Hz) combinadas con una distorsión rápida para simular un gruñido.

- `trumpet` (Elefante): Una ráfaga corta de ondas tipo _triangle_ a alta frecuencia (400Hz) con una modulación de amplitud tipo vibrato extremo.

- `chirp` (Pájaros/Mono): Un barrido de frecuencia ultrarrápido hacia arriba (de 800Hz a 1500Hz) en menos de 0.1 segundos.

- `splash/drop` (Delfín/Pulpo): Una frecuencia sinusoidal que cae en picado amortiguándose rápidamente.


### B. Minijuego A: El Bosque de los Sonidos (`src/components/games/BosqueSonidos.tsx`)

- **Estructura:** Al entrar, muestra primero 3 botones gigantescos para elegir el entorno: 🌴 (Selva), 🌊 (Océano) o 🚜 (Granja).

- **Fondo Dinámico:** Según el hábitat, Tailwind cambia el gradiente de fondo (ej: Océano = `from-blue-600 to-sky-400`, Granja = `from-amber-200 to-green-300`).

- **Layout:** Filtra el array de animales por el `habitat` seleccionado. Renderiza 4 o 5 animales esparcidos por la pantalla.

- **Animación Base:** Cada animal tiene una animación infinita de flotación o balanceo suave mediante Framer Motion:

  TypeScript

    ```
    animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
    transition={{ repeat: Infinity, duration: 2 + Math.random() }}
    ```


### C. Minijuego B: Safari: ¡Busca, Busca! (`src/components/games/SafariBusca.tsx`)

- **Estructura:** Selecciona un animal objetivo del hábitat actual y 2 distractores.

- **Coordinación de Voz:** Dispara un `useEffect` con un retraso de `600ms` que ejecuta: `speak(`¿Dónde está el ${targetAnimal.name}?`)`.

- **Lógica de Acierto:** Al tocar el correcto, invoca el componente `Celebration` (confeti 🎉) y tras 1.5 segundos avanza a la siguiente ronda reajustando el estado.


### 💡 4. Buenas Prácticas para esta Fase

- **Aleatoriedad de Posiciones:** Para que los animales no salgan siempre alineados en el mismo sitio, haz que sus posiciones en pantalla (`top` y `left`) se calculen de forma aleatoria al cargar la ronda (por ejemplo, asignándoles porcentajes como `top: '25%'`, `left: '60%'`).

- **Z-Index Controlado:** Asegúrate de que las nubes, árboles o elementos decorativos del fondo tengan un `z-0`, los animales un `z-10` y los botones de salir o barras de estrellas un `z-50` para que el niño nunca pulse un elemento invisible por error.


### 🧪 5. Batería de Pruebas (Quality Assurance)

Pásale este checklist a OpenCode para verificar la estabilidad de los componentes táctiles:

#### 🧪 Test 1: Comportamiento ante el "Click Fantasma" (Móviles)

- **Prueba:** Tocar la pantalla con tres dedos a la vez sobre el escenario del "Bosque de los Sonidos".

- **Resultado esperado:** La aplicación no debe colgarse ni disparar errores de consola. Debe responder de manera limpia procesando únicamente el primer toque detectado.


#### 🧪 Test 2: Estresando el Sintetizador de Audio

- **Prueba:** En "El Bosque de los Sonidos", tocar al mismo animal 15 veces seguidas a la velocidad de la luz.

- **Resultado esperado:** El `AudioContext` no debe saturar la memoria de la tablet ni distorsionar el altavoz. Cada nuevo toque debe cortar instantáneamente el nodo de ganancia del sonido anterior y arrancar el nuevo de forma limpia.


#### 🧪 Test 3: Validación del Historial Anti-Repetición en Safari

- **Prueba:** Jugar 5 rondas consecutivas al modo Safari.

- **Resultado esperado:** El juego nunca debe pedirle al niño que busque el mismo animal dos rondas seguidas. El estado `ultimoAnimalId` debe bloquear su aparición inmediata para garantizar el dinamismo.


## 📋 Copia este prompt en OpenCode para empezar la Fase 10:

> **PROMPT PARA OPENCODE - FASE 10 (Mundo Animales: Bosque de Sonidos y Safari)**
>
> Hola. Vamos a desarrollar los dos primeros minijuegos del "Mundo Animales" para niños de 3 años (pre-lectores). Todo debe funcionar con toques simples ("tap") y fondos muy coloridos hechos con Tailwind CSS.
>
> **Paso 1: Crear el Sintetizador de Audio de Animales (`src/utils/animalAudio.ts`)**
>
> Utiliza la Web Audio API (`window.AudioContext`) para crear una utilidad que genere sonidos de estilo "cartoon" por código para evitar descargar archivos. Configura frecuencias y osciladores básicos para emular los siguientes tipos de sonido según el `soundType` del animal: `roar` (grave y rugiente), `trumpet` (agudo y vibrante), `chirp` (barrido rápido hacia arriba) y `splash` (sinusoidal descendente rápida).
>
> **Paso 2: Desarrollar "El Bosque de los Sonidos" (`BosqueSonidos.tsx`)**
>
> 1. Al arrancar, muestra una pantalla de selección con 3 botones gigantes de hábitats usando emojis: 🌴 (Selva), 🌊 (Océano) o 🚜 (Granja).
>
> 2. Al elegir uno, cambia el degradado de fondo con Tailwind. Filtra la constante `animals` por ese hábitat y pinta los 4 o 5 animales en posiciones aleatorias de la pantalla.
>
> 3. Aplica a los emojis de los animales animaciones infinitas de flotación suave con Framer Motion.
>
> 4. Es un juego libre: al tocar un animal, este da un giro o un salto elástico, reproduce su sonido sintético y la voz dice su nombre en alto. No hay fallos ni puntos. Incluye un botón grande ↩️ para volver atrás.
>
>
> **Paso 3: Desarrollar "Safari: ¡Busca, Busca!" (`SafariBusca.tsx`)**
>
> 1. El juego elige un animal objetivo del hábitat seleccionado y 2 distractores.
>
> 2. Al cargar la ronda, tras un delay de 600ms, la voz del juego pregunta usando `useSpeech`: _"¿Dónde está el [Nombre del animal]?"_.
>
> 3. Los 3 animales aparecen en pantalla moviéndose suavemente.
>
> 4. Si el niño toca el correcto: lanza confeti con `canvas-confetti`, añade una estrella visual ⭐ y a los 1.5 segundos pasa a la siguiente ronda con un animal diferente (evita que se repita el mismo animal de la ronda anterior).
>
> 5. Si toca uno incorrecto: el animal tiembla, hace su sonido nativo y la voz le recuerda cariñosamente: _"Busca al [Animal Objetivo]"_.
>
>
> Por favor, genera estos componentes interactivos optimizados para pantallas táctiles y completamente tipados en TypeScript.