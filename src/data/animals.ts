export const habitats = ['jungle', 'farm', 'ocean', 'forest', 'savanna'] as const;
export type Habitat = (typeof habitats)[number];

export const soundTypes = ['roar', 'trumpet', 'chirp', 'boing', 'splash'] as const;
export type SoundType = (typeof soundTypes)[number];

export interface AnimalEntry {
  emoji: string;
  name: string;
  countryCodes: string[];
  habitat: Habitat;
  soundType: SoundType;
}

export const animals: AnimalEntry[] = [
  { emoji: '🦘', name: 'canguro', countryCodes: ['AU'], habitat: 'savanna', soundType: 'boing' },
  { emoji: '🐨', name: 'koala', countryCodes: ['AU'], habitat: 'forest', soundType: 'boing' },
  { emoji: '🐼', name: 'panda', countryCodes: ['CN'], habitat: 'forest', soundType: 'chirp' },
  { emoji: '🦁', name: 'león', countryCodes: ['KE', 'ZA'], habitat: 'savanna', soundType: 'roar' },
  { emoji: '🐻', name: 'oso polar', countryCodes: ['CA'], habitat: 'forest', soundType: 'roar' },
  { emoji: '🦅', name: 'águila', countryCodes: ['US'], habitat: 'forest', soundType: 'chirp' },
  { emoji: '🐫', name: 'camello', countryCodes: ['SA', 'EG'], habitat: 'savanna', soundType: 'boing' },
  { emoji: '🦙', name: 'llama', countryCodes: ['PE', 'BO'], habitat: 'forest', soundType: 'boing' },
  { emoji: '🐄', name: 'vaca', countryCodes: ['ES', 'FR', 'CH'], habitat: 'farm', soundType: 'boing' },
  { emoji: '🐒', name: 'mono', countryCodes: ['BR', 'IN'], habitat: 'jungle', soundType: 'chirp' },
  { emoji: '🐬', name: 'delfín', countryCodes: ['FJ', 'NZ'], habitat: 'ocean', soundType: 'splash' },
  { emoji: '🐘', name: 'elefante', countryCodes: ['IN', 'KE'], habitat: 'savanna', soundType: 'trumpet' },
  { emoji: '🐧', name: 'pingüino', countryCodes: ['ZA', 'AR'], habitat: 'ocean', soundType: 'chirp' },
  { emoji: '🐙', name: 'pulpo', countryCodes: ['JP', 'PG'], habitat: 'ocean', soundType: 'splash' },
  { emoji: '🦆', name: 'pato', countryCodes: ['NL', 'DE'], habitat: 'farm', soundType: 'chirp' },
  { emoji: '🦒', name: 'jirafa', countryCodes: ['KE', 'TZ', 'ZA'], habitat: 'savanna', soundType: 'boing' },
  { emoji: '🦓', name: 'cebra', countryCodes: ['KE', 'TZ', 'ZA', 'ET'], habitat: 'savanna', soundType: 'boing' },
  { emoji: '🦏', name: 'rinoceronte', countryCodes: ['KE', 'ZA', 'TZ'], habitat: 'savanna', soundType: 'roar' },
  { emoji: '🐆', name: 'leopardo', countryCodes: ['KE', 'TZ', 'ZA'], habitat: 'savanna', soundType: 'roar' },
  { emoji: '🐊', name: 'cocodrilo', countryCodes: ['KE', 'TZ', 'ZA', 'EG', 'AU'], habitat: 'savanna', soundType: 'splash' },
  { emoji: '🐻', name: 'oso pardo', countryCodes: ['RU', 'CA', 'US', 'FI', 'SE', 'NO', 'ES', 'FR'], habitat: 'forest', soundType: 'roar' },
  { emoji: '🐺', name: 'lobo', countryCodes: ['US', 'CA', 'RU', 'FI', 'SE', 'NO', 'ES', 'FR', 'DE'], habitat: 'forest', soundType: 'roar' },
  { emoji: '🦊', name: 'zorro', countryCodes: ['GB', 'FR', 'DE', 'ES', 'IT', 'US', 'CA', 'AU'], habitat: 'forest', soundType: 'chirp' },
  { emoji: '🦌', name: 'ciervo', countryCodes: ['US', 'CA', 'GB', 'FR', 'DE', 'ES', 'IT', 'SE', 'NO'], habitat: 'forest', soundType: 'boing' },
  { emoji: '🦔', name: 'erizo', countryCodes: ['GB', 'FR', 'DE', 'ES', 'IT', 'NL', 'BE', 'DK'], habitat: 'forest', soundType: 'chirp' },
  { emoji: '🦜', name: 'loro', countryCodes: ['BR', 'CO', 'EC', 'PE', 'AU', 'ID', 'PG'], habitat: 'jungle', soundType: 'chirp' },
  { emoji: '🦉', name: 'búho', countryCodes: ['US', 'CA', 'GB', 'FR', 'DE', 'RU', 'JP'], habitat: 'forest', soundType: 'chirp' },
];
