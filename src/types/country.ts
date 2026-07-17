export interface Country {
  code: string;
  name: string;
  continent: 'EU' | 'AS' | 'AF' | 'AM' | 'OC';
  difficulty: 1 | 2 | 3;
  colorGroup: string;
  similar: string[];
}