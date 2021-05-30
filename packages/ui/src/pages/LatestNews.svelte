<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { combineLatest } from 'rxjs';
  import ContentHeader from 'components/ContentHeader.svelte';
  import NewsSummaryBlock from 'components/NewsSummaryBlock.svelte';
  import { dexNewsService } from 'services/DexNews.service';
  import { i18nService } from 'services/i18n.service';
  import { loggingService } from 'services/Logging.service';
  import { web3ProviderService } from 'services/web3-provider.service';
  import LoadingIndicator from 'components/LoadingIndicator.svelte';
  import type { PostWithAuthor } from 'models/PostWithAuthor.model';
  import { scrollToTop } from 'utils/Page';
  import PageController from 'components/PageController.svelte';

  export let page = 1;

  $: isFetchingResults = false;
  $: posts = [] as { item: PostWithAuthor; size: string }[];

  $: {
    combineLatest([i18nService.currentCountry$, web3ProviderService.provider$]).subscribe(([country]) => {
      fetchMoreResults(page);
    });
  }

  async function fetchMoreResults(page: number) {
    isFetchingResults = true;
    try {
      const unorderedPosts = await dexNewsService.getLatestNews(page);
      const postByDonations = unorderedPosts.sort(
        (a, b) => b.post.donationsCount.toNumber() - a.post.donationsCount.toNumber(),
      );
      posts = (page === 1 ? postByDonations : unorderedPosts).map((p, index) => {
        let size = 'md:col-span-6';

        if (page === 1) {
          size = index <= 2 ? 'md:col-span-12' : index <= 6 ? 'md:col-span-6' : 'md:col-span-4';
        }

        return {
          item: p,
          size,
        };
      });
    } catch (e) {
      loggingService.logException(e);
    } finally {
      isFetchingResults = false;
    }
  }

  function scrollWindow(): void {
    isFetchingResults = true;
    scrollToTop();
  }
</script>

<svelte:head>
  <title>{$_('page.latest_news.title')} - DexNews</title>
</svelte:head>

<ContentHeader title={$_('page.latest_news.title')} />

<div class="page-content">
  {#if isFetchingResults}
    <LoadingIndicator message={$_('page.latest_news.loading')} />
  {:else}
    <div>
      <div class="grid grid-cols-12 gap-6">
        {#each posts as post}
          <div class={`col-span-12 ${post.size}`}>
            <NewsSummaryBlock post={post.item} />
          </div>
        {/each}
      </div>

      <PageController
        class="mx-auto my-20"
        itemCount={posts.length}
        onClick={scrollWindow}
        {page}
        pagePrefix="/latest-news/" />
    </div>
  {/if}
</div>
