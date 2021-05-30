import { BehaviorSubject, Observable } from 'rxjs';
import { COUNTRIES } from 'utils/CountryList';
import { Country } from 'models/Country.model';
import { locale, addMessages, init, register, getLocaleFromNavigator } from 'svelte-i18n';
import EnglishMessages from 'i18n/en.json';

class I18nService {
  private readonly countrySubject: BehaviorSubject<Country>;
  public readonly currentCountry$: Observable<Country>;

  constructor() {
    this.countrySubject = new BehaviorSubject<Country>({ code: '', name: '', language: 'en-US' });
    this.currentCountry$ = this.countrySubject.asObservable();
  }
  initialize() {
    this.countrySubject.subscribe(country => {
      locale.set(country.language);
    });

    addMessages('en-US', EnglishMessages);
    addMessages('en', EnglishMessages);
    register('pt-BR', () => import('../i18n/pt-BR.json'));

    const initialLocale = getLocaleFromNavigator();

    init({
      fallbackLocale: 'en-US',
      initialLocale,
    });

    const initialCountry = COUNTRIES.find(r => r.language === initialLocale.substring(0, 2).toLocaleLowerCase());

    if (initialCountry) {
      this.countrySubject.next(initialCountry);
    } else {
      this.countrySubject.next(COUNTRIES.find(c => c.code === 'us'));
    }
  }

  updateCountry(countryCode: string) {
    const country = COUNTRIES.find(c => c.code === countryCode);
    if (country) {
      this.countrySubject.next(country);
    }
  }

  getCurrentCountry() {
    return this.countrySubject.getValue();
  }

  get countryList() {
    return COUNTRIES;
  }
}

export const i18nService = new I18nService();
