import { SvelteComponentTyped } from 'svelte';

declare module 'svelte-simple-modal' {
  const Modal: SvelteComponentTyped<{ show?: boolean }>;

  export = Modal;
}
