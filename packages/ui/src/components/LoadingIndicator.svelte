<script lang="ts">
  import Spinner from 'components/Spinner.svelte';

  export let message: string;
</script>

<div class="flex">
  <div class="mx-auto my-6">
    <Spinner color="var(--color-black)" size={1.2} />
    <span class="ml-2">{message}</span>
  </div>
</div>
