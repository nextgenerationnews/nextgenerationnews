import { onDestroy, onMount } from 'svelte';
import type { Subscription } from 'rxjs';

export function subscribeOnMount(fn: () => Subscription) {
  let subscription: Subscription;

  onMount(() => {
    subscription = fn();
  });

  onDestroy(() => {
    subscription.unsubscribe();
  });
}
