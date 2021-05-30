<script lang="ts">
  import type { UserProfile } from 'models/UserProfile.model';
  import { _, date, time } from 'svelte-i18n';

  export let profile: UserProfile | null = null;
  export let address: string | null = '';
</script>

<div class="shadow-lg rounded-lg p-4 w-full overflow-hidden">
  <h3 class="text-2xl font-bold color-black mb-6">{$_('pages.profile.about')}</h3>
  <h4 class="mb-4 color-black"><span class="font-bold">{$_('pages.profile.about.name')} </span>{profile.name}</h4>
  <h5 class="mb-4 color-black">
    <span class="font-bold">{$_('pages.profile.about.wallet_address')} </span><span
      class="whitespace-pre-wrap break-all">{address}</span>
  </h5>
  <h5 class="mb-4 color-black">{profile.profileDescription}</h5>
  <h5 class="color-gray-dark">
    {$_('page.profile.last_updated_on', {
      values: {
        date: $date(new Date(profile.timeStamp.toNumber() * 1000), { format: 'full' }),
        time: $time(new Date(profile.timeStamp.toNumber() * 1000), { format: 'medium' }),
      },
    })}
  </h5>
</div>
