<script lang="ts">
  import { _ } from 'svelte-i18n';
  import ProfileArticles from './ProfileArticles.svelte';
  import ProfileAbout from './ProfileAbout.svelte';
  import ProfileComments from './ProfileComments.svelte';
  import ProfileChat from './ProfileChat.svelte';
  import { ProfilePartial } from 'pages/Profile/ProfilePartials.enum';
  import type { UserProfile } from 'models/UserProfile.model';

  export let walletAddress = '';
  export let page = 1;
  export let partial: ProfilePartial = ProfilePartial.ARTICLES;
  export let profile: UserProfile | null = null;
</script>

<svelte:head>
  <title>{$_('page.profile.title')} - DexNews</title>
</svelte:head>

<div class="page-content">
  {#if profile}
    <div class="mt-10">
      {#if partial === ProfilePartial.ARTICLES}
        <ProfileArticles {page} {walletAddress} />
      {:else if partial === ProfilePartial.ABOUT}
        <ProfileAbout {profile} address={walletAddress} />
      {:else if partial === ProfilePartial.COMMENTS}
        <ProfileComments {walletAddress} />
      {:else if partial === ProfilePartial.CHAT}
        <ProfileChat {walletAddress} />
      {/if}
    </div>
  {/if}
</div>
