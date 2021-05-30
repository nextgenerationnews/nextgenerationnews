import { Language } from './Language.model';

export interface Country {
  readonly name: string;
  readonly code: string;
  readonly language: Language;
}

export function CountrySort(a: Country, b: Country) {
  const fa = a.name.toLowerCase();
  const fb = b.name.toLowerCase();

  if (fa < fb) {
    return -1;
  }
  if (fa > fb) {
    return 1;
  }
  return 0;
}
