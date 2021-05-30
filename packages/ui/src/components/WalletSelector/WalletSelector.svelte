<script lang="ts">
  import { _ } from 'svelte-i18n';
  import Icon from 'components/Icon.svelte';
  import { mdiWalletPlusOutline, mdiWalletOutline } from '@mdi/js';
  import WalletSelectorOptionsModal from 'components/WalletSelector/WalletSelectorOptionsModal.svelte';
  import { getModalManager } from 'utils/modals/ModalManager';

  let className: string;
  export { className as class };

  export let onConnect: () => void;
  export let onDisconnect: () => void;
  export let walletAddress: string | undefined;
  export let walletBalance: string | undefined;
  export let walletBalanceDom: string | undefined;
  export let userName: string | undefined;
  export let userProfilePictureUrl: string | undefined;

  $: formattedUserName =
    userName && walletAddress ? (userName.length > 16 ? `${userName.slice(0, 16)}...` : userName) : null;

  const modalManager = getModalManager();

  function onClick() {
    if (walletAddress) {
      modalManager.open(WalletSelectorOptionsModal, { onDisconnect });
    } else {
      onConnect();
    }
  }
</script>

<style lang="scss">
  .container {
    background: transparent;
    border: 2px solid white;
    transition: 0.1s linear transform;
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: scale(1.1);
    }
  }

  .icon-bg {
    background-color: var(--color-gray);
    width: 2.5rem;
    height: 2.5rem;
  }

  .wallet-icon-container {
    :global(.wallet-icon) {
      margin: auto;
    }
  }

  .profile-picture {
    background: var(--background-img-url);
    background-size: cover;
    width: 100%;
    height: 100%;
  }
</style>

<div class={className}>
  <button on:click={onClick} class="container rounded-full px-4 py-1">
    {#if walletAddress}
      <div class="flex">
        <div class="flex flex-col flex-grow text-right">
          {#if userName}
            <span class="text-white">{formattedUserName} - {walletAddress.slice(0, 6)}...</span>
          {:else}
            <span class="text-white">{walletAddress.slice(0, 8)}...</span>
          {/if}
          <div class="flex ml-2 text-right justify-end">
            <span class="text-white text-xs">{walletBalance || '0'} ETH</span>
            <span class="text-white text-xs mx-2">|</span>
            <span class="text-white text-xs">{walletBalanceDom || '0'} DOM</span>
          </div>
        </div>
        <div class="rounded-full ml-3 icon-bg flex wallet-icon-container">
          {#if userProfilePictureUrl}
            <div style="--background-img-url: url({userProfilePictureUrl});" class="profile-picture rounded-full" />
          {:else}
            <Icon path={mdiWalletOutline} color="var(--color-black)" class="wallet-icon" top="0" />
          {/if}
        </div>
      </div>
    {:else}
      <Icon path={mdiWalletPlusOutline} color="white" />{' '}<span class="text-white"
        >{$_('navbar.connect_wallet')}</span>
    {/if}
  </button>
</div>
