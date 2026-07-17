## ✨ FASE 5: Celebraciones, Sonidos y Conexión en Vercel

### Objetivo

Añadir el "game juice" definitivo: efectos de sonido usando la Web Audio API (evitando cargar pesados archivos de audio) y conectar la navegación general para que todo fluya.

### Estructura de Archivos

- `../../src/utils/audio.ts` (Sintetizador de sonidos nativo)

- `../../src/components/Celebration.tsx` (Animación de éxito con confeti)

- `../../src/App.tsx` (Navegación final integrada)


### **PROMPT PARA OPENCODE - FASE 5**
>
> Vamos a poner el broche de oro a nuestra aplicación web infantil conectando todo y dándole dinamismo.
>
> **Paso 1: Sintetizador de Sonidos nativo (`../../src/utils/audio.ts`)**
>
> Crea un archivo utilitario que use la `AudioContext` nativa del navegador para generar efectos de sonido sencillos de forma gratuita y sin descargar archivos externos:
>
> - `playSuccessSound()`: Genera un tono alegre ascendente (ej: de 400Hz a 800Hz rápidamente) imitando una moneda de Mario Bros.
>
> - `playErrorSound()`: Genera un tono grave y descendente que vibre un poco (tipo muelle roto).
>
>
> **Paso 2: Celebración con Confeti (`../../src/components/Celebration.tsx`)**
>
> Integra la librería `canvas-confetti`. Al ganar un juego, debe lanzar una gran ráfaga de confeti y mostrar una estrella gigante 🌟 que rebote y baile usando _Framer Motion_.
>
> **Paso 3: Integración de Pantallas en `../../src/App.tsx`**
>
> Une todas las fases en la pantalla principal:
>
> 1. Pantalla de Bienvenida con un enorme botón verde de "Play" ▶️.
>
> 2. Al pulsar Play, va a la Pantalla de Mapa (Selección de continente).
>
> 3. Al elegir continente, va al menú de juegos (los 5 iconos grandes táctiles).
>
> 4. Al seleccionar un juego, se abre el componente correspondiente.
>
> 5. Al terminar, la pantalla de celebración le da estrellas y le devuelve suavemente al menú.
>
>
> Genera el código final limpio para dar por concluido el desarrollo de nuestro MVP.