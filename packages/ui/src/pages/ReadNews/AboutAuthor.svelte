<script lang="ts">
  import { _ } from 'svelte-i18n';
  import type { UserProfile } from 'models/UserProfile.model';
  import UserProfilePicture from 'components/UserProfilePicture.svelte';
  import Link from 'components/Link.svelte';
  let className: string | undefined = '';
  export let authorProfile: UserProfile | undefined | null;
  export let authorAddress = '';
  export { className as class };
</script>

<div class={className}>
  <div class="flex mb-6">
    <div class="flex">
      <div>
        <h5 class="color-black font-bold text-2xl">
          {$_('page.read_news.about_the_author')}
        </h5>
      </div>
    </div>
  </div>

  <div class="flex flex-wrap md:flex-nowrap">
    <div class="mr-0 mt-8 mb-4 md:mr-4 md:mt-3 w-full md:w-auto flex justify-center">
      <UserProfilePicture class="md:hidden shadow-lg" size={8} userProfilePictureUrl={authorProfile?.imageUrl} />
      <UserProfilePicture class="hidden md:flex" userProfilePictureUrl={authorProfile?.imageUrl} />
    </div>
    <div class="flex-grow min-w-min">
      <h5 class="text-2xl mx-2 mt-4 mb-2">
        {#if authorProfile?.name}
          {authorProfile.name}
        {:else}
          {$_('page.read_news.annonymous_author')}
        {/if}
      </h5>
      {#if authorProfile && authorProfile.profileDescription}
        <h5 class="text-md mx-2">{authorProfile.profileDescription}</h5>
      {:else if !authorProfile}
        <h5 class="text-md mx-2">{$_('page.read_news.no_author_details')}</h5>
      {/if}
      <div class="ml-2 mt-8 text-center md:text-left">
        <Link href="/profile/{authorAddress}">{$_('page.read_news.check_out_author')}</Link>
      </div>
    </div>
  </div>
</div>
