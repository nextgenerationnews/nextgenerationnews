<script lang="ts">
  import { subscribeOnMount } from 'utils/subscribe-on-mount';
  import type { PostWithAuthor } from 'models/PostWithAuthor.model';
  import { web3ProviderService } from 'services/web3-provider.service';
  import { dexNewsService } from 'services/DexNews.service';
  import { loggingService } from 'services/Logging.service';
  import { scrollToTop } from 'utils/Page';
  import { _ } from 'svelte-i18n';
  import LoadingIndicator from 'components/LoadingIndicator.svelte';
  import Icon from 'components/Icon.svelte';
  import { mdiTextBoxSearchOutline } from '@mdi/js';
  import PageController from 'components/PageController.svelte';
  import NewsSummaryBlock from 'components/NewsSummaryBlock.svelte';

  export let walletAddress = '';
  export let page = 1;

  $: isLoading = false;
  $: posts = [] as PostWithAuthor[];

  subscribeOnMount(() =>
    web3ProviderService.provider$.subscribe(() => {
      fetchMoreResults();
    }),
  );

  async function fetchMoreResults() {
    isLoading = true;
    try {
      posts = await dexNewsService.searchNews(page, '', '', walletAddress);
    } catch (e) {
      loggingService.logException(e);
    } finally {
      isLoading = false;
    }
  }

  function scrollWindow(): void {
    isLoading = true;
    scrollToTop();
  }
</script>

<div class="page-content">
  {#if isLoading}
    <LoadingIndicator message={$_('page.search_news.loading')} />
  {:else if page === 1 && posts.length === 0}
    <div class="my-20">
      <div class="flex w-full justify-center">
        <Icon path={mdiTextBoxSearchOutline} size={7} color="var(--color-warn-light)" />
      </div>
      <p class="text-4xl text-center mt-20 color-warn">{$_('page.search_news.no_results')}</p>
    </div>
  {:else}
    <div class="grid grid-cols-12 gap-6">
      {#each posts as post}
        <div class="col-span-12 md:col-span-6">
          <NewsSummaryBlock {post} />
        </div>
      {/each}
    </div>

    <PageController
      class="mx-auto my-20"
      itemCount={posts.length}
      onClick={scrollWindow}
      {page}
      pageSuffix=""
      pagePrefix="/profile/{walletAddress}/articles/" />
  {/if}
</div>
