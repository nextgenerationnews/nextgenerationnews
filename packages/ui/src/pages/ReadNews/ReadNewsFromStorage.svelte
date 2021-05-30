<script lang="ts">
  import { readingListService } from 'services/reading-list.service';
  import ReadPost from 'pages/ReadNews/ReadPost.svelte';

  export let slug = '';
  $: post$ = readingListService.articleBySlug$(slug);
</script>

<ReadPost postWithAuthor={$post$} showCommunity={false} isLoading={!$post$} />
