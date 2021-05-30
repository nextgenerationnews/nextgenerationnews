<script lang="ts">
  export let profileBannerUrl: string | undefined = '';
  let className: string | undefined = '';
  export { className as class };

  function backgroundImg(addr?: string): string {
    if (!addr) {
      return '--background-img-url: white';
    }

    return `--background-img-url: url(${addr})`;
  }
</script>

<style>
  .profile-picture {
    background: var(--background-img-url);
    background-size: cover;
    overflow: hidden;
  }
</style>

<div
  style={backgroundImg(profileBannerUrl)}
  class="shadow-lg rounded-lg w-full h-40 flex {profileBannerUrl
    ? 'profile-picture'
    : 'gradient-background-light'} {className}">
  <slot />
</div>
