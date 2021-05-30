<script lang="ts">
  import { web3ProviderService } from 'services/web3-provider.service';
  import ConnectedWalletSelector from './WalletSelector/ConnectedWalletSelector.svelte';
  import { _ } from 'svelte-i18n';

  const { account$ } = web3ProviderService;
</script>

<div class="md:hidden px-2 py-4">
  {#if $account$}
    <div class="mb-4"><span class="text-white">{$_('navbar.welcome')}</span></div>
  {/if}
  <div><ConnectedWalletSelector /></div>
</div>
