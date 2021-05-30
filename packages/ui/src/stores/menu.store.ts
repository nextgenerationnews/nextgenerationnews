import { responsivityService } from 'services/responsitivy.service';
import { writable } from 'svelte/store';

export const isMenuOpen = writable(responsivityService.isDesktop());

isMenuOpen.subscribe(v => {
  document.querySelector('html')?.setAttribute('menu-open', v ? '1' : '0');
});
