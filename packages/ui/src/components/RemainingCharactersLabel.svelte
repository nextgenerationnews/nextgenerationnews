<script lang="ts">
  import { bindClass } from 'svelte-forms';
  import type { Form, FormFields, FieldMetaData } from 'svelte-forms';
  export let name: string;
  export let form: Form<FormFields<Record<string, unknown>>>;

  let className: string | undefined = '';
  export { className as class };

  function getRemainingCharactersFromField(formToExtract: FormFields<Record<string, unknown>>): number {
    const data = (formToExtract?.fields as any)?.[name]?.data as FieldMetaData;

    if (!data) {
      return 0;
    }

    const validator = data.validators.find((r: string) => r?.startsWith('max:'));

    if (!validator) {
      return 0;
    }

    const validatorAmount = parseInt(validator.split(':')[1], 10);
    return validatorAmount - data.value.length;
  }

  $: remainingCharacters = getRemainingCharactersFromField($form);
</script>

<style lang="scss">
  .remaining-characters {
    float: right;

    &::after {
      display: none;
    }
  }
</style>

<label for={name} {name} class="remaining-characters {className}" use:bindClass={{ form }}>{remainingCharacters}</label>
