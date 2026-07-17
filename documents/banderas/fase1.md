# 🗺️ FASE 1: Configuración, Datos Core y Motor de Voz (TTS)
## Objetivo
Montar la estructura del proyecto en React + TypeScript + Tailwind, crear el catálogo de países y programar el "altavoz" nativo del navegador.

## Estructura de Archivos a Crear
- src/data/countries.json (Catálogo de banderas)
- src/hooks/useSpeech.ts (Hook personalizado de voz)
- src/components/VoiceTest.tsx (Pantalla temporal para probar que la voz y las banderas cargan)

## PROMPT PARA OPENCODE - FASE 1
Vamos a crear una aplicación web infantil para aprender banderas usando React, TypeScript, Vite y Tailwind CSS. No tiene texto para el usuario final (diseñada para niños no lectores).

**Paso 1**: Configurar el archivo de datos src/data/countries.json
Crea un archivo JSON con al menos 20 países (repartidos equitativamente entre Europa 'EU', Asia 'AS', África 'AF', América 'AM' y Oceanía 'OC'). Cada objeto país debe seguir estrictamente esta interfaz:

```TypeScript
interface Country {
    code: string;        // Código ISO en MAYÚSCULAS (ej: "ES", "JP", "UA")
    name: string;        // Nombre en español (ej: "España")
    continent: 'EU' | 'AS' | 'AF' | 'AM' | 'OC';
    difficulty: 1 | 2 | 3; // 1: Muy famosas, 2: Medias, 3: Difíciles
    colorGroup: string;  // Criterio de color dominante (ej: "red-yellow", "blue-white")
    similar: string[];   // Códigos de 3 banderas parecidas visualmente
}
```

**Paso 2**: Crear el Hook de Voz src/hooks/useSpeech.ts
Necesitamos un hook de React que use la Web Speech API (window.speechSynthesis). Debe:
1. Detectar si el navegador soporta síntesis de voz.
2. Buscar una voz en español (es-ES o fallbacks de español neutro).
3. Exponer una función speak(text: string) que configure la voz con un tono ligeramente infantil/agradable (pitch: 1.2) y un ritmo pausado (rate: 0.95) ideal para niños.
4. Asegurarse de cancelar cualquier locución anterior antes de hablar de nuevo para evitar solapamientos si el niño pulsa el botón muchas veces.

**Paso 3**: Pantalla de Prueba src/App.tsx
Modifica el archivo principal para renderizar un grid con las primeras 6 banderas.
Importante: Utiliza el CDN gratuito de flagcdn.com con formato SVG. Como el CDN requiere los códigos en minúscula, asegúrate de formatear la URL así: [https://flagcdn.com/$](https://flagcdn.com/$){country.code.toLowerCase()}.svg.
Aplica clases de Tailwind para que los SVG se rendericen en un contenedor proporcional (ej: aspect-video w-32 object-cover rounded-lg shadow-md).
Al hacer clic en cualquier bandera, el hook de voz debe decir: "¡Esta es la bandera de [Nombre del País]!".

Genera el código limpio y tipado en TypeScript.