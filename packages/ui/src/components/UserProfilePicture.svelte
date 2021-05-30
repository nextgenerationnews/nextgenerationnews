<script lang="ts">
  import Icon from 'components/Icon.svelte';
  import { mdiAccountOutline } from '@mdi/js';
  import { link } from 'svelte-routing';

  export let userProfilePictureUrl: string | undefined = '';
  export let size: number | undefined = 4;
  export let href: string | undefined = '';
  let className: string | undefined = '';
  export { className as class };
</script>

<style>
  .profile-picture {
    background: var(--background-img-url);
    background-size: cover;
    width: 100%;
    height: 100%;
  }
</style>

<div
  class="rounded-full ml-3 flex {className}"
  class:gradient-background-light={!userProfilePictureUrl}
  style="width: {size}rem; height: {size}rem;">
  {#if userProfilePictureUrl}
    {#if href}
      <a use:link {href} class="contents" style="--background-img-url: url({userProfilePictureUrl});">
        <span class="profile-picture rounded-full" />
      </a>
    {:else}
      <div style="--background-img-url: url({userProfilePictureUrl});" class="profile-picture rounded-full" />
    {/if}
  {:else}
    <Icon
      path={mdiAccountOutline}
      size="{(size || 4) - 0.5}rem"
      color="var(--color-gray-dark)"
      class="m-auto wallet-icon rounded-full"
      top="0" />
  {/if}
</div>
