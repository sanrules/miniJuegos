Fase 9. Expandir Países
### 📑 BLOQUE 1: Copia esto en un nuevo chat de OpenCode para empezar el archivo

> **PROMPT OPENCODE - PAÍSES PARTE 1 (EUROPA Y AMÉRICA)**
>
> Hola. Necesito expandir nuestra base de datos de países para el juego de banderas de React. El pool actual de 48 países es muy corto. Quiero que generes el archivo `src/data/countries.ts` incluyendo **TODOS** los países del mundo.
>
> Para que no te cortes por límite de caracteres, en este primer mensaje genérame la interfaz y los arrays completos para **Europa (EU)** y **América (AM)** (incluyendo Norteamérica, Centroamérica y Sudamérica).
>
> Es vital que investigues y rellenes con precisión los campos `colorGroup` (colores dominantes), `difficulty` (1: muy fácil/famosa, 2: media, 3: difícil/islas/pequeños) y `similar` (3 códigos de banderas visualmente muy parecidas).
>
> TypeScript
>
> ```
> export interface Country {
>   code: string;
>   name: string;
>   capital: string;
>   continent: 'EU' | 'AS' | 'AF' | 'AM' | 'OC';
>   difficulty: 1 | 2 | 3;
>   colorGroup: string;
>   similar: string[];
>   numCode: number;
> }
> 
> export const countries: Country[] = [
>   // ¡Pon aquí TODOS los países de Europa y América del mundo sin dejarte ninguno!
> ```

### 📑 BLOQUE 2: Cuando termine el anterior, ponle este prompt en el mismo chat

> **PROMPT OPENCODE - PAÍSES PARTE 2 (ASIA, ÁFRICA Y OCEANÍA)**
>
> ¡Excelente! Ahora continúa el array `countries` generando **TODOS** los países restantes del mundo correspondientes a **Asia (AS)**, **África (AF)** y **Oceanía (OC)**.
>
> Mantén estrictamente el mismo rigor con los campos `difficulty`, `colorGroup`, `similar` y `numCode`. Asegúrate de no dejarte ningún país africano, asiático o las islas de Oceanía. Solo entrégame el fragmento del array para pegarlo a continuación del anterior.

### 📑 BLOQUE 3: El toque final para las estructuras auxiliares

Para asegurarte de que los minijuegos de los más pequeños (los de 3 años) no se rompan con tantos países nuevos, dile a OpenCode esto:

> **PROMPT OPENCODE - PAÍSES PARTE 3 (Estructuras de soporte)**
>
> Para cerrar el archivo `src/data/countries.ts`, añade debajo del gran array de países las siguientes constantes y configuraciones que necesita nuestro juego. Asegúrate de que `puzzleFlags` contenga banderas icónicas y fáciles de reconocer visualmente para un niño pequeño:
>
> TypeScript
>
> ```
> export const continents = ['EU', 'AS', 'AF', 'AM', 'OC'] as const;
> export type Continent = (typeof continents)[number];
> 
> export const continentNames: Record<Continent, string> = {
>   EU: 'Europa',
>   AS: 'Asia',
>   AF: 'África',
>   AM: 'América',
>   OC: 'Oceanía',
> };
> 
> export const difficultyNames: Record<1 | 2 | 3, string> = {
>   1: 'Fácil',
>   2: 'Medio',
>   3: 'Difícil',
> };
> 
> export const continentAnimals: Record<Continent, string> = {
>   EU: '🦌',
>   AS: '🐯',
>   AF: '🦁',
>   AM: '🦅',
>   OC: '🦘',
> };
> 
> export interface AnimalEntry {
>   emoji: string;
>   name: string;
>   countryCodes: string[];
> }
> 
> // Vincula los animales a los países correspondientes de tu nuevo catálogo masivo
> export const animals: AnimalEntry[] = [
>   { emoji: '🦘', name: 'canguro', countryCodes: ['AU'] },
>   { emoji: '🐨', name: 'koala', countryCodes: ['AU'] },
>   { emoji: '🐼', name: 'panda', countryCodes: ['CN'] },
>   { emoji: '🦁', name: 'león', countryCodes: ['KE', 'ZA'] },
>   { emoji: '🐻', name: 'oso polar', countryCodes: ['CA'] },
>   { emoji: '🦅', name: 'águila', countryCodes: ['US'] },
> ];
> 
> // Solo banderas ideales para el juego del puzle de 2 piezas (fáciles y simétricas)
> export const puzzleFlags = ['JP', 'ES', 'FR', 'CA', 'GB', 'DE', 'IT', 'BR'];
> 
> export type Level = 'explorer' | 'continents' | 'world' | 'expert';
> // ... (reproduce el resto de tus mappers de niveles: levelNames, levelEmojis, levelGreetings, levelBackgrounds y continentColors)
> ```