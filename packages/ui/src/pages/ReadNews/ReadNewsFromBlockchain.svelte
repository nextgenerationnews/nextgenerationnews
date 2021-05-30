<script lang="ts">
  import { dexNewsService } from 'services/DexNews.service';
  import { tap } from 'rxjs/operators';
  import ReadPost from 'pages/ReadNews/ReadPost.svelte';

  export let slug = '';

  $: post$ = dexNewsService.postBySlug$(slug || '').pipe(
    tap(() => {
      setTimeout(() => {
        window.prerenderReady = true;
      }, 100);
    }),
  );
</script>

<ReadPost postWithAuthor={$post$} showCommunity={true} isLoading={!$post$} />
