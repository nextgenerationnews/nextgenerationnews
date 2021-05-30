<script lang="ts">
  import { getModalManager } from 'utils/modals/ModalManager';
  import { _ } from 'svelte-i18n';

  export let fieldName: string;
  export let removeFn: () => void;

  const modalManager = getModalManager();

  function onClickRemovePicture() {
    removeFn();
    modalManager.close();
  }

  function onClickEditProfile() {
    modalManager.close();
  }
</script>

<div class="w-full">
  <button on:click={onClickRemovePicture} class="button-menu color-black text-lg"
    >{$_('page.my_profile.remove_picture')}</button>
  <label for={fieldName} on:click={onClickEditProfile} class="color-black button-menu text-lg"
    >{$_('page.my_profile.change_picture')}</label>
</div>
