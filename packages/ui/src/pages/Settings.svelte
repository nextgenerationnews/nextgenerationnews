<script lang="ts">
  import ContentHeader from '../components/ContentHeader.svelte';
  import { _ } from 'svelte-i18n';
</script>

<svelte:head>
  <title>{$_('page.settings.title')} - DexNews</title>
</svelte:head>

<ContentHeader title={$_('page.settings.title')} />

<div class="page-content">settings</div>
