<script lang="ts">
  import ContentHeader from 'components/ContentHeader.svelte';
  import { _, date, time } from 'svelte-i18n';
  import { getNotificationsContext } from 'svelte-notifications';
  import { mdiBookmarkRemove, mdiBookmarkPlus } from '@mdi/js';
  import { readingListService } from 'services/reading-list.service';
  import Editor from 'components/Editor.svelte';
  import Icon from 'components/Icon.svelte';
  import { defaultNotification } from 'utils/default-notification';
  import PostBannerImage from 'components/PostBannerImage.svelte';
  import AboutAuthor from './AboutAuthor.svelte';
  import AuthorDonatingPanel from './AuthorDonationPanel.svelte';
  import UserProfilePicture from 'components/UserProfilePicture.svelte';
  import SharePage from './SharePage.svelte';
  import Flag from 'components/Flag.svelte';
  import Spinner from 'components/Spinner.svelte';
  import { COUNTRIES } from 'utils/CountryList';
  import PostCategoryTag from 'components/PostCategoryTag.svelte';
  import CommunitySection from 'pages/ReadNews/CommunitySection.svelte';
  import { link } from 'svelte-routing';
  import type { PostWithAuthor } from 'models/PostWithAuthor.model';
  import PostVerificationStatus from 'components/PostVerificationStatus.svelte';

  export let postWithAuthor: PostWithAuthor | undefined;
  export let isLoading: boolean | undefined = false;
  export let showCommunity = false;

  const { addNotification } = getNotificationsContext();

  $: slug = postWithAuthor?.post?.slug;
  $: isArticleInReadingList = readingListService.isArticleSaved$(slug || '');

  function addToMyReadingList() {
    if (postWithAuthor) {
      readingListService.pushArticle(postWithAuthor);
      addNotification(
        defaultNotification($_('page.publish_news.added_to_your_read_list'), {
          type: 'success',
        }),
      );
    }
  }

  function removeFromMyReadingList() {
    if (postWithAuthor) {
      readingListService.popArticle(slug);
      addNotification(
        defaultNotification($_('page.publish_news.removed_from_your_read_list'), {
          type: 'warning',
        }),
      );
    }
  }
</script>

<style lang="scss">
  .tag {
    background-color: var(--color-gray);
  }

  .author {
    color: var(--color-info);
  }

  .author {
    display: inline-block;
    width: 32ch;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .subtitle {
    margin-bottom: 2rem;
  }

  .divider {
    margin-top: 3.5rem;
    background-color: var(--color-gray);
    height: 1px;
    width: 100%;
  }
</style>

{#if postWithAuthor && !isLoading}
  <ContentHeader large={true} title={postWithAuthor.post.title} />
  <h3 class="subtitle mx-3 text-2xl">{postWithAuthor.post.subtitle}</h3>
{:else}
  <ContentHeader title={$_('page.read_news.loading')}>
    <div class="my-auto mr-4" slot="icon"><Spinner size={2} color="var(--color-black)" /></div>
  </ContentHeader>
{/if}

<svelte:head>
  {#if postWithAuthor}
    <title>{postWithAuthor.post.title} - DexNews</title>
  {/if}
</svelte:head>

<div class="page-content">
  {#if postWithAuthor}
    <div class="block sm:flex flex-wrap">
      <div class="mt-6 mb-4 sm:mt-2 sm:flex-grow">
        <div class="flex">
          <UserProfilePicture
            class="mr-3"
            size={2}
            userProfilePictureUrl={postWithAuthor.authorProfile?.imageUrl}
            href="/profile/{postWithAuthor.post.author}" />
          <div>
            <h3 class="leading-none">
              <a use:link href="/profile/{postWithAuthor.post.author}">
                <span class="author font-bold">
                  <span class="color-black"
                    >{$_('page.read_news.by', {
                      default: 'By',
                    })}{' '}</span>
                  {#if postWithAuthor.authorProfile}
                    {postWithAuthor.authorProfile?.name}
                  {/if}
                  {' - '}
                  {postWithAuthor.post.author}
                </span>
              </a>
            </h3>
            <h4>
              {$_('page.read_news.posted_on', {
                values: {
                  date: $date(new Date(postWithAuthor.post.timeStamp.toNumber() * 1000), { format: 'full' }),
                  time: $time(new Date(postWithAuthor.post.timeStamp.toNumber() * 1000), { format: 'medium' }),
                },
              })}
            </h4>
          </div>
        </div>
      </div>
      {#if $isArticleInReadingList}
        <button
          class="button mb-auto mt-5 sm:mt-0 md:ml-auto w-full sm:w-min whitespace-nowrap"
          on:click={removeFromMyReadingList}>
          <Icon path={mdiBookmarkRemove} class="mr-2" size={0.8} />
          {$_('page.read_news.remove_from_reading_list')}
        </button>
      {:else}
        <button
          class="button mb-auto mt-5 sm:mt-0 ml-auto md:ml-0  w-full sm:w-min whitespace-nowrap"
          on:click={addToMyReadingList}>
          <Icon path={mdiBookmarkPlus} class="mr-2" size={0.8} />
          {$_('page.read_news.add_to_reading_list')}
        </button>
      {/if}
    </div>

    <div class="flex flex-wrap mt-10 md:mt-3 mb-6">
      <div class="mr-2">
        <PostCategoryTag category={postWithAuthor.post.category} />
        <div class="my-auto mb-1 ml-2 px-2 py-3 inline-flex rounded-lg tag">
          <Flag countryCode={postWithAuthor.post.country} />
          <div class="ml-2">
            {$_(`country_name.${COUNTRIES.find(r => r.code === postWithAuthor.post.country)?.name}`, {
              default: postWithAuthor.post.country,
            })}
          </div>
        </div>
      </div>
      <div class="hidden md:block flex-grow" />
      <SharePage class="mt-3 md:mt-0" post={postWithAuthor.post} />
    </div>

    <PostBannerImage bannerImage={postWithAuthor.post.bannerUrl} class="mt-8 md:mt-2" />

    {#if !postWithAuthor.post.listed}
      <PostVerificationStatus postSlug={slug} />
    {/if}

    <Editor config={{ readOnly: true, data: JSON.parse(postWithAuthor.post.content) }} />

    {#if !postWithAuthor.post.listed}
      <PostVerificationStatus postSlug={slug} />
    {/if}

    <div class="divider" />
    <AboutAuthor class="my-6" authorProfile={postWithAuthor.authorProfile} authorAddress={postWithAuthor.post.author} />

    <div class="divider" />
    <AuthorDonatingPanel class="my-6" postSlug={slug || ''} />
    <div class="divider" />

    {#if showCommunity}
      <CommunitySection roomPrefix={slug} class="my-6" />
    {/if}
  {/if}
</div>
