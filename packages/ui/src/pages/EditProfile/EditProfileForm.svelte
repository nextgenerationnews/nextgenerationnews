<script lang="ts">
  import { form as createForm, bindClass } from 'svelte-forms';
  import { _ } from 'svelte-i18n';
  import Icon from 'components/Icon.svelte';
  import RemainingCharactersLabel from 'components/RemainingCharactersLabel.svelte';
  import { mdiPencil, mdiAccountOutline } from '@mdi/js';
  import type { MyProfileFormResult } from './MyProfileFormResult';
  import { bindMax } from 'utils/forms/bindMax';
  import { imageUploadChange } from 'utils/forms/imageUploadChange';
  import Spinner from 'components/Spinner.svelte';
  import { getModalManager } from 'utils/modals/ModalManager';
  import EditProfilePictureModal from './EditProfilePictureModal.svelte';

  export let initialName = '';
  export let initialDescription = '';
  export let initialProfilePictureUrl = '';
  export let initialProfileBannerUrl = '';
  export let onSubmit: (formResult: MyProfileFormResult) => Promise<void> = () => Promise.resolve();

  let fName = initialName;
  let fDescription = initialDescription;
  let fProfilePictureUrl = initialProfilePictureUrl;
  let fProfileBannerUrl = initialProfileBannerUrl;

  const profileForm = createForm(
    () => ({
      name: { value: fName, validators: ['max:32'] },
      description: { value: fDescription, validators: ['max:255'] },
      profilePictureUrl: { value: fProfilePictureUrl, validators: ['max:255'] },
      profileBannerUrl: { value: fProfileBannerUrl, validators: ['max:255'] },
    }),
    {
      initCheck: false,
    },
  );

  $: isSubmitting = false;
  function wrappedSubmit() {
    isSubmitting = true;
    onSubmit({
      name: fName,
      description: fDescription,
      profilePictureUrl: fProfilePictureUrl,
      profileBannerUrl: fProfileBannerUrl,
    }).finally(() => {
      isSubmitting = false;
    });
  }

  const { isLoading: isProfilePictureLoading, onChangeFn: onProfilePictureChange } = imageUploadChange(addr => {
    fProfilePictureUrl = addr;
  });

  const { isLoading: isBannerPictureLoading, onChangeFn: onProfileBannerChange } = imageUploadChange(addr => {
    fProfileBannerUrl = addr;
  });

  function backgroundImg(addr?: string): string {
    if (!addr) {
      return '--background-img-url: white';
    }

    return `--background-img-url: url(${addr})`;
  }

  const modalManager = getModalManager();

  function showProfilePictureSwitchPictureModal() {
    modalManager.open(EditProfilePictureModal, {
      fieldName: 'profile_picture',
      removeFn: () => {
        fProfilePictureUrl = '';
      },
    });
  }

  function showProfileBannerSwitchPictureModal() {
    modalManager.open(EditProfilePictureModal, {
      fieldName: 'banner_picture',
      removeFn: () => {
        fProfileBannerUrl = '';
      },
    });
  }
</script>

<style lang="scss">
  .profile-picture {
    background: var(--background-img-url);
    background-size: cover;
    overflow: hidden;
  }

  .pencil-edit-icon-container {
    margin-top: 50%;
  }

  .image-field {
    &,
    label,
    div {
      cursor: pointer;
    }

    label {
      transition: transform 0.1s linear;
    }

    &:hover {
      label {
        transform: scale(1.15);
      }
    }

    &.banner-image {
      label {
        transform-origin: top right;
      }
    }
  }

  .pencil-edit-icon {
    filter: drop-shadow(0px 0px 4px white);
  }
</style>

<form on:submit|preventDefault={wrappedSubmit}>
  <div
    style={backgroundImg(fProfileBannerUrl)}
    class="h-40 px-2 py-4 mb-6 rounded flex justify-end shadow-lg image-field banner-image {fProfileBannerUrl
      ? 'profile-picture'
      : 'gradient-background-light'}">
    {#if $isBannerPictureLoading}
      <div class="pencil-edit-icon mr-4">
        <Spinner size={2} color={'var(--color-black)'} />
      </div>
    {:else if fProfileBannerUrl}
      <button type="button" class="w-full h-full flex pencil-edit-icon" on:click={showProfileBannerSwitchPictureModal}>
        <Icon path={mdiPencil} color="var(--color-black)" class="ml-auto mr-4 mt-2" size={1.5} />
      </button>
    {:else}
      <label for="banner_picture" class="text-center w-full h-full flex pencil-edit-icon">
        <Icon path={mdiPencil} color="var(--color-black)" class="ml-auto mr-4 mt-2" size={1.5} />
      </label>
    {/if}
    <input
      id="banner_picture"
      name="banner_picture"
      type="file"
      hidden
      accept="image/gif, image/jpeg, image/jpg, image/png"
      on:change={onProfileBannerChange} />
  </div>
  <div class="flex justify-center -my-20 mb-10">
    <div
      style={backgroundImg(fProfilePictureUrl)}
      class="shadow-lg rounded-full h-40 w-40 flex image-field {fProfilePictureUrl
        ? 'profile-picture'
        : 'gradient-background-light'}">
      {#if $isProfilePictureLoading}
        <div class="pencil-edit-icon m-auto">
          <Spinner size={2} color={'var(--color-black)'} />
        </div>
      {:else if fProfilePictureUrl}
        <button
          type="button"
          class="w-full h-full flex pencil-edit-icon"
          on:click={showProfilePictureSwitchPictureModal}>
          <Icon path={mdiPencil} color="var(--color-black)" class="m-auto" size={1.5} />
        </button>
      {:else}
        <label for="profile_picture" class="w-full h-full flex pencil-edit-icon">
          <Icon path={mdiAccountOutline} size="6rem" color="var(--color-gray-dark)" class="m-auto opacity-30" top="0" />
          <div class="flex absolute pencil-edit-icon-container w-full justify-center">
            <Icon path={mdiPencil} color="var(--color-black)" class="absolute" size={1.5} />
          </div>
        </label>
      {/if}
      <input
        id="profile_picture"
        name="profile_picture"
        type="file"
        hidden
        accept="image/gif, image/jpeg, image/jpg, image/png"
        on:change={onProfilePictureChange} />
    </div>
  </div>
  <fieldset title="name">
    <label name="name" for="name" use:bindClass={{ form: profileForm }}>{$_('page.my_profile.fields.name')}</label>
    <RemainingCharactersLabel form={profileForm} name="name" />
    <input
      id="name"
      name="name"
      type="text"
      disabled={isSubmitting}
      class="text-input input rounded-lg p-4 w-full shadow-lg"
      bind:value={fName}
      use:bindMax={{ form: profileForm }}
      use:bindClass={{ form: profileForm }} />
  </fieldset>
  <fieldset title="description">
    <label name="description" for="description" use:bindClass={{ form: profileForm }}
      >{$_('page.my_profile.fields.description')}</label>
    <RemainingCharactersLabel form={profileForm} name="description" />
    <textarea
      id="description"
      name="description"
      type="text"
      disabled={isSubmitting}
      class="text-input input rounded-lg p-4 w-full shadow-lg"
      rows={4}
      bind:value={fDescription}
      use:bindMax={{ form: profileForm }}
      use:bindClass={{ form: profileForm }} />
  </fieldset>
  <div class="flex justify-end">
    <button class="flex-grow sm:flex-grow-0 my-6 button shadow-lg" disabled={!$profileForm.valid}>
      {#if isSubmitting}
        <Spinner />
      {/if}
      {isSubmitting ? $_('page.my_profile.saving') : $_('page.my_profile.save')}</button>
  </div>
</form>
