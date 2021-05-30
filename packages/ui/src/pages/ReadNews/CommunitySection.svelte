<script lang="ts">
  import Icon from 'components/Icon.svelte';
  import { mdiAccountGroup } from '@mdi/js';
  import { _ } from 'svelte-i18n';
  import CommunityComments from 'components/CommunityComments.svelte';
  import CommunityChat from 'components/CommunityChat.svelte';
  import { responsivityService } from 'services/responsitivy.service';
  import { navigate } from 'svelte-routing';

  export let roomPrefix = '';
  let className: string | undefined = '';
  export { className as class };

  $: currentSection = 'comments';

  function toggleComments() {
    currentSection = 'comments';
  }

  function toggleChat() {
    if (responsivityService.isMobile()) {
      navigate(`/read/${roomPrefix}/chat`);
    } else {
      currentSection = 'chat';
    }
  }

  const commentsRoom = `dn_${roomPrefix}_comments_2`;
  const chatRoom = `dn_${roomPrefix}_chat_2`;
</script>

<style lang="scss">
</style>

<div class={className}>
  <div>
    <div class="flex mb-10">
      <Icon path={mdiAccountGroup} class="color-gray-dark my-auto mr-4 pb-10" size={1.5} />
      <div class="flex">
        <div>
          <h5 class="color-gray-dark font-bold text-2xl">
            {$_('page.read_news.whats_the_community_saying')}
          </h5>
          <h6 class="color-gray-dark">
            {$_('page.read_news.feel_free_to_speak_your_mind')}
          </h6>
        </div>
      </div>
    </div>

    <div class="tab-container mb-10">
      <button class="tab" class:active={currentSection === 'comments'} on:click={toggleComments}>Comments</button>
      <button class="tab" class:active={currentSection === 'chat'} on:click={toggleChat}>Chat</button>
    </div>

    {#if currentSection === 'comments'}
      <CommunityComments room={commentsRoom} />
    {:else if currentSection === 'chat'}
      <CommunityChat room={chatRoom} />
    {/if}
  </div>
</div>
