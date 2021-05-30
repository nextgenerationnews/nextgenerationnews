<script lang="ts">
  import type { PostWithAuthor } from 'models/PostWithAuthor.model';
  import Ticker from 'svelte-ticker';
  import { link } from 'svelte-routing';

  export let news: PostWithAuthor[] = [];
  export let loading = false;

  $: treatedNews = [] as PostWithAuthor[];
  $: updateKey = '';

  $: {
    let buffer: PostWithAuthor[] = [...news];

    if (news.length > 0) {
      while (buffer.length < 10) {
        buffer = [...buffer, ...buffer];
      }
    } else {
      buffer = new Array(10).fill({
        post: { title: 'loading', subtitle: 'loading', slug: 'loading' },
        authorProfile: { name: 'loading' },
      });
    }

    buffer = buffer.splice(0, 10);
    buffer = [...buffer, ...buffer];
    treatedNews = buffer;
    updateKey = buffer.map(r => r.post.title).join('-');
  }
</script>

<style lang="scss">
  .bar {
    background-color: var(--color-gray);
    height: 4.5rem;
  }

  .divider {
    width: 1px;
    height: 1.3rem;
    margin-left: 2rem;
    margin-right: 2rem;
    margin-top: 0.4rem;
    margin-bottom: 0.4rem;
    border-left: 3px solid var(--color-black);
  }

  .item {
    font-family: 'Roboto', Arial, Helvetica, sans-serif;
  }

  .title {
    color: var(--color-black);
    max-width: 45ch;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-bottom: 0.4rem;
    line-height: 0.9rem;
  }

  .subtitle {
    color: var(--color-gray-dark);
    max-width: 60ch;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 0.7rem;
  }

  .author {
    color: var(--color-black);
  }

  .entry {
    user-select: none;
    display: flex;
    cursor: pointer;

    &.skeleton {
      .title,
      .author,
      .subtitle {
        &,
        &:hover {
          background-color: var(--color-gray-dark);
          color: transparent !important;
          opacity: 0.2;
          border-radius: 9999px;
          animation: Flashing 2s ease infinite;
          min-width: 36ch;
        }
      }
    }

    @keyframes Flashing {
      0% {
        opacity: 20%;
      }
      50% {
        opacity: 50%;
      }
      100% {
        opacity: 20%;
      }
    }

    &:hover {
      background-color: var(--color-black);

      .title {
        color: white;
      }

      .subtitle {
        color: white;
      }

      .author {
        color: white;
        text-decoration: underline;
      }
    }
  }
</style>

<div class="bar py-3 px-10">
  {#key updateKey}
    <Ticker loop={true} duration={180}>
      {#each treatedNews as newsData}
        <div class="divider" />
        <div
          class="entry animate__animated animate__fadeIn animate__faster px-4 py-2 rounded-lg"
          class:skeleton={loading}>
          <div class="item">
            <a use:link href={`/read/${newsData.post.slug}`}>
              <span class="text-md block title">
                {newsData.post.title}
              </span>
              <span class="text-xs block subtitle">
                {#if newsData?.authorProfile?.name}
                  <span class="author">{newsData.authorProfile.name}: </span>
                {/if}
                {newsData.post.subtitle}
              </span>
            </a>
          </div>
        </div>
      {/each}
    </Ticker>
  {/key}
</div>
