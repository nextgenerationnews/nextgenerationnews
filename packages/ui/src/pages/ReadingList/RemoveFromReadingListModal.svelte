<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { getModalManager } from 'utils/modals/ModalManager';
  import type { Post } from 'models/Post.model';

  export let onConfirm: () => void = () => {};
  export let post: Post;

  const modalManager = getModalManager();

  function onCancelClick() {
    modalManager.close();
  }

  function onConfirmClick() {
    onConfirm();
    modalManager.close();
  }
</script>

<div class="px-4 pt-4">
  <p class="text-2xl mb-20">
    {$_('page.reading_list.confirm_removal', {
      values: {
        article: post.title,
      },
    })}
  </p>
  <div class="flex flex-wrap justify-end">
    <button class="button-outline danger w-full md:w-max mb-8 md:mr-5" on:click={onConfirmClick}
      >{$_('page.reading_list.delete')}</button>
    <button class="button-outline w-full md:w-max mb-8" on:click={onCancelClick}
      >{$_('page.reading_list.cancel')}</button>
  </div>
</div>
