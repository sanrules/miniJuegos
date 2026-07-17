## 🎨 FASE 4: Minijuegos Avanzados (Rasca, Intruso e Hilos de Lluvia)

### Objetivo

Implementar los tres juegos avanzados. **Atención técnica:** Al dibujar un SVG externo de FlagCDN en un Canvas de HTML para el rasca-y-gana, debemos gestionar los permisos CORS para que el Canvas no se "contamine".

### Estructura de Archivos

- `src/components/games/RascaJuego.tsx`

- `src/components/games/IntrusoJuego.tsx`

- `src/components/games/LluviaJuego.tsx`


### **PROMPT PARA OPENCODE - FASE 4**
>
> Vamos a desarrollar los tres juegos interactivos avanzados utilizando las banderas SVG de FlagCDN.
>
> **Juego 3: "Rasca y Descubre" (`RascaJuego.tsx`)**
>
> 1. Renderiza la bandera objetivo de fondo usando el CDN SVG (`[https://flagcdn.com/$](https://flagcdn.com/$){code.toLowerCase()}.svg`).
>
> 2. Superpone un `<canvas>` gris que cubra la bandera.
>
> 3. Permite al niño usar el dedo o el ratón para ir "borrando" la capa gris y dejar ver la bandera de abajo.
>
> 4. **Importante para el Canvas:** Para evitar problemas de CORS al renderizar o manipular imágenes externas, asegúrate de configurar `img.crossOrigin = "anonymous"` si cargas imágenes dentro del lienzo, o simplemente usa un sistema de capas CSS donde el canvas gris esté por encima y se vuelva transparente bajo el trazo del dedo (máscara de recorte o borrado de píxeles).
>
> 5. Abajo, muestra 3 opciones de banderas completas para que responda cuando crea saber cuál es.
>
>
> **Juego 4: "El Intruso" (`IntrusoJuego.tsx`)**
>
> 6. Selecciona 3 banderas del mismo `colorGroup` (ej: que tengan rojo y blanco) y 1 bandera intrusa de otro grupo.
>
> 7. La voz dice: _"¡Encuentra la bandera diferente!"_.
>
> 8. Si el niño pulsa la intrusa, ¡acierto!
>
>
> **Juego 5: "Lluvia de Banderas" (`LluviaJuego.tsx`)**
>
> 9. La voz dice: _"¡Atrapa las banderas de... [País]!"_.
>
> 10. Haz que caigan de forma suave y lenta banderas SVG desde arriba del contenedor. El niño debe pulsar solo las del país objetivo antes de que desaparezcan.
>
>
> Escribe el código completo en TypeScript optimizando el rendimiento de las animaciones en móviles.