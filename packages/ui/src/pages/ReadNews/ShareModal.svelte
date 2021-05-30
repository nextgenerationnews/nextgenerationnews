<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { getNotificationsContext } from 'svelte-notifications';
  import { mdiFacebook, mdiTwitter, mdiLinkedin, mdiEmail, mdiNewspaper, mdiReddit } from '@mdi/js';
  import {
    postLink,
    shareOnEmailLink,
    shareOnFacebookLink,
    shareOnHackerNewsLink,
    shareOnLinkedInLink,
    shareOnRedditLink,
    shareOnTwitterLink,
  } from 'utils/Share';
  import type { Post } from 'models/Post.model';
  import { defaultNotification } from 'utils/default-notification';
  import Icon from 'components/Icon.svelte';

  const { addNotification } = getNotificationsContext();

  export let post: Post;
  let textInput: HTMLInputElement;

  function onCopy() {
    textInput.select();
    textInput.setSelectionRange(0, 99999);
    document.execCommand('copy');
    addNotification(defaultNotification($_('page.read_news.copied_link')));
  }
</script>

<div class="w-full overflow-visible">
  <h1 class="text-2xl mb-6">{$_('page.read_news.share_this')}</h1>

  <div class="flex w-full">
    <input
      bind:this={textInput}
      type="text"
      class="text-input-outline input p-4 w-full md:w-auto md:flex-grow w-full color-info"
      readonly
      value={postLink(post)} />
    <button class="button-outline ml-2" on:click={onCopy}>{$_('page.read_news.copy')}</button>
  </div>

  <div class="mt-4 flex flex-wrap justify-center">
    <a href={shareOnFacebookLink(post)} rel="noopener" target="_blank" class="button-icon mt-2 ml-3"
      ><Icon path={mdiFacebook} size={1.5} color="var(--color-info)" /></a>
    <a href={shareOnTwitterLink(post)} rel="noopener" target="_blank" class="button-icon mt-2 ml-3"
      ><Icon path={mdiTwitter} size={1.5} color="var(--color-info)" /></a>
    <a href={shareOnLinkedInLink(post)} rel="noopener" target="_blank" class="button-icon mt-2 ml-3"
      ><Icon path={mdiLinkedin} size={1.5} color="var(--color-info)" /></a>
    <a href={shareOnRedditLink(post)} rel="noopener" target="_blank" class="button-icon mt-2 ml-3"
      ><Icon path={mdiReddit} size={1.5} color="var(--color-info)" /></a>
    <a href={shareOnHackerNewsLink(post)} rel="noopener" target="_blank" class="button-icon mt-2 ml-3"
      ><Icon path={mdiNewspaper} size={1.5} color="var(--color-info)" /></a>
    <a href={shareOnEmailLink(post)} rel="noopener" target="_blank" class="button-icon mt-2 ml-3"
      ><Icon path={mdiEmail} size={1.5} color="var(--color-info)" /></a>
  </div>
</div>
