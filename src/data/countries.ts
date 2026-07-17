export interface Country {
  code: string;
  name: string;
  capital: string;
  continent: 'EU' | 'AS' | 'AF' | 'AM' | 'OC';
  difficulty: 1 | 2 | 3;
  colorGroup: string;
  similar: string[];
  numCode: number;
}

export const countries: Country[] = [
  { code: 'ES', name: 'España', capital: 'Madrid', continent: 'EU', difficulty: 1, colorGroup: 'red-yellow', similar: ['VE', 'CO', 'EC'], numCode: 724 },
  { code: 'FR', name: 'Francia', capital: 'París', continent: 'EU', difficulty: 1, colorGroup: 'blue-white-red', similar: ['NL', 'LU', 'RU'], numCode: 250 },
  { code: 'DE', name: 'Alemania', capital: 'Berlín', continent: 'EU', difficulty: 1, colorGroup: 'black-red-yellow', similar: ['BE', 'UG', 'DE'], numCode: 276 },
  { code: 'IT', name: 'Italia', capital: 'Roma', continent: 'EU', difficulty: 1, colorGroup: 'green-white-red', similar: ['MX', 'IE', 'CI'], numCode: 380 },
  { code: 'PT', name: 'Portugal', capital: 'Lisboa', continent: 'EU', difficulty: 2, colorGroup: 'green-red', similar: ['AO', 'CV', 'GW'], numCode: 620 },
  { code: 'GB', name: 'Reino Unido', capital: 'Londres', continent: 'EU', difficulty: 1, colorGroup: 'blue-white-red', similar: ['AU', 'NZ', 'FI'], numCode: 826 },
  { code: 'PL', name: 'Polonia', capital: 'Varsovia', continent: 'EU', difficulty: 1, colorGroup: 'white-red', similar: ['ID', 'MC', 'PL'], numCode: 616 },
  { code: 'NL', name: 'Países Bajos', capital: 'Ámsterdam', continent: 'EU', difficulty: 2, colorGroup: 'red-white-blue', similar: ['FR', 'LU', 'RU'], numCode: 528 },
  { code: 'BE', name: 'Bélgica', capital: 'Bruselas', continent: 'EU', difficulty: 2, colorGroup: 'black-yellow-red', similar: ['DE', 'UG', 'AO'], numCode: 56 },
  { code: 'SE', name: 'Suecia', capital: 'Estocolmo', continent: 'EU', difficulty: 2, colorGroup: 'blue-yellow', similar: ['UA', 'SE', 'BB'], numCode: 752 },
  { code: 'NO', name: 'Noruega', capital: 'Oslo', continent: 'EU', difficulty: 2, colorGroup: 'red-white-blue', similar: ['IS', 'TH', 'CR'], numCode: 578 },
  { code: 'FI', name: 'Finlandia', capital: 'Helsinki', continent: 'EU', difficulty: 2, colorGroup: 'blue-white', similar: ['GB', 'AU', 'NZ'], numCode: 246 },
  { code: 'DK', name: 'Dinamarca', capital: 'Copenhague', continent: 'EU', difficulty: 2, colorGroup: 'red-white', similar: ['JP', 'CH', 'TN'], numCode: 208 },
  { code: 'AT', name: 'Austria', capital: 'Viena', continent: 'EU', difficulty: 2, colorGroup: 'red-white', similar: ['PE', 'PL', 'JP'], numCode: 40 },
  { code: 'CH', name: 'Suiza', capital: 'Berna', continent: 'EU', difficulty: 2, colorGroup: 'red-white', similar: ['DK', 'VA', 'TON'], numCode: 756 },
  { code: 'JP', name: 'Japón', capital: 'Tokio', continent: 'AS', difficulty: 1, colorGroup: 'white-red', similar: ['BD', 'PL', 'TG'], numCode: 392 },
  { code: 'CN', name: 'China', capital: 'Pekín', continent: 'AS', difficulty: 1, colorGroup: 'red-yellow', similar: ['VN', 'SG', 'CN'], numCode: 156 },
  { code: 'IN', name: 'India', capital: 'Nueva Delhi', continent: 'AS', difficulty: 1, colorGroup: 'orange-white-green', similar: ['NE', 'NI', 'CI'], numCode: 356 },
  { code: 'KR', name: 'Corea del Sur', capital: 'Seúl', continent: 'AS', difficulty: 2, colorGroup: 'white-red-blue', similar: ['KP', 'JP', 'TH'], numCode: 410 },
  { code: 'SA', name: 'Arabia Saudita', capital: 'Riad', continent: 'AS', difficulty: 2, colorGroup: 'green-white', similar: ['PK', 'SA', 'LY'], numCode: 682 },
  { code: 'TH', name: 'Tailandia', capital: 'Bangkok', continent: 'AS', difficulty: 2, colorGroup: 'red-white-blue', similar: ['CR', 'KP', 'NL'], numCode: 764 },
  { code: 'VN', name: 'Vietnam', capital: 'Hanói', continent: 'AS', difficulty: 2, colorGroup: 'red-yellow', similar: ['CN', 'MG', 'AO'], numCode: 704 },
  { code: 'ID', name: 'Indonesia', capital: 'Yakarta', continent: 'AS', difficulty: 2, colorGroup: 'red-white', similar: ['PL', 'MC', 'SG'], numCode: 360 },
  { code: 'MY', name: 'Malasia', capital: 'Kuala Lumpur', continent: 'AS', difficulty: 2, colorGroup: 'red-white-blue-yellow', similar: ['US', 'LR', 'CU'], numCode: 458 },
  { code: 'SG', name: 'Singapur', capital: 'Singapur', continent: 'AS', difficulty: 3, colorGroup: 'red-white', similar: ['ID', 'PL', 'PE'], numCode: 702 },
  { code: 'ZA', name: 'Sudáfrica', capital: 'Pretoria', continent: 'AF', difficulty: 2, colorGroup: 'green-yellow-black', similar: ['MW', 'ZW', 'ZM'], numCode: 710 },
  { code: 'EG', name: 'Egipto', capital: 'El Cairo', continent: 'AF', difficulty: 2, colorGroup: 'red-white-black', similar: ['YE', 'SY', 'IQ'], numCode: 818 },
  { code: 'NG', name: 'Nigeria', capital: 'Abuya', continent: 'AF', difficulty: 2, colorGroup: 'green-white', similar: ['GN', 'CI', 'BF'], numCode: 566 },
  { code: 'KE', name: 'Kenia', capital: 'Nairobi', continent: 'AF', difficulty: 2, colorGroup: 'black-red-green', similar: ['SS', 'MW', 'UG'], numCode: 404 },
  { code: 'MA', name: 'Marruecos', capital: 'Rabat', continent: 'AF', difficulty: 2, colorGroup: 'red-green', similar: ['DZ', 'MR', 'TN'], numCode: 504 },
  { code: 'GH', name: 'Ghana', capital: 'Acra', continent: 'AF', difficulty: 2, colorGroup: 'red-yellow-green', similar: ['BF', 'ML', 'GN'], numCode: 288 },
  { code: 'ET', name: 'Etiopía', capital: 'Adís Abeba', continent: 'AF', difficulty: 3, colorGroup: 'green-yellow-red', similar: ['BO', 'GH', 'BJ'], numCode: 231 },
  { code: 'TZ', name: 'Tanzania', capital: 'Dodoma', continent: 'AF', difficulty: 3, colorGroup: 'green-yellow-blue', similar: ['BW', 'FK', 'SB'], numCode: 834 },
  { code: 'US', name: 'Estados Unidos', capital: 'Washington D. C.', continent: 'AM', difficulty: 1, colorGroup: 'red-white-blue', similar: ['CL', 'CU', 'PR'], numCode: 840 },
  { code: 'BR', name: 'Brasil', capital: 'Brasilia', continent: 'AM', difficulty: 1, colorGroup: 'green-yellow-blue', similar: ['BW', 'GH', 'ST'], numCode: 76 },
  { code: 'AR', name: 'Argentina', capital: 'Buenos Aires', continent: 'AM', difficulty: 1, colorGroup: 'blue-white', similar: ['UY', 'HN', 'NI'], numCode: 32 },
  { code: 'MX', name: 'México', capital: 'Ciudad de México', continent: 'AM', difficulty: 1, colorGroup: 'green-white-red', similar: ['IT', 'IE', 'CI'], numCode: 484 },
  { code: 'CA', name: 'Canadá', capital: 'Ottawa', continent: 'AM', difficulty: 1, colorGroup: 'red-white', similar: ['JP', 'PL', 'PE'], numCode: 124 },
  { code: 'CO', name: 'Colombia', capital: 'Bogotá', continent: 'AM', difficulty: 2, colorGroup: 'yellow-blue-red', similar: ['EC', 'VE', 'ES'], numCode: 170 },
  { code: 'PE', name: 'Perú', capital: 'Lima', continent: 'AM', difficulty: 2, colorGroup: 'red-white', similar: ['AT', 'CA', 'JP'], numCode: 604 },
  { code: 'CL', name: 'Chile', capital: 'Santiago', continent: 'AM', difficulty: 2, colorGroup: 'red-white-blue', similar: ['US', 'CU', 'PR'], numCode: 152 },
  { code: 'VE', name: 'Venezuela', capital: 'Caracas', continent: 'AM', difficulty: 2, colorGroup: 'yellow-blue-red', similar: ['CO', 'EC', 'ES'], numCode: 862 },
  { code: 'EC', name: 'Ecuador', capital: 'Quito', continent: 'AM', difficulty: 2, colorGroup: 'yellow-blue-red', similar: ['CO', 'VE', 'ES'], numCode: 218 },
  { code: 'BO', name: 'Bolivia', capital: 'Sucre', continent: 'AM', difficulty: 3, colorGroup: 'red-yellow-green', similar: ['ET', 'GH', 'BJ'], numCode: 68 },
  { code: 'AU', name: 'Australia', capital: 'Canberra', continent: 'OC', difficulty: 1, colorGroup: 'blue-white-red', similar: ['GB', 'NZ', 'FI'], numCode: 36 },
  { code: 'NZ', name: 'Nueva Zelanda', capital: 'Wellington', continent: 'OC', difficulty: 2, colorGroup: 'blue-white-red', similar: ['AU', 'GB', 'FI'], numCode: 554 },
  { code: 'FJ', name: 'Fiyi', capital: 'Suva', continent: 'OC', difficulty: 3, colorGroup: 'blue-white-red', similar: ['AU', 'NZ', 'GB'], numCode: 242 },
  { code: 'PG', name: 'Papúa Nueva Guinea', capital: 'Puerto Moresby', continent: 'OC', difficulty: 3, colorGroup: 'red-black-yellow', similar: ['DE', 'UG', 'BE'], numCode: 598 },
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