<script lang="ts">
  import Icon from 'components/Icon.svelte';
  import { mdiAlertBoxOutline } from '@mdi/js';

  export let message = '';
</script>

<div class="page-content mb-20">
  <div class="flex w-full justify-center mt-8">
    <Icon path={mdiAlertBoxOutline} size={7} color="var(--color-warn-light)" />
  </div>
  <p class="text-4xl text-center mt-20 color-warn">
    {message}
  </p>
</div>
