<script lang="ts">
  import AppWithNotifications from 'svelte-notifications';
  import Header from './Header.svelte';
  import Content from './Content.svelte';
  import ColorTheme from './ColorTheme.svelte';
  import ModalContext from 'svelte-simple-modal';
</script>

<AppWithNotifications>
  <ColorTheme />
  <ModalContext>
    <div class="AppLayout">
      <Content class="content" />
      <Header class="header" />
    </div>
  </ModalContext>
</AppWithNotifications>
