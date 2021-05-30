<script lang="ts">
  import CommunityChat from 'components/CommunityChat.svelte';
  import { Link } from 'svelte-routing';
  import { dexNewsService } from 'services/DexNews.service';
  import { _ } from 'svelte-i18n';

  export let slug = '';

  $: chatRoom = `dn_${slug}_chat_2`;
  $: post$ = dexNewsService.postBySlug$(slug || '');
</script>

<style>
  .chat-page {
    height: calc(100vh - 3.8rem);
  }
</style>

<div class="flex flex-col chat-page pb-8">
  <div class="page-content flex my-2">
    <div class="mr-4 flex-grow overflow-hidden">
      <span class="color-gray-dark block overflow-ellipsis overflow-hidden whitespace-nowrap w-full"
        >{$_('page.mobile_chat.title', { values: { title: $post$?.post?.title || '' } })}</span>
    </div>
    <Link to="/read/{slug}" getProps={() => ({ class: 'button-outline small whitespace-nowrap' })}
      >{$_('page.mobile_chat.back')}</Link>
  </div>
  <CommunityChat room={chatRoom} mobile={true} />
</div>
