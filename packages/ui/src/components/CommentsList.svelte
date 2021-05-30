<script lang="ts">
  import type { DnChatMessage } from 'models/DnChatMessage.model';
  import CommentBox from 'components/CommentBox.svelte';

  export let comments: DnChatMessage[] | undefined = [];
</script>

{#each comments as comment}
  <CommentBox {comment} />
{/each}
