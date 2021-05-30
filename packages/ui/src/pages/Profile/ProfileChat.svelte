<script lang="ts">
  import CommunityComments from 'components/CommunityComments.svelte';

  export let walletAddress = '';

  $: room = `dn_profile_${walletAddress}_comments`;
</script>

<div>
  <CommunityComments {room} />
</div>
