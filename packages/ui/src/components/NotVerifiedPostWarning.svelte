<script lang="ts">
  import Icon from 'components/Icon.svelte';
  import { mdiAlert } from '@mdi/js';
  import { _ } from 'svelte-i18n';
  import { getModalManager } from 'utils/modals/ModalManager';
  import VerifyPostModal from './VerifyPostModal.svelte';

  export let postSlug: string;

  const ModalManager = getModalManager();

  function onVerifyButtonClick() {
    ModalManager.open(VerifyPostModal, { postSlug });
  }
</script>

<div class="bg-red-500 rounded-xl p-6 mt-6 text-white">
  <span class="block text-2xl mb-3">
    <Icon path={mdiAlert} size={1.2} />
    {$_('page.read_news.warning')}
  </span>
  <span class="block">{$_('page.read_news.this_article_has_not_been_verified')}</span>
  <span class="block italic">{$_('page.read_news.possible_fake_news')}</span>
  <button on:click={onVerifyButtonClick} class="mt-6 button-outline white w-full"
    >{$_('page.read_news.earn_dom_verifying_this')}</button>
</div>
