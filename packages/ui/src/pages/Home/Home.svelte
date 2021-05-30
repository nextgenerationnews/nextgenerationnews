<script lang="ts">
  import HeaderBackground from 'pages/Home/HeaderBackground.svelte';
  import { _ } from 'svelte-i18n';
  import Icon from 'components/Icon.svelte';
  import { mdiAccountGroupOutline, mdiEyeOff, mdiImageBroken, mdiHeart, mdiPost, mdiLan } from '@mdi/js';
  import HomeVideoUrl from 'assets/home_video.mp4';
  import DomIcoPurchase from 'pages/Home/DomIcoPurchase.svelte';
  import HomeNews from 'pages/Home/HomeNews.svelte';
  import LitepaperUrl from 'assets/dexnews_litepaper.pdf';

  const bulletPoints = [
    {
      title: 'Decentralized by Nature',
      description: "Data is stored in the blockchain, it's viewable and auditable by anyone",
      icon: mdiLan,
    },
    {
      title: 'Anti-Censorship',
      description: 'Posts are not erasable or editable, once created they are stored forever!',
      icon: mdiEyeOff,
    },
    {
      title: 'Fake News Resistant',
      description:
        'Non verified posts are not shown in search or public lists and posts with low score get warnings embeded into them',
      icon: mdiImageBroken,
    },
    {
      title: 'Supporting the great writters and journalists',
      description:
        'The platform incentivizes content creators with a donation section under their posts as well as rewards for posting/reviewing posts',
      icon: mdiHeart,
    },
    {
      title: 'Community Driven',
      description:
        'DexNews allows everyone to leave comments under profiles or posts for free! There are even chat rooms for posts and profiles!',
      icon: mdiAccountGroupOutline,
    },
    {
      title: 'No Ads and the best reading experience',
      description:
        "We aim to create a platform where creators don't have to rely on ads and users can read news with the best reading UX out there!",
      icon: mdiPost,
    },
  ] as { title: string; description: string; icon: string }[];
</script>

<style>
  @media (min-width: 768px) {
    .globe {
      transform: scale(0.7) !important;
    }
  }

  .globe {
    transform-origin: top;
    transform: scale(1.5);
    opacity: 0.8;
  }

  .globe-container {
    mix-blend-mode: darken;
    pointer-events: none;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  .slogan {
    text-shadow: 0 0 3em white, 0 0 10px white;
  }

  .white-gradient {
    margin-top: -6rem;
    height: 6rem;
    width: 100%;
    background: linear-gradient(0deg, white, transparent);
  }

  .layer-effect {
    width: 100%;
    height: 15rem;
    margin-top: -10rem;
  }

  .layer-effect.inverted {
    margin-bottom: -10rem;
    margin-top: 0;
  }
</style>

<svelte:head>
  <title>{$_('page.home.title')} - DexNews</title>
</svelte:head>

<div>
  <div class="overflow-hidden">
    <HeaderBackground class="">
      <div class="globe-container overflow-hidden">
        <video
          class="globe animate__animated animate__pulse animate__infinite animate__slower"
          width="100%"
          height="300px"
          autoplay
          muted
          loop>
          <source src={HomeVideoUrl} type="video/mp4" />
        </video>
      </div>
      <div class="pt-60 pb-10">
        <h1 class="color-black font-bold text-5xl text-center slogan">Are you ready for the information revolution?</h1>
      </div>
    </HeaderBackground>
    <div class="white-gradient" />
    <div class="bg-white py-6 px-4 md:px-10 color-black">
      <span class="font-bold">DexNews</span> is a brand new platform for reading and publishing global news or articles.
      All articles are stored in the blockchain, in a never erasable state, a platform for annonymous journalism and anti-censorship
    </div>
    <div class="p-4 py-6 px-4 md:px-10 w-full flex justify-center">
      <a class="button-outline" target="_blank" rel="noreferrer noopener" href={LitepaperUrl}>Read our litepaper</a>
    </div>
    <div class="mt-12 h-2" />
    <svg
      class="layer-effect inverted"
      preserveAspectRatio="none"
      viewBox="0 0 540 200"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
      ><path
        d="M0 168L108 172L216 177L324 129L432 140L540 182L540 0L432 0L324 0L216 0L108 0L0 0Z"
        fill="#707070" /><path
        d="M0 134L108 141L216 107L324 148L432 126L540 112L540 0L432 0L324 0L216 0L108 0L0 0Z"
        fill="#888888" /><path
        d="M0 115L108 103L216 122L324 126L432 130L540 81L540 0L432 0L324 0L216 0L108 0L0 0Z"
        fill="#a0a0a0" /><path
        d="M0 75L108 69L216 72L324 84L432 101L540 103L540 0L432 0L324 0L216 0L108 0L0 0Z"
        fill="#bababa" /><path
        d="M0 34L108 41L216 50L324 55L432 56L540 72L540 0L432 0L324 0L216 0L108 0L0 0Z"
        fill="#d4d4d4" /><path
        d="M0 18L108 11L216 25L324 8L432 30L540 44L540 0L432 0L324 0L216 0L108 0L0 0Z"
        fill="#eeeeee" /></svg>
    <div class="gradient-background shadow-md pt-40 pb-40 px-4 md:px-10 color-gray-light">
      <div class="grid grid-cols-12 lg:gap-x-14 gap-y-16 md:gap-y-20 lg:gap-y-28 my-8 md:my-16 lg:my-20">
        {#each bulletPoints as bulletPoint}
          <div class="bullet-point flex justify-center col-span-12 lg:col-span-6">
            <div class="flex">
              <Icon path={bulletPoint.icon} size={2} top={'0'} />
              <div class="ml-6">
                <p class="font-bold">{bulletPoint.title}</p>
                <p>{bulletPoint.description}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
    <svg
      class="layer-effect"
      preserveAspectRatio="none"
      viewBox="0 0 540 960"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
      ><path
        d="M0 149L108 128L216 106L324 336L432 280L540 78L540 961L432 961L324 961L216 961L108 961L0 961Z"
        fill="#707070" /><path
        d="M0 311L108 279L216 439L324 245L432 347L540 414L540 961L432 961L324 961L216 961L108 961L0 961Z"
        fill="#888888" /><path
        d="M0 404L108 461L216 371L324 349L432 330L540 565L540 961L432 961L324 961L216 961L108 961L0 961Z"
        fill="#a0a0a0" /><path
        d="M0 596L108 622L216 607L324 549L432 470L540 460L540 961L432 961L324 961L216 961L108 961L0 961Z"
        fill="#bababa" /><path
        d="M0 791L108 757L216 713L324 691L432 686L540 608L540 961L432 961L324 961L216 961L108 961L0 961Z"
        fill="#d4d4d4" /><path
        d="M0 870L108 903L216 833L324 916L432 808L540 741L540 961L432 961L324 961L216 961L108 961L0 961Z"
        fill="#eeeeee" /></svg>
    <div class="bg-gray p-4 pt-6 pb-16 px-4 md:px-10"><DomIcoPurchase /></div>
    <div class="p-4 pt-6 pb-16 px-4 md:px-10"><HomeNews /></div>
  </div>
</div>
