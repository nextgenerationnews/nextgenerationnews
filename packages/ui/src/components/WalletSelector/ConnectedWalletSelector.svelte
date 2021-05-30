<script lang="ts">
  import WalletSelector from './WalletSelector.svelte';
  import { web3ProviderService } from 'services/web3-provider.service';
  import { dexNewsService } from 'services/DexNews.service';
  import { domTokenService } from 'services/DomToken.service';

  let className = '';
  export { className as class };

  const { account$, accountBalanceInEth$ } = web3ProviderService;
  const { accountDomBalance$ } = domTokenService;
  const { profile$ } = dexNewsService;

  function onConnect() {
    web3ProviderService.connect();
  }

  function onDisconnect() {
    web3ProviderService.disconnect();
  }
</script>

<WalletSelector
  walletAddress={$account$}
  walletBalance={$accountBalanceInEth$?.toUnsafeFloat().toFixed(5) || '0'}
  walletBalanceDom={$accountDomBalance$?.toString() || '0'}
  userName={$profile$?.name}
  userProfilePictureUrl={$profile$?.imageUrl}
  class={className}
  {onConnect}
  {onDisconnect} />
