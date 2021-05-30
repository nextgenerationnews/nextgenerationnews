<script lang="ts">
  import Icon from 'components/Icon.svelte';
  import { mdiOpenInNew } from '@mdi/js';

  export let href: string;
  export let showIcon: boolean | undefined = true;
  let className: string | undefined = '';
  export { className as class };
</script>

<a class="link {className}" {href}
  ><slot />
  {#if showIcon}
    <Icon path={mdiOpenInNew} size={1} />
  {/if}
</a>
