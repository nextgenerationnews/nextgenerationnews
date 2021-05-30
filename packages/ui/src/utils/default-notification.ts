import type { Notification } from 'svelte-notifications';

export function defaultNotification(text: string, otherProps: Partial<Notification> = {}): Notification {
  return {
    text,
    position: 'bottom-right',
    removeAfter: 10000,
    ...otherProps,
  };
}
