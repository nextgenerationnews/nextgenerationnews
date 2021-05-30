<script lang="ts">
  import Icon from './Icon.svelte';
  import { mdiLoading } from '@mdi/js';

  export let size: number | undefined = 1;
  export let color: string | undefined = 'white';
</script>

<Icon path={mdiLoading} spin={true} {size} {color} />
