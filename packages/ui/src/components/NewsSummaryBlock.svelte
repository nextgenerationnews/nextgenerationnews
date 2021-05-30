<script script lang="ts">
  import type { PostWithAuthor } from 'models/PostWithAuthor.model';
  import UserProfilePicture from 'components/UserProfilePicture.svelte';
  import PostCategoryTag from 'components/PostCategoryTag.svelte';
  import { _ } from 'svelte-i18n';
  import { link } from 'svelte-routing';

  export let linkToStorage: boolean | undefined = false;
  export let post: PostWithAuthor;

  $: authorName = `${$_('page.read_news.by', {
    default: 'By',
  })} ${post?.authorProfile?.name || ''} - ${post.post.author.substring(0, 6)}...`;
</script>

<style>
  .banner {
    background: var(--background);
    background-size: cover;
  }

  .author {
    display: inline-block;
    max-width: 16ch;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>

<div
  class="animate__animated animate__fadeIn animate__faster shadow-md hover:shadow-lg rounded-lg my-4 overflow-hidden">
  <div class="h-28 mb-2 banner" style={`--background: url(${post.post.bannerUrl})`} />
  <div class="overflow-visible flex justify-end pr-5 -mt-14">
    <PostCategoryTag class="my-auto" category={post.post.category} />
    <UserProfilePicture
      class="shadow-md"
      userProfilePictureUrl={post?.authorProfile?.imageUrl}
      href="/profile/{post.post.author}" />
  </div>
  <div class="px-4 pt-3 mb-1">
    <h3 class="text-2xl color-info mb-2">
      <a use:link href={`/${linkToStorage ? 'reading-list' : 'read'}/${post.post.slug}`}>{post.post.title}</a>
    </h3>
    <h5 class="text-md">
      <a use:link href={`/${linkToStorage ? 'reading-list' : 'read'}/${post.post.slug}`}>{post.post.subtitle}</a>
    </h5>
  </div>
  <div class="px-4 mb-4">
    <span class="text-sm author color-gray-dark">{authorName}</span>
  </div>
  <div>
    <slot name="actions" />
  </div>
</div>
