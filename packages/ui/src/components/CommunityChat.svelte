<script lang="ts">
  import { _ } from 'svelte-i18n';
  import UserProfilePicture from 'components/UserProfilePicture.svelte';
  import type { DnChatMessage } from 'models/DnChatMessage.model';
  import { communityService } from 'services/Community.service';
  import { onMount, onDestroy } from 'svelte';
  import { MessagesDirection } from 'models/MessagesDirection.model';
  import Spinner from 'components/Spinner.svelte';
  import { dexNewsService } from 'services/DexNews.service';
  import { web3ProviderService } from 'services/web3-provider.service';
  import { form as createForm, bindClass } from 'svelte-forms';
  import { bindMax } from 'utils/forms/bindMax';
  import RemainingCharactersLabel from 'components/RemainingCharactersLabel.svelte';
  import ChatMessageList from './ChatMessageList.svelte';

  export let room = '';
  export let mobile: boolean | undefined = false;

  $: messages = [] as DnChatMessage[];
  $: disconnectRoom = () => {};
  $: isLoading = true;

  const { profile$ } = dexNewsService;
  const { account$ } = web3ProviderService;

  let messageText = '';

  const postCommentForm = createForm(
    () => ({
      message: { value: messageText, validators: ['max:1024'] },
    }),
    {
      initCheck: false,
    },
  );

  onMount(async () => {
    await communityService.initialize();
    const { disconnect: disconnectMessages, observable: observableChatMessages } = await communityService.connectToRoom(
      room,
      MessagesDirection.DOWNWARDS,
      false,
    );
    observableChatMessages.subscribe(commentsFetched => {
      messages = commentsFetched;
      scrollChat();
    });
    disconnectRoom = disconnectMessages;
    isLoading = false;
  });

  onDestroy(() => {
    disconnectRoom();
  });

  function clearMessage() {
    messageText = '';
  }

  function postMessage() {
    if (messageText.trim()) {
      communityService.sendMessageToRoom(messageText, room);
    }
    clearMessage();
    scrollChat();
  }

  function onKeyUpComents(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      postMessage();
    }
  }

  let messageList: HTMLDivElement;

  function scrollChat() {
    const viewport = messageList?.querySelector('svelte-virtual-list-viewport');
    if (viewport) {
      viewport.scrollTo({
        behavior: 'smooth',
        top: viewport.scrollHeight,
      });
    }
  }
</script>

<style>
  .message-list-desktop {
    height: 60vh;
  }

  .send-button {
    height: min-content;
  }
</style>

<div id="chat" class:flex-grow={mobile} class:flex={mobile} class:flex-col={mobile}>
  {#if isLoading}
    <div class="flex justify-center w-full mb-20" class:mt-20={mobile}>
      <div>
        <Spinner size={2} color="var(--color-black)" />
        <span class="text-2xl ml-4">{$_('page.read_news.loading_chat')}</span>
      </div>
    </div>
  {:else}
    <div
      class="animate__animated animate__fadeIn animate__faster shadow-lg px-4 rounded-lg bg-gray overflow-hidden"
      class:py-4={!mobile}
      class:flex={mobile}
      class:flex-col={mobile}
      class:flex-grow={mobile}>
      <div
        class="overflow-hidden"
        class:mt-10={!mobile}
        class:message-list-desktop={!mobile}
        class:flex-grow={mobile}
        bind:this={messageList}>
        <ChatMessageList {messages} />
      </div>

      <form on:submit|preventDefault={postMessage} class="flex">
        <div class="w-full flex flex-wrap gap-3">
          <UserProfilePicture class="mr-2 mt-7 hidden md:flex" size={3} userProfilePictureUrl={$profile$?.imageUrl} />
          <div class="flex-grow">
            <RemainingCharactersLabel
              class={messageText ? 'mr-1' : 'mr-1 opacity-0'}
              form={postCommentForm}
              name="message" />
            <textarea
              class="text-input p-4 rounded-lg w-full"
              name="message"
              id="message_input"
              rows="1"
              placeholder={$account$ ? $_('page.read_news.say_something') : $_('page.read_news.connect_wallet_to_chat')}
              disabled={!$account$}
              use:bindMax={{ form: postCommentForm }}
              use:bindClass={{ form: postCommentForm }}
              bind:value={messageText}
              on:keyup={onKeyUpComents} />
          </div>
        </div>

        {#if messageText && $account$}
          <button class="button square md:w-max mb-2 mt-8 ml-4 send-button" on:click={postMessage}>
            {$_('page.read_news.send_message')}
          </button>
        {/if}
      </form>
    </div>
  {/if}
</div>
