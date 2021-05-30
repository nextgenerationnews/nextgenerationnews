<script lang="ts">
  import { _ } from 'svelte-i18n';
  import ContentHeader from 'components/ContentHeader.svelte';
  import PageWithWallet from 'components/PageWithWallet.svelte';

  export let page = 1;
</script>

<svelte:head>
  <title>{$_('page.my_published_news.title')} - DexNews</title>
</svelte:head>

<ContentHeader title={$_('page.my_published_news.title')} />

<PageWithWallet noWalletMessage={$_('page.my_published_news.please_connect_your_wallet')}>
  <div>stuff {page}</div>
</PageWithWallet>
