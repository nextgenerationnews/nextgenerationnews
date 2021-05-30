<script lang="ts">
  import { mdiArrowLeft, mdiArrowRight } from '@mdi/js';
  import Icon from 'components/Icon.svelte';
  import { POST_PAGE_SIZE } from 'services/DexNews.service';
  import { _ } from 'svelte-i18n';
  import { Link } from 'svelte-routing';

  let className: string;
  export let itemCount = 0;
  export let page = 1;
  export let pagePrefix = '';
  export let pageSuffix: string | undefined = '';
  export let onClick: () => void | undefined = () => {};
  export { className as class };
</script>

<div class="{className} flex justify-center max-w-lg">
  {#if page > 1}
    <Link to={`${pagePrefix}${page - 1}${pageSuffix}`} class="button-outline flex w-2/5 mr-2" on:click={onClick}>
      <Icon class="my-auto" path={mdiArrowLeft} size={1} />
      <span class="flex-grow my-auto text-center -mb-1 ml-2">{$_('previous_page')}</span>
    </Link>
  {/if}
  <div class="color-info w-1/5 flex">
    <span class="m-auto text-2xl">{page}</span>
  </div>
  {#if itemCount >= POST_PAGE_SIZE}
    <Link to={`${pagePrefix}${page + 1}${pageSuffix}`} class="button-outline w-2/5 ml-2 flex" on:click={onClick}>
      <span class="flex-grow my-auto text-center -mb-1 mr-2">{$_('next_page')}</span>
      <Icon class="my-auto" path={mdiArrowRight} size={1} />
    </Link>
  {/if}
</div>
