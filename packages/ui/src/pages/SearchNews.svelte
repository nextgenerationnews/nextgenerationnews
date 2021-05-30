<script lang="ts">
  import ContentHeader from 'components/ContentHeader.svelte';
  import LoadingIndicator from 'components/LoadingIndicator.svelte';
  import NewsSummaryBlock from 'components/NewsSummaryBlock.svelte';
  import { _ } from 'svelte-i18n';
  import type { PostWithAuthor } from 'models/PostWithAuthor.model';
  import { subscribeOnMount } from 'utils/subscribe-on-mount';
  import { dexNewsService } from 'services/DexNews.service';
  import { web3ProviderService } from 'services/web3-provider.service';
  import { i18nService } from 'services/i18n.service';
  import { loggingService } from 'services/Logging.service';
  import { combineLatest } from 'rxjs';
  import { scrollToTop } from 'utils/Page';
  import PageController from 'components/PageController.svelte';
  import Icon from 'components/Icon.svelte';
  import { mdiTextBoxSearchOutline } from '@mdi/js';

  export let page = 1;
  export let initialTitle: string | undefined = '';
  export let initialCategory: string | undefined = '';

  const { categories$ } = dexNewsService;
  const { currentCountry$ } = i18nService;

  let fTitle: string = initialTitle || '';
  let fCategory: string = initialCategory || '';

  $: hasQueryParams = Boolean(initialTitle) || Boolean(initialCategory);
  $: isLoading = false;
  $: posts = [] as PostWithAuthor[];

  subscribeOnMount(() =>
    combineLatest([currentCountry$, web3ProviderService.provider$]).subscribe(([country]) => {
      if (hasQueryParams) {
        fetchMoreResults(initialTitle, initialCategory, page);
      }
    }),
  );

  async function fetchMoreResults(title: string, category: string, page: number) {
    isLoading = true;
    try {
      posts = await dexNewsService.searchNews(page, title || '', category || '');
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

<svelte:head>
  <title>{$_('page.search_news.title')} - DexNews</title>
</svelte:head>

<ContentHeader title={$_('page.search_news.title')} />

<div class="page-content">
  <div class="bg-gray rounded-lg p-4 mb-10">
    <form action="/search-news/1">
      <div class="grid grid-cols-12 gap-2 lg:gap-4 xl:gap-6 mt-2">
        <fieldset class="col-span-12 md:col-span-12 lg:col-span-4 xl:col-span-5 2xl:col-span-8">
          <label name="title" for="title">{$_('page.search_news.fields.title')}</label>
          <input bind:value={fTitle} name="title" id="title" type="text" class="text-input input rounded p-4 w-full" />
        </fieldset>
        <fieldset class="col-span-12 md:col-span-12 lg:col-span-4 xl:col-span-4 2xl:col-span-2">
          <label name="title" for="title">{$_('page.search_news.fields.category')}</label>
          <select bind:value={fCategory} class="text-input input rounded p-4 w-full" name="category" id="category">
            {#if $categories$}
              <option value="">{$_('page.search_news.fields.all_categories')}</option>
              {#each $categories$ as category}
                <option value={category}>{$_(`category_name.${category}`, { default: category })}</option>
              {/each}
            {/if}
          </select>
        </fieldset>
        <fieldset class="col-span-12 md:col-span-12 lg:col-span-4 xl:col-span-3 2xl:col-span-2 flex mt-6">
          <button class="button w-full m-auto">{$_('page.search_news.search')}</button>
        </fieldset>
      </div>
    </form>
  </div>
  <div>
    {#if isLoading}
      <LoadingIndicator message={$_('page.search_news.loading')} />
    {:else if hasQueryParams}
      {#if page === 1 && posts.length === 0}
        <div class="my-20">
          <div class="flex w-full justify-center">
            <Icon path={mdiTextBoxSearchOutline} size={7} color="var(--color-warn-light)" />
          </div>
          <p class="text-4xl text-center mt-20 color-warn">{$_('page.search_news.no_results')}</p>
          <p class="text-2xl text-center mt-6 color-gray-dark opacity-50">{$_('page.search_news.filters_applied')}</p>
          <p class="text-md text-center mt-2 color-gray-dark opacity-50">
            {$_('page.search_news.country_filter_applied', {
              values: {
                country: $_(`country_name.${$currentCountry$?.name}`, { default: $currentCountry$?.name }),
              },
            })}
          </p>
          {#if fTitle}
            <p class="text-md text-center color-gray-dark opacity-50">
              {$_('page.search_news.title_filter_applied', {
                values: {
                  title: fTitle,
                },
              })}
            </p>
          {/if}
          {#if fCategory}
            <p class="text-md text-center color-gray-dark opacity-50">
              {$_('page.search_news.category_filter_applied', {
                values: {
                  category: $_(`category_name.${fCategory}`, { default: fCategory }),
                },
              })}
            </p>
          {/if}
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
          pageSuffix={window.location.search}
          pagePrefix="/search-news/" />
      {/if}
    {/if}
  </div>
</div>
