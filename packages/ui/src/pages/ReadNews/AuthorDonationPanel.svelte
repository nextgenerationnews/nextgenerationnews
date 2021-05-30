<script lang="ts">
  import { _, getMessageFormatter } from 'svelte-i18n';
  import { mdiHeart } from '@mdi/js';
  import Icon from 'components/Icon.svelte';
  import { dexNewsService } from 'services/DexNews.service';
  import { defaultNotification } from 'utils/default-notification';
  import { getNotificationsContext } from 'svelte-notifications';
  import { web3ProviderService } from 'services/web3-provider.service';

  export let postSlug: string;
  let className: string | undefined = '';
  export { className as class };

  const { addNotification } = getNotificationsContext();
  const { account$ } = web3ProviderService;

  $: isDonating = false;

  function donate(slug: string, amount: number) {
    isDonating = true;

    if (!$account$) {
      addNotification(
        defaultNotification($_('page.read_news.you_need_to_connect_your_wallet_to_donate'), {
          type: 'danger',
        }),
      );

      isDonating = false;
      return;
    }

    dexNewsService.donateToPost(slug, amount).finally(() => {
      addNotification(
        defaultNotification(getMessageFormatter('page.read_news.donated').format({ amount }).toString(), {
          type: 'success',
        }),
      );
      isDonating = false;
    });
  }
</script>

<style lang="scss">
</style>

<div class={className}>
  <div class="block md:flex">
    <div class="flex">
      <Icon path={mdiHeart} class="text-red-500 my-auto mr-4 pb-10" size={1.5} />
      <div class="flex">
        <div>
          <h5 class="text-red-500 font-bold text-2xl">
            {$_('page.read_news.feeling_generous')}
          </h5>
          <h6 class="color-gray-dark">
            {$_('page.read_news.donate_some')}
          </h6>
        </div>
      </div>
    </div>

    {#if isDonating}
      <div class="mt-8 px-4 flex flex-wrap md:mt-0 md:px-0 md:block md:ml-12">
        <button class="button w-full m-2 shadow-md" disabled>{$_('page.read_news.donating')}</button>
      </div>
    {:else}
      <div class="mt-8 px-4 flex flex-wrap justify-center md:justify-start md:mt-0 md:px-0 md:block md:ml-12">
        <button class="button-outline m-2 shadow-md flex-grow" on:click={() => donate(postSlug || '', 20)}
          >+ $20 USD</button>
        <button class="button-outline m-2 shadow-md flex-grow" on:click={() => donate(postSlug || '', 50)}
          >+ $50 USD</button>
        <button class="button-outline m-2 shadow-md flex-grow" on:click={() => donate(postSlug || '', 100)}
          >+ $100 USD</button>
        <button class="button-outline m-2 shadow-md flex-grow" on:click={() => donate(postSlug || '', 200)}
          >+ $200 USD</button>
      </div>
    {/if}
  </div>
</div>
