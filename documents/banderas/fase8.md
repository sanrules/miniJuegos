## Fase 8

## 🗺️ Diseño del Atlas Interactivo (Sin Texto)

### 1. Actualización de Datos (`countries.json`)

Para que este mapa funcione, primero necesitamos que nuestra base de datos de países tenga un dato que antes no usábamos: la **capital**. El esquema conceptual ahora incluirá este campo:

JSON

```
{
  "code": "ES",
  "name": "España",
  "capital": "Madrid",
  "continent": "Europa",
  "difficulty": 1
}
```

### 2. La Interacción Visual y Táctil

- **El Mapa:** Mostraremos un mapamundi SVG simplificado que ocupe toda la pantalla. Encima de los países clave, flotará el icono de su bandera SVG de `flagcdn.com` con una animación de latido suave (`animate-pulse`).

- **La Selección:** Al tocar una bandera o un país:

    1. El país seleccionado cambiará su color de fondo a un dorado brillante y su borde (`stroke`) se volverá grueso y naranja para marcar claramente sus **límites**.

    2. Aparecerá una tarjeta emergente abajo (tipo _pop-up_) muy limpia y visual.

- **La Tarjeta de Datos (UX Pre-Lectores):**

    - Para representar los datos sin abrumar con texto, utilizaremos metáforas visuales:

        - **País:** 🏷️ + Bandera SVG gigante.

        - **Capital:** 🏛️ (Icono de ayuntamiento/templo romano) + Nombre de la capital en letra muy grande.

        - **Continente:** 🌍 (Globo terráqueo) + Nombre del continente.


### 3. El Motor de Voz

Al tocar el país, la voz del juego dirá una frase súper estructurada, pausada y amigable:

> 🗣️ _"¡Has tocado España! 🇪🇸 Su capital es Madrid 🏛️ y está en Europa 🌍."_

## 📋 Copia este prompt en OpenCode para implementar la Fase 8:

> **PROMPT PARA OPENCODE - FASE 8 (Atlas Interactivo y Guía de Consulta)**
>
> Hola. Vamos a añadir un nuevo módulo a nuestra aplicación: un **Atlas Interactivo (Mapa de Consulta)**. Este modo no es un juego con puntos, sino un espacio de exploración libre para niños de pre-lectura.
>
> Por favor, implementa las siguientes características en TypeScript, React y Tailwind CSS:
>
> **Paso 1: Ampliar la Base de Datos (`../../src/data/countries.json`)**
>
> - Asegúrate de que los países del archivo JSON tengan ahora la propiedad `capital` (ej: `"capital": "Madrid"`).
>
>
> **Paso 2: El Componente del Mapa (`../../src/components/AtlasInteractivo.tsx`)**
>
> 1. Renderiza un mapa del mundo simplificado en formato SVG. (Puedes generar un SVG básico responsivo donde los países principales tengan su etiqueta `<path>` con el atributo `id` igual al código de país en minúsculas, por ejemplo: `id="es"`, `id="fr"`, etc.).
>
> 2. Sobre el mapa, calcula y posiciona de forma absoluta pequeños botones redondos con la bandera SVG de cada país (usando `[https://flagcdn.com/$](https://flagcdn.com/$){code.toLowerCase()}.svg`). Estas banderas deben flotar y latir suavemente (`animate-pulse`).
>
> 3. Al hacer clic en una bandera o en el propio territorio (el `<path>` correspondiente):
>
>     - Cambia el estilo CSS del `<path>` seleccionado: su relleno (`fill`) debe pasar a ser amarillo brillante (`#fcd34d`) y su borde (`stroke`) debe destacar en color naranja grueso (`#f97316`) para delimitar claramente los límites del país.
>
>
> **Paso 3: La Tarjeta de Consulta Visual (Popup)**
>
> Cuando se selecciona un país, muestra una tarjeta emergente en la parte inferior de la pantalla con animaciones de Framer Motion. Debe ser súper visual y contener:
>
> - El emoji de una etiqueta 🏷️ al lado de la bandera SVG en grande.
>
> - El emoji de un ayuntamiento/templo 🏛️ al lado del nombre de la **Capital** en texto grande y legible.
>
> - El emoji de un globo terráqueo 🌍 al lado del nombre del **Continente**.
>
>
> **Paso 4: Locución de Datos por Voz (TTS)**
>
> Cada vez que el niño toque un país, activa el hook `useSpeech` para que lea de forma pausada y cariñosa la siguiente estructura:
>
> _"¡Has tocado [Nombre del País]! Su capital es [Capital] y está en [Continente]"_.
>
> Cancela cualquier audio anterior para que si el niño toca varios países seguidos, la voz cambie al instante al nuevo país seleccionado.
>
> Asegura que todo el mapa sea completamente arrastrable y ampliable (zoom/pan básico) si se juega en pantallas de móviles pequeños, garantizando una usabilidad táctil excelente.
