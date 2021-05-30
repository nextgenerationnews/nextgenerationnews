<script lang="ts">
  import ChatMessageBox from 'components/ChatMessageBox.svelte';
  import VirtualList from '@sveltejs/svelte-virtual-list';
  import type { DnChatMessage } from 'models/DnChatMessage.model';

  export let messages: DnChatMessage[] | undefined = [];
  export let userAddress: string | undefined = '';
</script>

<VirtualList height="75vh" items={messages} let:item>
  <ChatMessageBox comment={item} toTheRight={userAddress && userAddress === item?.profile?.address} />
</VirtualList>
