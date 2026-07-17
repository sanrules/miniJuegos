## 🗺️ Outline del "Mundo Animales" (Concepto y Conexiones)

Para que el niño asocie el animal con su país o continente, utilizaremos la base de datos de países que ya tenemos. Así es como se estructurará el nuevo catálogo y mecánicas de juego:

### 1. El Modelo de Datos de Animales Ampliado

Modificaremos la estructura de los animales para incluir su **hábitat** (esto nos servirá para dibujar los diferentes escenarios de fondo como selva, granja o mar):

TypeScript

```
export interface AnimalEntry {
  emoji: string;
  name: string;
  countryCodes: string[]; // Conexión directa con countries.ts (ej: ['AU'])
  habitat: 'jungle' | 'farm' | 'ocean' | 'forest' | 'savanna'; // Para los escenarios
  soundType: 'roar' | 'trumpet' | 'jump' | 'chirp' | 'boing'; // Sonidos de la Web Audio API
}
```

### 2. Los 3 Minijuegos de la Categoría Animales

- **Juego A: "El Bosque de los Sonidos" (Exploración Libre - Estilo Pipo)**

    - _Mecánica:_ Un escenario temático (ej: la selva 🌴🦁). Hay 5 animales repartidos por la pantalla. No hay reglas, no hay tiempo, no hay fallos. El niño simplemente toca un animal, este hace una animación gigante (salto, giro) y reproduce su sonido característico.

    - _Objetivo:_ Causa-efecto pura y familiarización sensorial.

- **Juego B: "Safari: ¡Busca, Busca!" (Atención y Discriminación Visual)**

    - _Mecánica:_ El juego dice por voz: _"¿Dónde está el oso panda? 🐼"_. En un escenario con árboles y rocas, se esconden varios animales. El niño debe encontrar el correcto. Al tocarlo, el animal celebra y desaparece en una nube de estrellas.

    - _Objetivo:_ Atención sostenida y reconocimiento de especies.

- **Juego C: "De Vuelta a Casa" (La Conexión Geográfica)**

    - _Mecánica:_ Sale un koala 🐨 llorando suavemente. La voz dice: _"El koala está perdido. ¿Me ayudas a llevarlo a su casa en Australia? 🇦🇺"_. Abajo se muestran 2 banderas gigantes (la de Australia y un detractor).

    - _Objetivo:_ Asociar el animal con el país, la bandera o su continente.


## 📅 Plan de Desarrollo por Fases (Fases 9 a 11)

Vamos a dividir el desarrollo de esta gran sección en tres fases muy claras para que OpenCode pueda asimilar los cambios poco a poco y sin romper nada de la parte de geografía que ya funciona.

### 🌴 FASE 9: Menú "Mundos" y la Base de Datos Animal

**Objetivo:** Crear la pantalla de bienvenida donde el niño elige entre 🗺️ "Mundo Geografía" y 🦁 "Mundo Animales", y ampliar el catálogo de animales vinculados a países.

1. **Pantalla de Selección de Mundo:** Una nueva vista inicial con dos botones gigantes:

    - 🗺️ **Mundo Banderas:** Te lleva a tu flujo actual de selección de nivel y juegos.

    - 🦁 **Mundo Animales:** Sonido de selva y te lleva al nuevo menú de animales.

2. **Ampliación de `countries.ts`:** Ampliar el array de animales para tener al menos 15 especies bien repartidas por hábitats y países de origen (ej: 🦙 Llama -> Perú `PE`, 🐫 Camello -> Arabia Saudita `SA`, 🦁 León -> Sudáfrica `ZA`, 🐯 Tigre -> India `IN`).


### 🎨 FASE 10: "El Bosque de los Sonidos" y "Safari"

**Objetivo:** Desarrollar los dos primeros juegos de animales basados en la interacción táctil con escenarios dinámicos.

1. **Componente `BosqueSonidos.tsx` (Exploración libre):**

    - Crea un selector de hábitat (Granja, Selva, Océano).

    - Renderiza un fondo temático con Tailwind y coloca 5 animales del hábitat seleccionado flotando y rebotando.

    - Al tocarlos, activa animaciones divertidas con Framer Motion y sintetiza un sonido único de ese animal usando la Web Audio API.

2. **Componente `SafariBusca.tsx` (Juego guiado):**

    - Pregunta por voz qué animal buscar.

    - Mapea los toques. Si toca el correcto, celebra con confeti y cambia a otro animal.


### 👑 FASE 11: "De Vuelta a Casa" (El puente geográfico)

**Objetivo:** Desarrollar el juego avanzado que conecta todo el aprendizaje anterior de banderas y geografía.

1. **Componente `DeVueltaACasa.tsx`:**

    - Selecciona un animal del array que tenga asociado un país en `countryCodes`.

    - Muestra el animal en el centro con cara un poco triste.

    - La voz dice: _"¿Dónde vive el [Animal]? ¡Llévalo a su país!"_.

    - Muestra abajo la bandera correcta del país de origen y una bandera de otro continente como trampa.

    - Al tocar la bandera correcta, el animal viaja hacia ella, se pone súper feliz, la voz dice: _"¡Siií! El [animal] vive en [País]"_[cite: 1] y se desbloquea una estrella ⭐.