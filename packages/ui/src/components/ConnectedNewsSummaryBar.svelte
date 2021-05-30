<script lang="ts">
  import { dexNewsService } from 'services/DexNews.service';
  import NewsSummaryBar from './NewsSummaryBar.svelte';

  const { latestNewsFirstPage$ } = dexNewsService;
</script>

<NewsSummaryBar news={$latestNewsFirstPage$ || []} loading={($latestNewsFirstPage$ || []).length === 0} />
