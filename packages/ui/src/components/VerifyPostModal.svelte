<script lang="ts">
  import { dexNewsService } from 'services/DexNews.service';
  import { web3ProviderService } from 'services/web3-provider.service';
  import LoadingIndicator from 'components/LoadingIndicator.svelte';
  import { _ } from 'svelte-i18n';
  import { loggingService } from 'services/Logging.service';
  import { getNotificationsContext } from 'svelte-notifications';
  import { defaultNotification } from 'utils/default-notification';
  import { form as createForm, bindClass } from 'svelte-forms';
  import { getModalManager } from 'utils/modals/ModalManager';
  import { tap } from 'rxjs/operators';

  export let postSlug: string;

  const NotificationsContext = getNotificationsContext();
  const ModalManager = getModalManager();
  const { account$ } = web3ProviderService;

  $: isLoading = true;
  const postValidation$ = dexNewsService.isValidatingPost$(postSlug).pipe(
    tap(() => {
      isLoading = false;
    }),
  );

  let fComment = '';
  let fScore = 0;

  const submitValidationForm = createForm(() => ({
    comment: { value: fComment, validators: ['min:16', 'max:2048'] },
    score: { value: fScore, validators: ['between:0:10'] },
  }));

  async function startValidation() {
    try {
      await dexNewsService.startPostValidation(postSlug);
      NotificationsContext.addNotification(
        defaultNotification($_('page.read_news.validation_started'), { type: 'success' }),
      );
      ModalManager.close();
    } catch (e) {
      loggingService.logException(e);
      NotificationsContext.addNotification(
        defaultNotification($_('page.read_news.failed_to_start_validation'), { type: 'danger' }),
      );
    }
  }

  async function submitValidation() {
    try {
      await dexNewsService.finishPostValidation(postSlug, fScore, fComment);
      NotificationsContext.addNotification(
        defaultNotification($_('page.read_news.validation_started'), { type: 'success' }),
      );
      ModalManager.close();
    } catch (e) {
      loggingService.logException(e);
      NotificationsContext.addNotification(
        defaultNotification($_('page.read_news.failed_to_start_validation'), { type: 'danger' }),
      );
    }
  }
</script>

<div>
  <h1>{$_('page.read_news.article_verification')}</h1>
  {#if $account$}
    {#if isLoading}
      <LoadingIndicator message={$_('page.read_news.loading')} />
    {:else if $postValidation$.isValidating}
      <form on:submit|preventDefault={submitValidation}>
        <textarea
          bind:value={fComment}
          name="comment"
          id="comment"
          rows="2"
          use:bindClass={{ form: submitValidationForm }} />
        <span>{fScore}</span>
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          bind:value={fScore}
          name="score"
          id="score"
          use:bindClass={{ form: submitValidationForm }} />
        <button type="submit">{$_('page.read_news.submit_verification')}</button>
      </form>
    {:else}
      <button on:click={startValidation}>{$_('page.read_news.start_verification')}</button>
    {/if}
  {:else}
    <span>You need to connect your wallet to verify articles</span>
  {/if}
</div>
