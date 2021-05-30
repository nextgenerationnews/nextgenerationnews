<script lang="ts">
  import { getModalManager } from 'utils/modals/ModalManager';
  import { _ } from 'svelte-i18n';
  import { navigate } from 'svelte-routing';

  export let onDisconnect: () => void;

  const modalManager = getModalManager();

  function onClickDisconnect() {
    onDisconnect();
    modalManager.close();
  }

  function onClickEditProfile() {
    navigate('/edit-profile');
    modalManager.close();
  }
</script>

<div class="w-full">
  <button on:click={onClickDisconnect} class="button-menu">{$_('navbar.disconnect_wallet')}</button>
  <button on:click={onClickEditProfile} class="button-menu">{$_('navbar.edit_profile')}</button>
</div>
