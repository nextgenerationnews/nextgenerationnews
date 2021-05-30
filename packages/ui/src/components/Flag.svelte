<script lang="ts">
  export let countryCode: string;
  export let size: number | undefined = 1.5;

  $: flagStyle = `--flag: url(/build/flags/4x3/${countryCode}.svg); --flag-size: ${size};`;
</script>

<style lang="scss">
  .flag-icon {
    background-size: contain;
    background-position: 50%;
    background-repeat: no-repeat;
    position: relative;
    display: inline-block;
    background-image: var(--flag);
    filter: saturate(0.4);
    width: calc(calc(calc(4 / 3) * var(--flag-size, 1)) * 1rem);
    line-height: calc(var(--flag-size, 1) * 1rem);

    &:before {
      content: '\00a0';
    }
  }
</style>

<span class="flag-icon" style={flagStyle} />
