export interface Country {
  code: string;
  name: string;
  continent: 'EU' | 'AS' | 'AF' | 'AM' | 'OC';
  difficulty: 1 | 2 | 3;
  colorGroup: string;
  similar: string[];
}

export const countries: Country[] = [
  { code: 'ES', name: 'España', continent: 'EU', difficulty: 1, colorGroup: 'red-yellow', similar: ['VE', 'CO', 'EC'] },
  { code: 'FR', name: 'Francia', continent: 'EU', difficulty: 1, colorGroup: 'blue-white-red', similar: ['NL', 'LU', 'RU'] },
  { code: 'DE', name: 'Alemania', continent: 'EU', difficulty: 1, colorGroup: 'black-red-yellow', similar: ['BE', 'UG', 'DE'] },
  { code: 'IT', name: 'Italia', continent: 'EU', difficulty: 1, colorGroup: 'green-white-red', similar: ['MX', 'IE', 'CI'] },
  { code: 'PT', name: 'Portugal', continent: 'EU', difficulty: 2, colorGroup: 'green-red', similar: ['AO', 'CV', 'GW'] },
  { code: 'GB', name: 'Reino Unido', continent: 'EU', difficulty: 1, colorGroup: 'blue-white-red', similar: ['AU', 'NZ', 'FI'] },
  { code: 'PL', name: 'Polonia', continent: 'EU', difficulty: 1, colorGroup: 'white-red', similar: ['ID', 'MC', 'PL'] },
  { code: 'NL', name: 'Países Bajos', continent: 'EU', difficulty: 2, colorGroup: 'red-white-blue', similar: ['FR', 'LU', 'RU'] },
  { code: 'BE', name: 'Bélgica', continent: 'EU', difficulty: 2, colorGroup: 'black-yellow-red', similar: ['DE', 'UG', 'AO'] },
  { code: 'SE', name: 'Suecia', continent: 'EU', difficulty: 2, colorGroup: 'blue-yellow', similar: ['UA', 'SE', 'BB'] },
  { code: 'NO', name: 'Noruega', continent: 'EU', difficulty: 2, colorGroup: 'red-white-blue', similar: ['IS', 'TH', 'CR'] },
  { code: 'FI', name: 'Finlandia', continent: 'EU', difficulty: 2, colorGroup: 'blue-white', similar: ['GB', 'AU', 'NZ'] },
  { code: 'DK', name: 'Dinamarca', continent: 'EU', difficulty: 2, colorGroup: 'red-white', similar: ['JP', 'CH', 'TN'] },
  { code: 'AT', name: 'Austria', continent: 'EU', difficulty: 2, colorGroup: 'red-white', similar: ['PE', 'PL', 'JP'] },
  { code: 'CH', name: 'Suiza', continent: 'EU', difficulty: 2, colorGroup: 'red-white', similar: ['DK', 'VA', 'TON'] },
  { code: 'JP', name: 'Japón', continent: 'AS', difficulty: 1, colorGroup: 'white-red', similar: ['BD', 'PL', 'TG'] },
  { code: 'CN', name: 'China', continent: 'AS', difficulty: 1, colorGroup: 'red-yellow', similar: ['VN', 'SG', 'CN'] },
  { code: 'IN', name: 'India', continent: 'AS', difficulty: 1, colorGroup: 'orange-white-green', similar: ['NE', 'NI', 'CI'] },
  { code: 'KR', name: 'Corea del Sur', continent: 'AS', difficulty: 2, colorGroup: 'white-red-blue', similar: ['KP', 'JP', 'TH'] },
  { code: 'SA', name: 'Arabia Saudita', continent: 'AS', difficulty: 2, colorGroup: 'green-white', similar: ['PK', 'SA', 'LY'] },
  { code: 'TH', name: 'Tailandia', continent: 'AS', difficulty: 2, colorGroup: 'red-white-blue', similar: ['CR', 'KP', 'NL'] },
  { code: 'VN', name: 'Vietnam', continent: 'AS', difficulty: 2, colorGroup: 'red-yellow', similar: ['CN', 'MG', 'AO'] },
  { code: 'ID', name: 'Indonesia', continent: 'AS', difficulty: 2, colorGroup: 'red-white', similar: ['PL', 'MC', 'SG'] },
  { code: 'MY', name: 'Malasia', continent: 'AS', difficulty: 2, colorGroup: 'red-white-blue-yellow', similar: ['US', 'LR', 'CU'] },
  { code: 'SG', name: 'Singapur', continent: 'AS', difficulty: 3, colorGroup: 'red-white', similar: ['ID', 'PL', 'PE'] },
  { code: 'ZA', name: 'Sudáfrica', continent: 'AF', difficulty: 2, colorGroup: 'green-yellow-black', similar: ['MW', 'ZW', 'ZM'] },
  { code: 'EG', name: 'Egipto', continent: 'AF', difficulty: 2, colorGroup: 'red-white-black', similar: ['YE', 'SY', 'IQ'] },
  { code: 'NG', name: 'Nigeria', continent: 'AF', difficulty: 2, colorGroup: 'green-white', similar: ['GN', 'CI', 'BF'] },
  { code: 'KE', name: 'Kenia', continent: 'AF', difficulty: 2, colorGroup: 'black-red-green', similar: ['SS', 'MW', 'UG'] },
  { code: 'MA', name: 'Marruecos', continent: 'AF', difficulty: 2, colorGroup: 'red-green', similar: ['DZ', 'MR', 'TN'] },
  { code: 'GH', name: 'Ghana', continent: 'AF', difficulty: 2, colorGroup: 'red-yellow-green', similar: ['BF', 'ML', 'GN'] },
  { code: 'ET', name: 'Etiopía', continent: 'AF', difficulty: 3, colorGroup: 'green-yellow-red', similar: ['BO', 'GH', 'BJ'] },
  { code: 'TZ', name: 'Tanzania', continent: 'AF', difficulty: 3, colorGroup: 'green-yellow-blue', similar: ['BW', 'FK', 'SB'] },
  { code: 'US', name: 'Estados Unidos', continent: 'AM', difficulty: 1, colorGroup: 'red-white-blue', similar: ['CL', 'CU', 'PR'] },
  { code: 'BR', name: 'Brasil', continent: 'AM', difficulty: 1, colorGroup: 'green-yellow-blue', similar: ['BW', 'GH', 'ST'] },
  { code: 'AR', name: 'Argentina', continent: 'AM', difficulty: 1, colorGroup: 'blue-white', similar: ['UY', 'HN', 'NI'] },
  { code: 'MX', name: 'México', continent: 'AM', difficulty: 1, colorGroup: 'green-white-red', similar: ['IT', 'IE', 'CI'] },
  { code: 'CA', name: 'Canadá', continent: 'AM', difficulty: 1, colorGroup: 'red-white', similar: ['JP', 'PL', 'PE'] },
  { code: 'CO', name: 'Colombia', continent: 'AM', difficulty: 2, colorGroup: 'yellow-blue-red', similar: ['EC', 'VE', 'ES'] },
  { code: 'PE', name: 'Perú', continent: 'AM', difficulty: 2, colorGroup: 'red-white', similar: ['AT', 'CA', 'JP'] },
  { code: 'CL', name: 'Chile', continent: 'AM', difficulty: 2, colorGroup: 'red-white-blue', similar: ['US', 'CU', 'PR'] },
  { code: 'VE', name: 'Venezuela', continent: 'AM', difficulty: 2, colorGroup: 'yellow-blue-red', similar: ['CO', 'EC', 'ES'] },
  { code: 'EC', name: 'Ecuador', continent: 'AM', difficulty: 2, colorGroup: 'yellow-blue-red', similar: ['CO', 'VE', 'ES'] },
  { code: 'BO', name: 'Bolivia', continent: 'AM', difficulty: 3, colorGroup: 'red-yellow-green', similar: ['ET', 'GH', 'BJ'] },
  { code: 'AU', name: 'Australia', continent: 'OC', difficulty: 1, colorGroup: 'blue-white-red', similar: ['GB', 'NZ', 'FI'] },
  { code: 'NZ', name: 'Nueva Zelanda', continent: 'OC', difficulty: 2, colorGroup: 'blue-white-red', similar: ['AU', 'GB', 'FI'] },
  { code: 'FJ', name: 'Fiyi', continent: 'OC', difficulty: 3, colorGroup: 'blue-white-red', similar: ['AU', 'NZ', 'GB'] },
  { code: 'PG', name: 'Papúa Nueva Guinea', continent: 'OC', difficulty: 3, colorGroup: 'red-black-yellow', similar: ['DE', 'UG', 'BE'] },
];

export const continents = ['EU', 'AS', 'AF', 'AM', 'OC'] as const;
export type Continent = (typeof continents)[number];

export const continentNames: Record<Continent, string> = {
  EU: 'Europa',
  AS: 'Asia',
  AF: 'África',
  AM: 'América',
  OC: 'Oceanía',
};

export const difficultyNames: Record<1 | 2 | 3, string> = {
  1: 'Fácil',
  2: 'Medio',
  3: 'Difícil',
};

export const difficultyColors: Record<1 | 2 | 3, string> = {
  1: 'bg-green-100 text-green-800',
  2: 'bg-yellow-100 text-yellow-800',
  3: 'bg-red-100 text-red-800',
};

export const continentAnimals: Record<Continent, string> = {
  EU: '🦌',
  AS: '🐯',
  AF: '🦁',
  AM: '🦅',
  OC: '🦘',
};

export interface AnimalEntry {
  emoji: string;
  name: string;
  countryCodes: string[];
}

export const animals: AnimalEntry[] = [
  { emoji: '🦘', name: 'canguro', countryCodes: ['AU'] },
  { emoji: '🐨', name: 'koala', countryCodes: ['AU'] },
  { emoji: '🐼', name: 'panda', countryCodes: ['CN'] },
  { emoji: '🦁', name: 'león', countryCodes: ['KE', 'ZA'] },
  { emoji: '🐻', name: 'oso polar', countryCodes: ['CA'] },
  { emoji: '🦅', name: 'águila', countryCodes: ['US'] },
];

export const puzzleFlags = ['JP', 'ES', 'FR', 'CA', 'GB', 'DE', 'IT', 'BR'];

export type Level = 'explorer' | 'continents' | 'world' | 'expert';

export const levelNames: Record<Level, string> = {
  explorer: 'Explorador',
  continents: 'Continentes',
  world: 'Mundial',
  expert: 'Experto',
};

export const levelEmojis: Record<Level, string> = {
  explorer: '🧭',
  continents: '🗺️',
  world: '🌍',
  expert: '👑',
};

export const levelGreetings: Record<Level, string> = {
  explorer: '¡Nivel Explorador, banderas fáciles!',
  continents: '¡Nivel Continente, elige dónde viajar!',
  world: '¡Nivel Mundial, todas mezcladas!',
  expert: '¡Nivel Súper Experto, cuidado con las trampas!',
};

export const levelBackgrounds: Record<Level, string> = {
  explorer: 'from-green-300 via-green-200 to-emerald-300',
  continents: 'from-blue-300 via-blue-200 to-cyan-300',
  world: 'from-purple-300 via-purple-200 to-violet-300',
  expert: 'from-red-300 via-red-200 to-rose-300',
};

export const continentColors: Record<Continent, string> = {
  EU: 'from-blue-400 to-blue-600',
  AS: 'from-red-400 to-red-600',
  AF: 'from-yellow-400 to-orange-500',
  AM: 'from-green-400 to-green-600',
  OC: 'from-purple-400 to-purple-600',
};