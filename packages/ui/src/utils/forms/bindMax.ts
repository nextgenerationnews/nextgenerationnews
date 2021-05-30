import { Writable } from 'svelte/store';

export function bindMax(
  node: HTMLInputElement | HTMLTextAreaElement,
  {
    form,
  }: {
    form: Writable<any>;
  },
) {
  const key = node.getAttribute('name');

  if (!key) {
    return;
  }

  const unsubscribe = form.subscribe(context => {
    if (!context.fields[key]) {
      return;
    }

    const field = context.fields[key];
    const validator: string = field.data.validators.find((r: string) => r?.startsWith?.('max:'));
    const validatorAmount = parseInt(validator.split(':')[1], 10);
    node.maxLength = validatorAmount;
  });

  return {
    destroy: unsubscribe,
  };
}
