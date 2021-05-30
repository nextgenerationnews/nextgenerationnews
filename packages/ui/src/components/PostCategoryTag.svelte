<script lang="ts">
  import { _ } from 'svelte-i18n';

  let className: string | undefined = '';
  export let category: string;
  export { className as class };
</script>

<style>
  .tag {
    background-color: var(--color-gray);
  }
</style>

<div class="px-2 py-3 inline-block rounded-lg tag {className}">
  {$_(`category_name.${category}`, { default: category })}
</div>
