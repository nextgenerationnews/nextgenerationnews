<script lang="ts">
  import UserProfilePicture from 'components/UserProfilePicture.svelte';
  import type { DnChatMessage } from 'models/DnChatMessage.model';
  import { _, date, time } from 'svelte-i18n';
  import { link } from 'svelte-routing';

  export let comment: DnChatMessage = null;

  $: hideFullContent = true;

  function toggleHideFullContent() {
    hideFullContent = !hideFullContent;
  }
</script>

<div class="flex my-4 w-full">
  <div class="w-max">
    <UserProfilePicture
      size={3}
      userProfilePictureUrl={comment.profile.imageUrl}
      href="/profile/{comment.profile.address}" />
  </div>
  <div class="ml-2 bg-gray p-4 rounded-lg flex-grow">
    <div class="flex flex-wrap">
      <a use:link href="/profile/{comment.profile.address}" class="block">
        <span class="font-bold text-sm text-black">
          {comment.profile.name} ({comment.profile.address.substr(0, 8)}...):
        </span>
      </a>
      <span class="color-gray-dark text-sm hidden md:block flex-grow text-right">
        {$date(comment.message.timestamp, { format: 'full' })}
        -
        {$time(comment.message.timestamp, { format: 'medium' })}
      </span>
    </div>
    <span class="text-black text-sm block">
      {comment.message.payloadAsUtf8.length > 200 && hideFullContent
        ? comment.message.payloadAsUtf8.substring(0, 200)
        : comment.message.payloadAsUtf8}
      {comment.message.payloadAsUtf8.length > 200 && hideFullContent ? '...' : ''}
    </span>
    {#if comment.message.payloadAsUtf8.length > 200}
      <button class="mt-6 button-outline small" type="button" on:click={toggleHideFullContent}>
        {#if hideFullContent}
          {$_('comments.show_more')}
        {:else}
          {$_('comments.show_less')}
        {/if}
      </button>
    {/if}
  </div>
</div>
