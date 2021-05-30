<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { mdiEarth, mdiMenu } from '@mdi/js';
  import Icon from 'components/Icon.svelte';
  import ConnectedWalletSelector from 'components/WalletSelector/ConnectedWalletSelector.svelte';
  import { isMenuOpen } from 'stores/menu.store';
  import { link } from 'svelte-routing';

  let className: string;
  export { className as class };

  function toggleMenu() {
    isMenuOpen.update(v => !v);
  }
</script>

<style>
  .header {
    display: flex;
    font-family: 'Oswald', Arial, Helvetica, sans-serif;
    width: 100vw;
  }

  .logo-containter {
    height: 100%;
    width: fit-content;
    display: flex;
    flex-direction: column;
  }

  .globe {
    top: 0;
  }

  .dex {
    color: var(--color-gray);
  }
</style>

<header class="{className} gradient-background header">
  <div class="open-container rounded-r-lg flex my-auto ml-2 md:hidden">
    <button on:click={toggleMenu} type="button" aria-label={$_('app.navbar.menu')} class="h-full p-2 flex flex-col">
      <Icon size={1} path={mdiMenu} top="0" color="white" class="mx-auto top-0" />
    </button>
  </div>
  <div class="logo-containter  mx-auto md:ml-4">
    <div class="flex my-auto">
      <a use:link class="flex" href="/home" aria-label={$_('app.navbar.home')}>
        <Icon path={mdiEarth} class="globe mr-2 my-auto" color="white" size={2} top="0" />
      </a>
      <div class="flex flex-col">
        <a use:link class="my-auto" href="/home">
          <span class="text-white pr-3 md:text-4xl text-3xl my-auto">
            <span class="hidden md:inline-block"><span class="dex">dex</span>News</span>
            <span class="sm:block md:hidden"><span class="dex">d</span>N</span>
          </span>
        </a>
        <div class="-mt-1 hidden md:block pr-7">
          <span class="text-white text-sm -mt-1">{$_('app.slogan')}</span>
        </div>
      </div>
    </div>
  </div>
  <div class="flex-grow hidden md:flex" />
  <ConnectedWalletSelector class="my-auto ml-8 md:mr-8 mr-1 hidden md:block" />
</header>
