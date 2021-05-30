<script lang="ts">
  import { Link } from 'svelte-routing';
  import { _ } from 'svelte-i18n';
  import { mdiClose, mdiChevronRight } from '@mdi/js';
  import { i18nService } from 'services/i18n.service';
  import { responsivityService } from 'services/responsitivy.service';
  import SidebarProfile from 'components/SidebarProfile.svelte';
  import Icon from 'components/Icon.svelte';
  import { isMenuOpen } from 'stores/menu.store';
  import { scrollToTop } from 'utils/Page';

  let className: string;
  export { className as class };

  const { currentCountry$, countryList } = i18nService;

  $: sidebarWidth = 300;

  function toggleSidebar() {
    isMenuOpen.update(v => !v);
  }

  function toggleSidebarIfMobile() {
    scrollToTop();

    if (responsivityService.isMobile()) {
      toggleSidebar();
    }
  }

  function flagStyle(countryCode: string) {
    return `--flag: url(/build/flags/4x3/${countryCode}.svg); --flag-size: 1.5;`;
  }

  function onCountryChange(event: Event & { currentTarget: EventTarget & HTMLSelectElement }) {
    i18nService.updateCountry(event.currentTarget.value);
  }

  const getProps: Link['$$prop_def']['getProps'] = ({ isCurrent }) => {
    return {
      class: isCurrent ? 'active text-lg sidebar-link' : 'text-lg sidebar-link',
    };
  };
</script>

<style lang="scss">
  .siderbar {
    background-color: var(--color-gray);
    z-index: 80;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .sidebar-items {
    margin-top: 2rem;
    margin-bottom: 4rem;
    flex-grow: 1;
  }

  :global(.sidebar-link) {
    display: block;
    line-height: 2.6rem;
    color: var(--color-black);
    font-family: 'Oswald', Arial, Helvetica, sans-serif;
    padding: 0 0.6rem;
  }

  :global(.sidebar-link:hover) {
    color: black;
    background-color: rgba(128, 128, 128, 0.05);
  }

  :global(.sidebar-link.active) {
    background-color: rgba(128, 128, 128, 0.2);
    border-radius: 0.2rem;
  }
  .separator {
    border-bottom: 1px solid var(--color-black);
    width: 20%;
    height: 1px;
    margin: 2rem auto 2rem auto;
  }

  .closed-sidebar {
    width: 0;
    overflow: visible;
  }

  .open-container {
    width: 4rem;
    height: 3rem;
    background-color: transparent;
  }

  .country-select {
    background: transparent;
    color: var(--color-black);
    padding: 0.3em;
    width: calc(100% - 3.8rem);
    border-radius: 0.25rem;
    max-width: 13rem;
    appearance: none;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    .country-select {
      max-width: 15rem;
    }
  }

  .flag-icon {
    margin-right: 0.3rem;
  }

  .country-selector-container {
    padding: 1rem;
  }

  .backdrop {
    width: 100vw;
    height: 100vh;
    top: 0;
    position: fixed;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(5px);
    z-index: 70;
  }

  @media (max-width: 768px) {
    :global(html[menu-open='1']) {
      overflow: hidden;
    }
  }

  @media (min-width: 768px) {
    .siderbar {
      animation: none;
    }
  }
</style>

{#if $isMenuOpen}
  <div class="backdrop animate__animated animate__fadeIn animate__faster md:hidden" on:click={toggleSidebar} />
  <div
    id="sidebar-spacer"
    class="spacer hidden md:block"
    style="width: {sidebarWidth}px; min-width: {sidebarWidth}px;" />
  <div
    bind:clientWidth={sidebarWidth}
    style="position: fixed !important;"
    class="{className} siderbar animate__animated animate__slideInLeft animate__faster w-3/4 sm:w-2/4 min-w-max md:w-max fixed shadow-lg md:shadow-none top-0 md:top-auto">
    <div class="md:hidden gradient-background px-2 py-4">
      <div class="flex justify-end px-4">
        <button on:click={toggleSidebar} aria-label={$_('app.navbar.menu')} type="button">
          <Icon path={mdiClose} color="white" />
        </button>
      </div>
      <SidebarProfile />
    </div>
    <div class="flex country-selector-container">
      <div>
        {#if $currentCountry$}
          <span for="platform_country_select" class="flag-icon" style={flagStyle($currentCountry$.code)} />
        {/if}

        <select
          class="country-select flex-grow"
          name="platform_country_select"
          id="platform_country_select"
          aria-label={$_('navbar.country_selection')}
          on:change={onCountryChange}
          on:blur={onCountryChange}>
          {#each countryList as country}
            <option value={country.code} selected={country === $currentCountry$}>
              <span class="text-white">{$_(`country_name.${country.name}`, { default: country.name })}</span>
            </option>
          {/each}
        </select>
        <label class="inline-block m-0" for="platform_country_select">
          <Icon path={mdiChevronRight} size={1.3} color="var(--color-black)" top="10px" />
        </label>
      </div>
    </div>
    <div class="sidebar-items px-6">
      <Link to="/home" {getProps} on:click={toggleSidebarIfMobile}>{$_('navbar.home')}</Link>
      <Link to="/latest-news" {getProps} on:click={toggleSidebarIfMobile}>{$_('navbar.latest_news')}</Link>
      <Link to="/hottest-news" {getProps} on:click={toggleSidebarIfMobile}>{$_('navbar.hottest_news')}</Link>
      <Link to="/search-news" {getProps} on:click={toggleSidebarIfMobile}>{$_('navbar.search')}</Link>
      <div class="separator" />
      <Link to="/my-reading-list" {getProps} on:click={toggleSidebarIfMobile}>{$_('navbar.reading_list')}</Link>
      <!-- <Link to="/my-subscriptions" {getProps} on:click={toggleSidebarIfMobile}>{$_('navbar.subscriptions')}</Link> -->
      <div class="separator" />
      <Link to="/publish-news" {getProps} on:click={toggleSidebarIfMobile}>{$_('navbar.publish')}</Link>
      <Link to="/my-published-news" {getProps} on:click={toggleSidebarIfMobile}>{$_('navbar.my_news')}</Link>
      <Link to="/my-donations" {getProps} on:click={toggleSidebarIfMobile}>{$_('navbar.donations')}</Link>
      <Link to="/edit-profile" {getProps} on:click={toggleSidebarIfMobile}>{$_('navbar.my_profile')}</Link>
      <!-- <div class="separator" /> -->
      <!-- <Link to="/settings" {getProps} on:click={toggleSidebarIfMobile}>{$_('navbar.settings')}</Link> -->
    </div>
  </div>
{/if}
