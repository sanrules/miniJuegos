## 🎮 FASE 3: Minijuegos de Base (Adivinar y Parejas)

### Objetivo
Programar los dos primeros juegos mecánicos, adaptando las URLs del CDN de SVG y preparando la interfaz táctil.

### Estructura de Archivos
- `src/components/games/AdivinaJuego.tsx`
- `src/components/games/ParejasJuego.tsx`


### **PROMPT PARA OPENCODE - FASE 3**
>
> Vamos a construir los dos primeros minijuegos interactivos. Recuerda que las imágenes de las banderas deben cargarse desde `[https://flagcdn.com/$](https://flagcdn.com/$){code.toLowerCase()}.svg`.
>
> **Juego 1: "Adivina la Bandera" (`AdivinaJuego.tsx`)**
>
> 1. Selecciona un país objetivo usando `getRandomCountry` del hook adaptativo.
>
> 2. Elige 3 "países distractores" del mismo continente.
>
> 3. Al cargar, la voz pregunta: _"¿Cuál es la bandera de... [Nombre del País]?"_. Muestra también un botón grande con el icono de un altavoz 🔊 para repetir la voz.
>
> 4. Muestra una cuadrícula de 2x2 con las 4 banderas en formato SVG grande y nítido.
>
> 5. Al tocar la bandera correcta: lanza un callback de acierto, actualiza pesos en el local storage y muestra una marca verde alegre.
>
> 6. Al tocar una incorrecta: la tarjeta tiembla (efecto shake), se marca con una cruz suave y el país objetivo aumenta su peso para salir más veces en el futuro.
>
>
> **Juego 2: "Hacer Parejas" (`ParejasJuego.tsx`)**
>
> 1. Selecciona 4 países aleatorios.
>
> 2. Muestra una fila superior con sus 4 banderas SVG y una fila inferior con las mismas 4 mezcladas.
>
> 3. Cuando el niño toca una bandera de arriba, se ilumina con un borde brillante y la voz dice su nombre.
>
> 4. Cuando toca su pareja abajo, ambas se marcan como resueltas de forma visual y se reproducirá un sonido de acierto.
>
>
> Desarrolla los componentes listos para usar con el dedo en móviles y tablets.