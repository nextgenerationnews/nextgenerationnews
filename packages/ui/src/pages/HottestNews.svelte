<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { combineLatest } from 'rxjs';
  import ContentHeader from 'components/ContentHeader.svelte';
  import NewsSummaryBlock from 'components/NewsSummaryBlock.svelte';
  import { dexNewsService, POST_PAGE_SIZE } from 'services/DexNews.service';
  import { i18nService } from 'services/i18n.service';
  import { loggingService } from 'services/Logging.service';
  import { web3ProviderService } from 'services/web3-provider.service';
  import { subscribeOnMount } from 'utils/subscribe-on-mount';
  import LoadingIndicator from 'components/LoadingIndicator.svelte';
  import type { PostWithAuthor } from 'models/PostWithAuthor.model';
  import { mdiArrowRight, mdiArrowLeft } from '@mdi/js';
  import Icon from 'components/Icon.svelte';
  import { scrollToTop } from 'utils/Page';
  import { link } from 'svelte-routing';

  export let page = 1;

  $: isFetchingResults = false;
  $: posts = [] as { item: PostWithAuthor; size: string }[];

  subscribeOnMount(() =>
    combineLatest([i18nService.currentCountry$, web3ProviderService.provider$]).subscribe(([country]) => {
      fetchMoreResults();
    }),
  );

  async function fetchMoreResults() {
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
  <title>{$_('page.hottest_news.title')} - DexNews</title>
</svelte:head>

<ContentHeader title={$_('page.hottest_news.title')} />

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
      <div class="my-20 flex justify-center max-w-lg mx-auto">
        {#if page > 1}
          <a use:link class="button-outline flex w-2/5 mr-2" on:click={scrollWindow} href={`/hottest-news/${page - 1}`}>
            <Icon class="my-auto" path={mdiArrowLeft} size={1} />
            <span class="flex-grow my-auto text-center -mb-1 ml-2">{$_('previous_page')}</span>
          </a>
        {/if}
        <div class="color-info w-1/5 flex">
          <span class="m-auto text-2xl">{page}</span>
        </div>
        {#if posts.length >= POST_PAGE_SIZE}
          <a use:link class="button-outline w-2/5 ml-2 flex" on:click={scrollWindow} href={`/hottest-news/${page + 1}`}>
            <span class="flex-grow my-auto text-center -mb-1 mr-2">{$_('next_page')}</span>
            <Icon class="my-auto" path={mdiArrowRight} size={1} />
          </a>
        {/if}
      </div>
    </div>
  {/if}
</div>
