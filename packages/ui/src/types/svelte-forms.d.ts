// import type { Writable } from 'svelte/types/runtime/store/index';

declare module 'svelte-forms' {
  export interface FieldMetaData {
    validators: string[];
    value: string;
  }

  export interface FieldData {
    valid: boolean;
    errors: string[];
    pending: boolean;
    enabled: boolean;
    data: Validator;
  }

  export interface FormFields<T extends Record<string, unknown>> {
    fields: { [key: keyof T]: FieldData };
    oldFields: { [key: keyof T]: FieldData };
    valid: boolean;
    dirty: boolean;
  }

  export interface Form<T extends FormFields> {
    set(value: T): void;
    update(updater: (value: T) => T): void;
    subscribe(run: (value: T) => void, invalidate?: (value?: T) => void): () => void;
    validate(): void;
    reset(): void;
  }

  export interface CreateFormConfig {
    initCheck: boolean;
    validateOnChange: boolean;
    stopAtFirstError: boolean;
    stopAtFirstFieldError: boolean;
  }

  export interface FormFieldDefinition {
    name: string;
    validators?: string[];
  }

  export function form<T extends Record<string, FormFieldDefinitio>>(
    createFn: () => T,
    config?: Partial<CreateFormConfig>,
  ): Form<FormFields<T>>;

  export function bindClass<T extends Record<string, FormFieldDefinitio>>(
    node: HTMLElement,
    opts: {
      form: Form<T>;
      name?: string;
      valid?: string;
      invalid?: string;
      dirty?: string;
    },
  ): void;
}
