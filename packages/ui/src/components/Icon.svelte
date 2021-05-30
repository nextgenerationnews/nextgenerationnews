<script lang="ts">
  import MdiIcon from 'mdi-svelte';

  export let path: string = null;
  export let size: number | string | undefined = null;
  export let rotate: number | undefined = null;
  export let color: string | undefined = null;
  export let spin: boolean | undefined = null;
  export let flip: boolean | string | undefined = null;
  export let top = '5px';

  let className = '';
  export { className as class };
</script>

<style>
  .Icon {
    display: inline-block;
    position: relative;
    top: 5px;
  }
</style>

<div class="Icon {className}" style="top: {top};">
  <MdiIcon {path} {size} {rotate} {color} {spin} {flip} />
</div>
