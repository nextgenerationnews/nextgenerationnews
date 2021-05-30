<script lang="ts">
  export let title: string;
  export let large: boolean | undefined = false;
  $: classes = $$props.class;
</script>

<style>
  .separator {
    border-bottom: 2px solid var(--color-gray);
    margin-bottom: 1rem;
    margin-top: 1rem;
  }

  .title {
    color: var(--color-black);
    font-family: 'Roboto', Arial, Helvetica, sans-serif;
    font-weight: bold;
  }
</style>

<div class="{classes} mx-4 md:mx-3">
  <div class="flex">
    <slot name="icon" />
    <h2 class="{large ? 'text-5xl' : 'text-4xl'} title mt-4">{title}</h2>
  </div>
  <div class="separator" />
</div>
