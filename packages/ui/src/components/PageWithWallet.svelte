<script lang="ts">
  import NoWalletConnectedPageContent from 'components/NoWalletConnectedPageContent.svelte';
  import { web3ProviderService } from 'services/web3-provider.service';

  let className: string | undefined = '';
  export let noWalletMessage: string;
  export { className as class };

  const { account$ } = web3ProviderService;
</script>

{#if $account$}
  <div class="page-content {className}">
    <slot />
  </div>
{:else}
  <NoWalletConnectedPageContent message={noWalletMessage} />
{/if}
