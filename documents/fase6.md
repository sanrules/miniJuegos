## 🧭 Plan de Diseño: Menú de Dificultad (Sin Texto)

Antes de elegir el juego, tu hijo verá 4 grandes "tarjetas de nivel" representadas por emojis animados y colores de fondo súper llamativos.

- **Nivel 1: Explorador (🧭)** -> Fondo verde (amigable). Al pasar el dedo o tocar: _"Nivel Explorador: ¡Banderas fáciles!"_.

- **Nivel 2: Continentes (🗺️)** -> Fondo azul. Al tocar: _"Nivel Continente: ¡Viaja por el mundo!"_. (Aquí elegirá primero su continente en el mapa SVG).

- **Nivel 3: Mundial (🌍)** -> Fondo morado. Al tocar: _"Nivel Mundial: ¡Todas mezcladas y las que más te cuestan!"_.

- **Nivel 4: Experto (👑 / 🧠)** -> Fondo rojo/dorado. Al tocar: _"Nivel Súper Experto: ¡Cuidado con las trampas!"_.


## 🛠️ Lógica de Filtrado de Datos (En las "Tripas" de React)

Cuando el juego pida una bandera objetivo y sus 3 distractores, el "grifo" de países se abrirá o cerrará según el nivel seleccionado:

1. **Explorador:** El juego hace un `.filter(c => c.difficulty === 1)`. Los 3 distractores también se eligen estrictamente de este grupo de banderas muy conocidas para no frustrarle.

2. **Continentes:** El juego filtra `.filter(c => c.continent === continentSeleccionado)`. Las 4 opciones pertenecen estrictamente a esa zona geográfica.

3. **Mundial:** No hay filtros geográficos ni de dificultad base. Aquí es donde el **algoritmo de pesos** brilla: elegirá prioritariamente los países que el niño tiene con pesos altos (los que más falla) de todo el JSON.

4. **Experto:** Aquí se activa la magia de los "afines". Si la bandera ganadora es Chad (`code: "TD"`), el código buscará sus distractores leyendo su propiedad `similar: ["RO", "AD", "MD"]` (Rumanía, Andorra y Moldavia). Si un país no tiene "similares" definidos en el JSON, el sistema buscará distractores que compartan el mismo `colorGroup` (ej: tricolor vertical).


## **PROMPT PARA OPENCODE - FASE 6 (Modos y Niveles de Dificultad)**
>
> Hola. Vamos a implementar el sistema de 4 niveles de dificultad y progresión en nuestro juego de banderas. Debemos asegurar que toda la interfaz sea visual y por voz, adaptada para niños no lectores.
>
> **Paso 1: Modificar la selección en `src/App.tsx`** Crea un nuevo estado llamado `currentLevel` (que pueda ser 'explorer' | 'continents' | 'world' | 'expert'). Modifica el flujo de navegación para que, después de pulsar "Play", el niño vea una pantalla con 4 tarjetas gigantes, coloridas y táctiles:
>
> 1. **🧭 Explorador:** Dice por voz: _"¡Nivel Explorador, banderas fáciles!"_. Filtra la base de datos para usar solo países con `difficulty: 1`.
>
> 2. **🗺️ Continentes:** Dice por voz: _"¡Nivel Continente, elige dónde viajar!"_. Redirige primero a nuestra pantalla de mapa SVG para que el niño elija qué continente jugar.
>
> 3. **🌍 Mundial:** Dice por voz: _"¡Nivel Mundial, todas mezcladas!"_. Usa todo el catálogo de países y prioriza con el algoritmo de pesos (`useAdaptiveLearning`) los países que más se fallan.
>
> 4. **👑 Experto:** Dice por voz: _"¡Nivel Súper Experto, cuidado con las trampas!"_. Usa distractores ultra difíciles y similares.
>
>
> **Paso 2: Actualizar el Selector de Países y Distractores en los Juegos** Modifica la lógica de generación de preguntas en **AdivinaJuego.tsx** y **LluviaJuego.tsx** para que respeten el nivel seleccionado:
>
> - **Si el nivel es 'expert':** Para el país objetivo (ej. "TD" - Chad), los 3 distractores se deben seleccionar buscando sus equivalentes en la propiedad `similar` de su JSON (ej. ["RO", "AD", "MD"]). Si el array `similar` tiene menos de 3 elementos, rellena los huecos buscando países aleatorios que tengan el mismo `colorGroup`.
>
> - **Si el nivel es 'explorer':** Tanto el país objetivo como los distractores deben ser estrictamente de `difficulty: 1`.
>
> - **Si el nivel es 'continents':** Filtra tanto el objetivo como los distractores para que sean del mismo continente seleccionado.
>
>
> **Paso 3: Feedback por voz adaptado** Añade un retraso de 600ms al cargar el nivel para que la voz del juego le dé la bienvenida al modo elegido antes de lanzar la primera pregunta (ej: _"¡Nivel Súper Experto! ¿Dónde está la bandera de...?"_).
>
> Por favor, genera las actualizaciones de código en TypeScript asegurando que el estado de los niveles persista y funcione de forma robusta.