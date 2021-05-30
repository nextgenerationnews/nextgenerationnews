<script lang="ts">
  import Sidebar from './Sidebar.svelte';
  import Footer from './Footer.svelte';
  import ConnectedNewsSummaryBar from './ConnectedNewsSummaryBar.svelte';
</script>

<style>
  .content-container {
    height: 100%;
    width: 100%;
  }
  .app-content {
    min-height: 80vh;
  }
</style>

<svelte:head>
  <title>DexNews</title>
</svelte:head>

<div class="content-container flex">
  <Sidebar class="sidebar" />
  <div class="flex-grow flex flex-col overflow-hidden">
    <div class="hidden sm:block">
      <ConnectedNewsSummaryBar />
    </div>
    <div class="flex-grow overflow-y-scroll animate__animated animate__fadeIn animate__faster">
      <div class="container small app-content mx-auto">
        <slot />
      </div>
      <Footer />
    </div>
  </div>
</div>
