<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { getNotificationsContext } from 'svelte-notifications';
  import ContentHeader from 'components/ContentHeader.svelte';
  import { web3ProviderService } from 'services/web3-provider.service';
  import { defaultNotification } from 'utils/default-notification';
  import { dexNewsService } from 'services/DexNews.service';
  import { onDestroy, onMount } from 'svelte';
  import EditProfileForm from './EditProfileForm.svelte';
  import { UserProfileUtils } from 'models/UserProfile.model';
  import type { Subscription } from 'rxjs';
  import type { MyProfileFormResult } from './MyProfileFormResult';
  import PageWithWallet from 'components/PageWithWallet.svelte';

  const { addNotification } = getNotificationsContext();
  let profile = UserProfileUtils.make({ exists: false, imageUrl: '', name: '', profileDescription: '' });

  $: isLoadingProfile = true;
  let setupSubscription: Subscription;
  onMount(() => {
    isLoadingProfile = true;
    setupSubscription = web3ProviderService.account$.subscribe(() => {
      dexNewsService.getUserProfile().then(result => {
        if (result) {
          profile = result;
        }
        isLoadingProfile = false;
      });
    });
  });

  onDestroy(() => {
    setupSubscription.unsubscribe();
  });

  function onSubmit(result: MyProfileFormResult) {
    return dexNewsService
      .setUserProfile({
        name: result.name,
        profileDescription: result.description,
        imageUrl: result.profilePictureUrl || '',
        bannerUrl: result.profileBannerUrl || '',
      })
      .then(() => {
        addNotification(
          defaultNotification($_('page.my_profile.saved_profile_successfully'), {
            type: 'success',
          }),
        );
      })
      .catch(() => {
        addNotification(
          defaultNotification($_('page.my_profile.failed_to_save_profile'), {
            type: 'danger',
          }),
        );
      });
  }
</script>

<svelte:head>
  <title>{$_('page.my_profile.title')} - DexNews</title>
</svelte:head>

<ContentHeader title={$_('page.my_profile.title')} />

<PageWithWallet noWalletMessage={$_('page.my_profile.please_connect_your_wallet')}>
  {#if isLoadingProfile}
    <div>Loading</div>
  {:else}
    <EditProfileForm
      initialName={profile?.name}
      initialProfileBannerUrl={profile?.bannerUrl}
      initialProfilePictureUrl={profile?.imageUrl}
      {onSubmit}
      initialDescription={profile?.profileDescription} />
  {/if}
</PageWithWallet>
