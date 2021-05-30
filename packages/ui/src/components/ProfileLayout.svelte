<script lang="ts">
  import Sidebar from './Sidebar.svelte';
  import Footer from './Footer.svelte';
  import ConnectedNewsSummaryBar from './ConnectedNewsSummaryBar.svelte';
  import { dexNewsService } from 'services/DexNews.service';
  import UserProfilePicture from 'components/UserProfilePicture.svelte';
  import UserProfileBanner from 'components/UserProfileBanner.svelte';
  import { ProfilePartial } from 'pages/Profile/ProfilePartials.enum';
  import { parseUrlStringParam, parsePage } from 'utils/Routing';
  import { Link } from 'svelte-routing';
  import type { RouteParams } from 'svelte-routing/types/Route';

  export let params: RouteParams;

  $: partial = parseUrlStringParam(params, 'partial', ProfilePartial.ARTICLES, Object.values(ProfilePartial));
  $: walletAddress = parseUrlStringParam(params, 'wallet_address');
  $: page = parsePage(params);
  $: profile$ = dexNewsService.authorProfile$(walletAddress);
</script>

<style lang="scss">
  .content-container {
    height: 100%;
    width: 100%;
  }
  .app-content {
    min-height: 80vh;
  }
</style>

<svelte:head>
  <title>DexNews</title>
</svelte:head>

<div class="content-container flex">
  <Sidebar class="sidebar" />
  <div class="flex-grow flex flex-col overflow-hidden">
    <div class="hidden sm:block">
      <ConnectedNewsSummaryBar />
    </div>
    <div class="flex-grow overflow-y-scroll animate__animated animate__fadeIn animate__faster">
      <div class="container small app-content mx-auto px-0 md:px-4 py-6 md:px-10 md:py-8">
        <div class="page-content">
          {#if $profile$}
            <UserProfileBanner profileBannerUrl={$profile$.bannerUrl} />
            <div class="w-full md:pl-10 -mt-20">
              <div class="w-full flex flex-wrap justify-center md:justify-start">
                <UserProfilePicture class="shadow-md" size={10} userProfilePictureUrl={$profile$.imageUrl} />
                <div class="max-w-full mx-10 px-10 py-6 mt-6 md:my-auto rounded-lg shadow-lg bg-gray flex-grow">
                  <h1 class="text-2xl overflow-hidden whitespace-nowrap font-bold color-black text-center md:text-left">
                    {$profile$.name}
                  </h1>
                  <h2 class="text-lg overflow-hidden whitespace-nowrap color-black overflow-ellipsis">
                    ({walletAddress})
                  </h2>
                </div>
              </div>
            </div>
          {/if}
          {#key partial}
            <div class="w-full tab-container shadow-lg">
              <Link
                to="/profile/{walletAddress}/{ProfilePartial.ARTICLES}"
                class="tab {partial === ProfilePartial.ARTICLES ? 'active' : ''}">Articles</Link>
              <Link
                to="/profile/{walletAddress}/{ProfilePartial.ABOUT}"
                class="tab {partial === ProfilePartial.ABOUT ? 'active' : ''}">About</Link>
              <Link
                to="/profile/{walletAddress}/{ProfilePartial.COMMENTS}"
                class="tab {partial === ProfilePartial.COMMENTS ? 'active' : ''}">Comments</Link>
              <Link
                to="/profile/{walletAddress}/{ProfilePartial.CHAT}"
                class="tab {partial === ProfilePartial.CHAT ? 'active' : ''}">Chat</Link>
            </div>
          {/key}
        </div>
        {#key partial}
          <div class="animate__animated animate__fadeIn animate__faster">
            <slot {walletAddress} profile={$profile$} {page} {partial} />
          </div>
        {/key}
      </div>
      <Footer />
    </div>
  </div>
</div>
