<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { dexNewsService } from 'services/DexNews.service';
  import NotVerifiedPostWarning from 'components/NotVerifiedPostWarning.svelte';

  export let postSlug: string;

  $: postValidation$ = dexNewsService.isValidatingPost$(postSlug);
</script>

{#if $postValidation$ && $postValidation$.isValidating}
  {#if $postValidation$.isValidationDone}
    <!-- You have validated this shit // gray final score, comment -->
  {:else}
    <!-- You are validating this shit // blue -->
  {/if}
{:else}
  <NotVerifiedPostWarning {postSlug} />
{/if}
