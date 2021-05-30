<script lang="ts">
  import ContentHeader from '../components/ContentHeader.svelte';
  import { _ } from 'svelte-i18n';
  import { getNotificationsContext } from 'svelte-notifications';
  import { form as createForm, bindClass } from 'svelte-forms';
  import { i18nService } from 'services/i18n.service';
  import Editor from 'components/Editor.svelte';
  import debounce from 'lodash.debounce';
  import { navigate } from 'svelte-routing';
  import { dexNewsService } from 'services/DexNews.service';
  import { defaultNotification } from 'utils/default-notification';
  import { subscribeOnMount } from 'utils/subscribe-on-mount';
  import { uploadFileToImgBB } from 'utils/imgbb';
  import PostBannerImage from 'components/PostBannerImage.svelte';
  import { loggingService } from 'services/Logging.service';
  import RemainingCharactersLabel from 'components/RemainingCharactersLabel.svelte';
  import { bindMax } from 'utils/forms/bindMax';
  import PageWithWallet from 'components/PageWithWallet.svelte';
  import Spinner from 'components/Spinner.svelte';
  import LoadingIndicator from 'components/LoadingIndicator.svelte';
  import type EditorJS from '@editorjs/editorjs';
  import type { API, OutputData } from '@editorjs/editorjs';

  let editor: EditorJS;

  function setupEditor(newEditor: EditorJS) {
    editor = newEditor;
  }

  const { addNotification } = getNotificationsContext();
  const { categories$, countries$ } = dexNewsService;

  let fTitle = '';
  let fSubtitle = '';
  let fCategory = '';
  let fCountry = '';
  $: fBannerImage = '';
  let fContent: OutputData = {
    blocks: [
      {
        data: { text: 'Place your news content here...', level: 2 },
        type: 'Header',
      },
      {
        data: { text: '' },
        type: 'paragraph',
      },
      {
        data: { text: 'You can include text and images to make your article more enticing!' },
        type: 'paragraph',
      },
      {
        data: { text: '' },
        type: 'paragraph',
      },
    ],
    time: Date.now(),
  };

  subscribeOnMount(() => {
    return i18nService.currentCountry$.subscribe(country => {
      if (!fCountry) {
        fCountry = country.code;
      }
    });
  });

  const publishForm = createForm(
    () => ({
      title: { value: fTitle, validators: ['required', 'max:80'] },
      bannerImage: { value: fBannerImage, validators: [] },
      subtitle: { value: fSubtitle, validators: ['required', 'max:160'] },
      content: { value: fContent, validators: ['required'] },
      category: { value: fCategory, validators: ['required'] },
      country: { value: fCountry, validators: ['required'] },
    }),
    {
      initCheck: false,
    },
  );

  function setEditorField(content: OutputData) {
    fContent = content;
  }

  const setContent = debounce((api: API) => {
    api.saver.save().then(setEditorField);
  }, 3000);

  $: isSubmitting = false;

  async function onsubmit() {
    isSubmitting = true;
    await editor.save().then(setEditorField);

    dexNewsService
      .postNews({
        content: JSON.stringify(fContent),
        title: fTitle,
        subtitle: fSubtitle,
        category: fCategory,
        country: fCountry,
        bannerUrl: fBannerImage,
      })
      .then(slug => {
        addNotification(
          defaultNotification($_('page.publish_news.published_news_successfully'), {
            type: 'success',
          }),
        );
        navigate(`/read/${slug}`);
      })
      .catch(e => {
        loggingService.logException(e);
        addNotification(
          defaultNotification($_('page.publish_news.failed_to_save_news'), {
            type: 'danger',
          }),
        );
      })
      .finally(() => {
        isSubmitting = false;
      });

    return false;
  }

  $: isUploadingBannerImage = false;
  function onChangeBannerImage(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    const file = event.currentTarget.files?.[0];
    if (file) {
      isUploadingBannerImage = true;
      uploadFileToImgBB(file)
        .then(r => {
          fBannerImage = r.file.url;
        })
        .catch(e => {
          loggingService.logException(e);
          addNotification(
            defaultNotification($_('page.forms.failed_to_upload_image'), {
              type: 'danger',
            }),
          );
        })
        .finally(() => {
          isUploadingBannerImage = false;
        });
    }
  }
</script>

<style>
  select {
    background-color: white;
  }
</style>

<svelte:head>
  <title>{$_('page.publish_news.title')} - DexNews</title>
</svelte:head>

<ContentHeader title={$_('page.publish_news.title')} />

<PageWithWallet noWalletMessage={$_('page.publish_news.please_connect_your_wallet')}>
  <form on:submit|preventDefault={onsubmit}>
    <fieldset name="title">
      <label name="title" for="title" use:bindClass={{ form: publishForm }}
        >{$_('page.publish_news.fields.title')}</label>
      <RemainingCharactersLabel form={publishForm} name="title" />
      <input
        id="title"
        name="title"
        type="text"
        class="text-input input rounded-lg p-4 w-full shadow-lg"
        disabled={isSubmitting}
        bind:value={fTitle}
        use:bindClass={{ form: publishForm }}
        use:bindMax={{ form: publishForm }} />
    </fieldset>
    <fieldset name="subtitle">
      <label name="subtitle" for="subtitle" use:bindClass={{ form: publishForm }}
        >{$_('page.publish_news.fields.subtitle')}</label>
      <RemainingCharactersLabel form={publishForm} name="subtitle" />
      <input
        id="subtitle"
        name="subtitle"
        type="text"
        class="text-input input rounded-lg p-4 w-full shadow-lg"
        disabled={isSubmitting}
        bind:value={fSubtitle}
        use:bindClass={{ form: publishForm }}
        use:bindMax={{ form: publishForm }} />
    </fieldset>
    <div class="sm:flex sm:flex-wrap">
      <fieldset class="sm:mr-5">
        <label class="block" name="category" for="category" use:bindClass={{ form: publishForm }}
          >{$_('page.publish_news.fields.category')}</label>
        <select
          class="text-input input rounded-lg p-4 shadow-lg w-full sm:w-auto"
          name="category"
          id="category"
          disabled={isSubmitting}
          use:bindClass={{ form: publishForm }}
          bind:value={fCategory}>
          {#if $categories$}
            <option value="">{$_('page.publish_news.fields.select_a_category')}</option>
            {#each $categories$ as category}
              <option value={category}>{$_(`category_name.${category}`, { default: category })}</option>
            {/each}
          {/if}
        </select>
      </fieldset>
      <fieldset>
        <label class="block" name="country" for="country" use:bindClass={{ form: publishForm }}
          >{$_('page.publish_news.fields.country')}</label>
        <select
          class="text-input input rounded-lg p-4 shadow-lg w-full sm:w-auto"
          name="country"
          id="country"
          disabled={isSubmitting}
          use:bindClass={{ form: publishForm }}
          bind:value={fCountry}>
          {#if $countries$}
            <option value="">{$_('page.publish_news.fields.select_a_country')}</option>
            {#each $countries$ as country}
              <option value={country.code}>{$_(`country_name.${country.name}`, { default: country.name })}</option>
            {/each}
          {/if}
        </select>
      </fieldset>
    </div>
    <fieldset name="bannerImage">
      <label for="bannerImage">{$_('page.publish_news.fields.banner_image')}</label>
      <input
        type="file"
        name="bannerImage"
        accept="image/gif, image/jpeg, image/jpg, image/png"
        on:change={onChangeBannerImage} />
      {#if fBannerImage}
        <PostBannerImage category={fCategory} bannerImage={fBannerImage} />
      {/if}
      {#if isUploadingBannerImage}
        <LoadingIndicator message={$_('page.publish_news.uploading_banner')} />
      {/if}
    </fieldset>
    <fieldset name="content">
      <label for="content">{$_('page.publish_news.fields.content')}</label>
      <Editor config={{ data: fContent, onChange: setContent }} {setupEditor} />
    </fieldset>
    <div class="flex justify-end">
      <button
        class="flex-grow sm:flex-grow-0 my-6 button shadow-lg"
        disabled={!$publishForm.valid || isUploadingBannerImage}
        >{#if isSubmitting}
          <Spinner />
          {$_('page.publish_news.publishing')}
        {:else}
          {$_('page.publish_news.publish')}
        {/if}</button>
    </div>
  </form>
</PageWithWallet>
