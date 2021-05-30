declare module 'svelte-notifications' {
  export const NotificationDisplay: any;

  export type NotificationPosition =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  export type NotificationType = 'success' | 'warning' | 'danger';

  export interface Notification {
    text: string;
    position: NotificationPosition;
    id?: number;
    type?: NotificationType;
    removeAfter?: number;
  }

  export function getNotificationsContext(): {
    addNotification: (notification: Notification) => void;
    removeNotification: (id: number) => void;
    clearNotifications: () => void;
    subscribe: (callback: (event?: any) => void) => void;
  };

  export = NotificationDisplay;
}
