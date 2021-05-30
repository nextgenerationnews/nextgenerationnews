<script lang="ts">
  import type { Post } from 'models/Post.model';
  import Icon from 'components/Icon.svelte';
  import { mdiShare, mdiFacebook, mdiTwitter, mdiLinkedin } from '@mdi/js';
  import { getModalManager } from 'utils/modals/ModalManager';
  import ShareModal from './ShareModal.svelte';
  import { _ } from 'svelte-i18n';
  import { shareOnTwitterLink, shareOnFacebookLink, shareOnLinkedInLink } from 'utils/Share';

  export let post: Post;
  let className: string | undefined = '';
  export { className as class };

  const modalManager = getModalManager();

  function onShare() {
    if ('share' in navigator) {
      navigator.share({
        text: post.subtitle,
        title: post.title,
        url: window.location.toString(),
      });
    } else {
      modalManager.open(ShareModal, { post });
    }
  }
</script>

<div class="{className} flex flex-wrap justify-end">
  <button class="button-outline small" on:click={onShare}
    >{$_('page.read_news.share_this')}<Icon
      path={mdiShare}
      size={0.7}
      class="ml-2"
      color="var(--color-info)" /></button>

  <a href={shareOnFacebookLink(post)} rel="noopener" target="_blank" class="button-icon ml-3"
    ><Icon path={mdiFacebook} size={1.5} color="var(--color-info)" /></a>
  <a href={shareOnTwitterLink(post)} rel="noopener" target="_blank" class="button-icon ml-3"
    ><Icon path={mdiTwitter} size={1.5} color="var(--color-info)" /></a>
  <a href={shareOnLinkedInLink(post)} rel="noopener" target="_blank" class="button-icon ml-3"
    ><Icon path={mdiLinkedin} size={1.5} color="var(--color-info)" /></a>
</div>
