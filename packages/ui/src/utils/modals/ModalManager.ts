import { getContext, SvelteComponent } from 'svelte';

export interface ModalManager {
  open<Props = Record<string, unknown>>(c: typeof SvelteComponent, props: Props): void;
  close(): void;
}

export function getModalManager(): ModalManager {
  return getContext('simple-modal');
}
