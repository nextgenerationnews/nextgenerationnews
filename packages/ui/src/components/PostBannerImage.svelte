<script lang="ts">
  export let bannerImage = '';
  export let category = '';
  let className = '';
  export { className as class };
</script>

<style>
  .image-preview {
    height: 15rem;
    background-size: cover;
    background-position: center;
  }
</style>

<div
  class={`w-100 rounded shadow-lg mt-2 animate__animated animate__fadeIn animate__faster image-preview ${className}`}
  style="background-image: url({bannerImage || `/build/default-banners/${category}.png`})" />
