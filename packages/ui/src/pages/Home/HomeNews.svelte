<script lang="ts">
  import { _ } from 'svelte-i18n';
  import LoadingIndicator from 'components/LoadingIndicator.svelte';
  import { dexNewsService } from 'services/DexNews.service';
  import { Link } from 'svelte-routing';
  import { scrollToTop } from 'utils/Page';

  const { latestNewsFirstPage$ } = dexNewsService;
</script>

<style>
  .news {
    transition: transform 0.1s linear;
  }
  .news:hover,
  .news:focus {
    transform: scale(1.04);
    box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.35);
  }
</style>

<div>
  <h3 class="text-3xl font-bold text-center my-10">{$_('page.home.ready_to_contribute')}</h3>
  <p class="text-lg mb-12 text-center">{$_('page.home.here_are_some_news_to_check')}</p>
  {#if $latestNewsFirstPage$}
    <div class="grid grid-cols-12 gap-4">
      {#each $latestNewsFirstPage$ as postWithAuthor, i}
        {#if i < 6}
          <div class="news p-3 bg-gray col-span-12 lg:col-span-6">
            <Link to="/read/{postWithAuthor.post.slug}" class="w-full h-full" on:click={scrollToTop}>
              <p class="text-lg font-bold">{postWithAuthor.post.title}</p>
              <p class="text-md">{postWithAuthor?.authorProfile?.name}</p>
            </Link>
          </div>
        {/if}
      {/each}
    </div>
  {:else}
    <LoadingIndicator message={$_('page.home.loading_news')} />
  {/if}
</div>
