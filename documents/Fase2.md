# 🧠 FASE 2: El Cerebro Adaptativo (localStorage) y el Mapa Visual
## Objetivo
Crear el sistema de progresión que recuerda qué banderas se le dan peor al niño y diseñar el mapamundi interactivo para seleccionar continente.
## Estructura de Archivos
- src/hooks/useAdaptiveLearning.ts (Algoritmo de pesos)
- src/components/MapSelection.tsx (Selección de nivel visual con SVG o botones interactivos)

- ## PROMPT PARA OPENCODE - FASE 2
Vamos a implementar el sistema de aprendizaje adaptativo y la pantalla de inicio para seleccionar nivel.
### Paso 1: El Hook de Aprendizaje Adaptativo src/hooks/useAdaptiveLearning.tsQueremos que el juego memorice el progreso en localStorage.
1. Al iniciar por primera vez, cada país del JSON tiene un "peso" inicial de 10.
2. Crea una función adjustWeight(countryCode: string, success: boolean):
   - Si acierta (success === true), resta 3 al peso del país (mínimo de 1).
   - Si falla (success === false), suma 5 al peso del país.
3. Crea una función getRandomCountry(filteredCountries: Country[]): Country que seleccione un país usando un muestreo aleatorio ponderado (Weighted Random). La probabilidad de elegir un país $i$ debe ser proporcional a su peso:
$$P(i) = \frac{w_i}{\sum_{j=1}^{n} w_j}$$
### Paso 2: La Pantalla de Mapa Visual src/components/MapSelection.tsx
Diseña una interfaz sin texto para seleccionar el continente.
1. Crea botones táctiles gigantes de colores brillantes que representen los continentes (o un mapamundi simplificado en SVG). Cada zona debe tener un icono de animal representativo para que el niño lo identifique visualmente.
2. Al tocar un continente, el hook useSpeech debe decir su nombre en voz alta (ej: "¡Europa!").
3. Al hacer un segundo toque de confirmación, emite el evento onSelectContinent(continentCode: string) para arrancar los juegos filtrados.

4. Escribe el código en TypeScript asegurando que sea responsivo.