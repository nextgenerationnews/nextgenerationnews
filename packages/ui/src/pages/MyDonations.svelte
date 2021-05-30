<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { getNotificationsContext } from 'svelte-notifications';
  import { defaultNotification } from 'utils/default-notification';
  import ContentHeader from 'components/ContentHeader.svelte';
  import { dexNewsService } from 'services/DexNews.service';
  import { web3ProviderService } from 'services/web3-provider.service';
  import { loggingService } from 'services/Logging.service';
  import Spinner from 'components/Spinner.svelte';
  import PageWithWallet from 'components/PageWithWallet.svelte';

  const { addNotification } = getNotificationsContext();
  const { authorBalance$, contractOwner$, contractOwnerBalance$ } = dexNewsService;
  const { account$ } = web3ProviderService;

  function successNotification() {
    addNotification(
      defaultNotification($_('page.read_news.withdraw_successfull'), {
        type: 'success',
      }),
    );
  }

  function failureNotification() {
    addNotification(
      defaultNotification($_('page.read_news.withdraw_failed'), {
        type: 'danger',
      }),
    );
  }

  $: isWithdrawingForOwner = false;
  function withdrawForOwner() {
    isWithdrawingForOwner = true;
    dexNewsService
      .withdrawForOwner()
      .then(successNotification)
      .catch(e => {
        failureNotification();
        loggingService.logException(e);
      })
      .finally(() => {
        isWithdrawingForOwner = false;
      });
  }

  $: isWithdrawingForAuthor = false;
  function withdrawForAuthor() {
    isWithdrawingForAuthor = true;
    dexNewsService
      .withdrawForAuthor()
      .then(successNotification)
      .catch(e => {
        failureNotification();
        loggingService.logException(e);
      })
      .finally(() => {
        isWithdrawingForAuthor = false;
      });
  }
</script>

<svelte:head>
  <title>{$_('page.my_donations.title')} - DexNews</title>
</svelte:head>

<ContentHeader title={$_('page.my_donations.title')} />

<PageWithWallet noWalletMessage={$_('page.my_donations.please_connect_your_wallet')}>
  <div class="block sm:flex flex-wrap page-content">
    <div class="mb-4">
      <p class="text-lg color-gray-dark">
        {$_('page.my_donations.your_donations')}
      </p>
      <p class="text-5xl color-black mt-2 font-bold">${($authorBalance$?.toUnsafeFloat() || 0).toFixed(2)}</p>
    </div>
    <div class="w-full sm:w-auto mt-6 sm:mt-0 flex-grow flex justify-end mb-4">
      <button
        disabled={($authorBalance$?.toUnsafeFloat() || 0) <= 0.1 || isWithdrawingForAuthor}
        class="button w-full sm:w-auto"
        on:click={withdrawForAuthor}
        >{#if isWithdrawingForAuthor}
          <Spinner />
          {$_('page.my_donations.withdrawing')}
        {:else}
          {$_('page.my_donations.withdraw')}
        {/if}</button>
    </div>
  </div>

  {#if $account$ === $contractOwner$}
    <ContentHeader class="mt-24" title={$_('page.my_donations.contract_owner_gains')} />
    <div class="block sm:flex flex-wrap px-4">
      <div class="mb-4">
        <p class="text-lg color-gray-dark">
          {$_('page.my_donations.your_donations')}
        </p>
        <p class="text-5xl color-black mt-2 font-bold">${($contractOwnerBalance$?.toUnsafeFloat() || 0).toFixed(2)}</p>
      </div>
      <div class="w-full sm:w-auto mt-6 sm:mt-0 flex-grow flex justify-end mb-4">
        <button
          disabled={($contractOwnerBalance$ || 0) <= 0.1 || isWithdrawingForOwner}
          class="button w-full sm:w-auto"
          on:click={withdrawForOwner}>
          {#if isWithdrawingForOwner}
            <Spinner />
            {$_('page.my_donations.withdrawing')}
          {:else}
            {$_('page.my_donations.withdraw')}
          {/if}
        </button>
      </div>
    </div>
  {/if}
</PageWithWallet>
