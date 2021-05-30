<script lang="ts">
  import { _ } from 'svelte-i18n';
  import UserProfilePicture from 'components/UserProfilePicture.svelte';
  import type { DnChatMessage } from 'models/DnChatMessage.model';
  import { communityService } from 'services/Community.service';
  import { onMount, onDestroy } from 'svelte';
  import { MessagesDirection } from 'models/MessagesDirection.model';
  import Spinner from 'components/Spinner.svelte';
  import CommentsList from 'components/CommentsList.svelte';
  import { dexNewsService } from 'services/DexNews.service';
  import { web3ProviderService } from 'services/web3-provider.service';
  import { form as createForm, bindClass } from 'svelte-forms';
  import { bindMax } from 'utils/forms/bindMax';
  import RemainingCharactersLabel from 'components/RemainingCharactersLabel.svelte';

  export let room = '';

  $: comments = [] as DnChatMessage[];
  $: disconnectRoom = () => {};
  $: isLoading = true;

  const { profile$ } = dexNewsService;
  const { account$ } = web3ProviderService;

  let commentText = '';

  const postCommentForm = createForm(
    () => ({
      comment: { value: commentText, validators: ['max:2048'] },
    }),
    {
      initCheck: false,
    },
  );

  onMount(async () => {
    await communityService.initialize();
    const { disconnect: disconnectComments, observable: observableComments } = await communityService.connectToRoom(
      room,
      MessagesDirection.UPWARDS,
    );
    observableComments.subscribe(commentsFetched => {
      comments = commentsFetched;
    });
    disconnectRoom = disconnectComments;
    isLoading = false;
  });

  onDestroy(() => {
    disconnectRoom();
  });

  function clearComment() {
    commentText = '';
  }

  function postComment() {
    if (commentText.trim()) {
      communityService.sendMessageToRoom(commentText, room);
    }
    clearComment();
  }

  function onKeyUpComents(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.shiftKey) {
      postComment();
    }
  }
</script>

<div id="comments">
  {#if isLoading}
    <div class="flex justify-center w-full mb-20">
      <div>
        <Spinner size={2} color="var(--color-black)" />
        <span class="text-2xl ml-4">{$_('page.read_news.loading_comments')}</span>
      </div>
    </div>
  {:else}
    <div class="animate__animated animate__fadeIn animate__faster">
      <span class="block text-md color-gray-dark mb-10 capitalize">
        {$_('page.read_news.comment_count', { values: { count: comments.length } })}
      </span>

      <form on:submit|preventDefault={postComment}>
        <div class="w-full flex flex-wrap gap-3">
          <UserProfilePicture class="mr-3 mt-6 hidden md:flex" size={3} userProfilePictureUrl={$profile$?.imageUrl} />
          <div class="flex-grow">
            <RemainingCharactersLabel
              class={commentText ? 'mr-1' : 'mr-1 opacity-0'}
              form={postCommentForm}
              name="comment" />
            <textarea
              class="text-input p-4 rounded-lg w-full"
              name="comment"
              id="comments_input"
              rows="3"
              placeholder={$account$
                ? $_('page.read_news.add_a_public_comment')
                : $_('page.read_news.connect_wallet_to_comment')}
              disabled={!$account$}
              use:bindMax={{ form: postCommentForm }}
              use:bindClass={{ form: postCommentForm }}
              bind:value={commentText}
              on:keyup={onKeyUpComents} />
          </div>
        </div>

        {#if commentText && $account$}
          <div
            class="flex flex-wrap w-full mt-6 justify-start md:justify-end animate__animated animate__fadeIn animate__faster flex-col-reverse md:flex-row">
            <button class="button-outline small md:mr-2 w-full md:w-max" on:click={clearComment}>
              {$_('page.read_news.cancel_comment')}
            </button>
            <button class="button squared small w-full md:w-max mb-4 md:mb-0" on:click={postComment}>
              {$_('page.read_news.post_comment')}
            </button>
          </div>
        {/if}
      </form>

      <div class="mt-10">
        {#if comments.length === 0}
          <span class="block text-lg color-gray-dark mb-6 text-center">
            {$_('page.read_news.no_comments_yet')}
          </span>
        {/if}

        <CommentsList {comments} />
      </div>
    </div>
  {/if}
</div>
