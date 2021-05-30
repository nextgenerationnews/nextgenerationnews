<script lang="ts">
  import ContentHeader from 'components/ContentHeader.svelte';
  import { _ } from 'svelte-i18n';
  import { readingListService } from 'services/reading-list.service';
  import NewsSummaryBlock from 'components/NewsSummaryBlock.svelte';
  import { getModalManager } from 'utils/modals/ModalManager';
  import RemoveFromReadingListModal from './RemoveFromReadingListModal.svelte';
  import type { PostWithAuthor } from 'models/PostWithAuthor.model';

  const modalManager = getModalManager();
  const { articlesList$ } = readingListService;

  function removeFromMyReadingList(post: PostWithAuthor) {
    modalManager.open(RemoveFromReadingListModal, {
      onConfirm: () => readingListService.popArticle(post.post.slug),
      post: post.post,
    });
  }
</script>

<svelte:head>
  <title>{$_('page.reading_list.title')} - DexNews</title>
</svelte:head>

<ContentHeader title={$_('page.reading_list.title')} />

<div class="page-content">
  <div class="grid grid-cols-12 gap-6 mt-10">
    {#each $articlesList$ as post}
      <div class="col-span-12 md:col-span-6">
        <NewsSummaryBlock linkToStorage={true} {post}>
          <div slot="actions" class="px-4 mt-4 mb-4 flex">
            <button class="button-outline small flex-grow" on:click={() => removeFromMyReadingList(post)}
              >{$_('page.reading_list.remove_from_reading_list')}</button>
          </div>
        </NewsSummaryBlock>
      </div>
    {/each}
  </div>
</div>
