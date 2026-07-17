# FASE 7 (Modo 3 Años)

## 🎯 Filosofía de Diseño para esta Fase

- **Facilidad de interacción:** Cero necesidad de arrastrar y soltar con precisión. Todo se resuelve con un **único toque simple (Tap)** en objetivos grandes de al menos $100 \times 100 \text{ px}$ en pantalla.

- **Máximo 2 o 3 opciones:** Reducimos la carga cognitiva. A los 3 años, elegir entre 4 opciones puede llegar a abrumarles.

- **Uso intensivo de Emojis:** Para mantener el mantenimiento a cero y no tener que descargar imágenes de animales o paisajes, usaremos emojis gigantes del sistema, que son vectoriales, se cargan al instante y se ven súper expresivos.


## 🛠️ Arquitectura Lógica de los Nuevos Juegos

### Minijuego 6: El Puzle Roto (`PuzleJuego.tsx`)

- **Lógica:** Se elige una bandera muy reconocible y simétrica (ej. Japón 🇯🇵, España 🇪🇸, Francia 🇫🇷). El contenedor se divide al 50%.

- **Visual:**

    - En la parte izquierda se muestra la **mitad izquierda de la bandera**. Esto se consigue de forma limpia en CSS aplicando a un contenedor el estilo `w-[150px] overflow-hidden object-left`.

    - En la parte derecha se muestran **2 tarjetas grandes**, cada una con la mitad derecha de una bandera (una es la correcta, la otra es el detractor).

- **Voz (TTS):** _"¡Oh, no! La bandera se ha roto. ¿Me ayudas a arreglarla? 🛠️"_


### Minijuego 7: Cucú, ¿Quién está ahí? (`CucuJuego.tsx`)

- **Lógica:** Se selecciona una bandera objetivo.

- **Visual:** Creamos un paisaje sencillo en pantalla con 3 elementos interactivos gigantes representados por emojis: un árbol gigante 🌳, una nube mullida ☁️ y una roca grande 🪨.

- **Mecánica de ocultamiento:** Detrás de un elemento (elegido al azar) asomará ligeramente una esquina del SVG de la bandera (por ejemplo, con un `absolute -top-4 -right-4 z-0 rotate-12Scale`).

- **Interacción:** Si el niño toca un elemento incorrecto, el elemento tiembla y hace aparecer un emoji de animal animado (ej. un mono 🐒 o una ardilla 🐿️) con un sonido gracioso. Si toca el correcto, la cobertura desaparece con una animación fluida de escala y se revela la bandera al completo.

- **Voz (TTS):** _"¿Dónde se esconde la bandera? ¡Búscala! 🔍"_


### Minijuego 8: La Bandera de los Animales (`AnimalesJuego.tsx`)

- **Lógica:** Mapeamos una lista simple de animales icónicos a sus respectivos países en el archivo de datos:

    - Koala 🐨 / Canguro 🦘 -> Australia (`AU`)

    - Panda 🐼 -> China (`CN`)

    - León 🦁 -> Kenia (`KE`) o Sudáfrica (`ZA`)

    - Oso Polar 🐻 -> Canadá (`CA`)

    - Águila 🦅 -> Estados Unidos (`US`)

- **Visual:** Aparece en el centro de la pantalla el emoji del animal en tamaño gigante ($150 \text{ px}$ o más) dando saltitos. Abajo, se muestran solo 2 banderas gigantes (la correcta y una incorrecta).

- **Voz (TTS):** _"¡Hola! Soy un osito panda y vivo aquí. ¿Cuál es mi bandera? 🐼"_


## 📋 Copia este prompt en OpenCode para implementar la Fase 7:

> **PROMPT PARA OPENCODE - FASE 7 (Especial 3 Años: Puzles, Escondite y Animales)**
>
> Hola. Vamos a añadir una sección especial de 3 minijuegos interactivos diseñados específicamente para niños de 3 años (etapa de infantil, pre-lectores). Los controles deben ser de un solo toque ("tap") y las opciones se limitarán a un máximo de 2 o 3 en pantalla.
>
> Por favor, programa los siguientes componentes en TypeScript y Tailwind CSS:
>
> **Paso 1: Minijuego "El Puzle Roto" (`PuzleJuego.tsx`)**
>
> 1. Selecciona un país del JSON (ej. Japón `JP`).
>
> 2. Muestra un contenedor central dividido verticalmente en dos mitades.
>
> 3. En la mitad izquierda, muestra la mitad izquierda de la bandera objetivo usando un contenedor con `overflow-hidden` y alineación del SVG a la izquierda (`object-left`).
>
> 4. En la mitad derecha, deja el espacio vacío pero con una silueta de rompecabezas punteada.
>
> 5. Abajo, muestra 2 opciones de "mitad derecha". Una de ellas encaja perfectamente con la bandera.
>
> 6. Al cargar, la voz dice: _"¡Oh, no! La bandera se ha roto. ¿Me ayudas a arreglarla?"_.
>
> 7. Al tocar la opción correcta, la pieza se desliza al centro de forma fluida mediante Framer Motion, la bandera se completa, lanza confeti y suena la voz de éxito.
>
>
> **Paso 2: Minijuego "Cucú, ¿Quién está ahí?" (`CucuJuego.tsx`)**
>
> 8. Selecciona un país objetivo al azar.
>
> 9. Dibuja un paisaje sencillo con Tailwind con 3 elementos táctiles gigantes representados por emojis: un árbol grande 🌳, una nube ☁️ y una roca 🪨.
>
> 10. Coloca el SVG de la bandera objetivo detrás de uno de los 3 elementos de forma que sobresalga solo un 15% de su tamaño (para que sea visible como pista).
>
> 11. Al arrancar, la voz dice: _"¿Dónde se esconde la bandera? ¡Búscala!"_.
>
> 12. Si el niño toca los elementos vacíos, estos tiemblan y sale un emoji gracioso (ej: 🐦, 🐿️) haciendo un sonido juguetón.
>
> 13. Si toca el elemento donde está oculta la bandera, la nube/árbol/roca sale volando de la pantalla con una animación, la bandera se hace grande en el centro y la voz dice: _"¡Cucú! ¡La has encontrado! Es la bandera de [País]"_.
>
>
> **Paso 3: Minijuego "La Bandera de los Animales" (`AnimalesJuego.tsx`)**
>
> 14. Crea un pequeño mapeo estático de 5 animales con sus banderas de origen:
>
>     - 🦘 / 🐨 -> Australia ("AU")
>
>     - 🐼 -> China ("CN")
>
>     - 🦁 -> Kenia ("KE")
>
>     - 🐻 -> Canadá ("CA")
>
>     - 🦅 -> EE.UU. ("US")
>
> 15. Selecciona un animal al azar y muéstralo en el centro con una animación de rebote constante (`animate-bounce`).
>
> 16. Abajo, muestra solo 2 banderas SVG gigantes (la correcta y una distractora).
>
> 17. Al iniciar, la voz dice: _"¡Hola! Soy un [Nombre del animal] y vivo aquí. ¿Cuál es mi bandera?"_.
>
> 18. Si toca la bandera del país correcto, el animal hace una pirueta de felicidad y pasa a la siguiente ronda.
>
>
> Asegura que todos los eventos de interacción sean de un solo toque y que los tamaños de los botones sean ideales para dedos pequeños en tablets o teléfonos móviles.