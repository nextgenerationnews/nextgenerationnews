<script lang="ts">
  import { _, number } from 'svelte-i18n';
  import Icon from 'components/Icon.svelte';
  import { domTokenPurchaseService } from 'services/DomTokenPurchase.service';
  import { aggregatorService } from 'services/Aggregator.service';
  import { form as createForm, bindClass } from 'svelte-forms';
  import { lazyLibService } from 'services/Ethers.service';
  import { defaultNotification } from 'utils/default-notification';
  import { getNotificationsContext } from 'svelte-notifications';
  import { loggingService } from 'services/Logging.service';
  import { domTokenService } from 'services/DomToken.service';
  import { mdiArrowDownCircle } from '@mdi/js';
  import { web3ProviderService } from 'services/web3-provider.service';

  const { addNotification } = getNotificationsContext();
  const { domPrice$, minimumPurchase$ } = domTokenPurchaseService;
  const { weiPrice$ } = aggregatorService;
  const { icoBalance$, accountDomBalance$ } = domTokenService;
  const { accountBalanceInEth$ } = web3ProviderService;

  let fDomAmount = '100';
  let fEthAmount = '0';
  let usdAmount = 0;

  const purchaseForm = createForm(() => ({
    domAmount: { value: fDomAmount, validators: [] },
    ethAmount: { value: fEthAmount, validators: [] },
  }));

  async function purchase() {
    if (!web3ProviderService.getAccount()) {
      addNotification(
        defaultNotification($_('page.home.you_need_to_connect_your_ethereum_wallet_to_buy_dom'), {
          type: 'danger',
        }),
      );
      return;
    }

    try {
      const Ethers = await lazyLibService.getEthers();
      await domTokenPurchaseService.purchaseTokens(Ethers.BigNumber.from(fDomAmount));
      domTokenService.refresh();
      addNotification(
        defaultNotification($_('page.home.purchase_successful'), {
          type: 'success',
        }),
      );
    } catch (e) {
      loggingService.logException(e);
      addNotification(
        defaultNotification($_('page.home.failed_to_purchase_please_try_again'), {
          type: 'danger',
        }),
      );
    }
  }

  async function onChangeDomValue(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    const Ethers = await lazyLibService.getEthers();
    const domAmount = Ethers.BigNumber.from(event.currentTarget.value || 0);

    if (domAmount.isZero()) {
      fEthAmount = '0';
      usdAmount = 0;
      return;
    }

    const domPriceInWei = $domPrice$;
    const totalInWei = Ethers.FixedNumber.from(domAmount.mul(domPriceInWei));
    const totalInUSD = totalInWei.mulUnsafe($weiPrice$).round(2);
    fEthAmount = totalInWei
      .divUnsafe(Ethers.FixedNumber.from(Ethers.BigNumber.from(10).pow(18)))
      .toUnsafeFloat()
      .toPrecision(3);
    usdAmount = totalInUSD.toUnsafeFloat();
  }

  async function onChangeEthValue(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    const Ethers = await lazyLibService.getEthers();
    let ethAmount = event.currentTarget.value || '0';

    if (ethAmount.length > 4) {
      ethAmount = ethAmount.slice(0, 5);
      event.currentTarget.value = ethAmount;
    }

    if (ethAmount.toString() === '0') {
      fDomAmount = '0';
      usdAmount = 0;
      return;
    }

    const weiAmount = Ethers.FixedNumber.from(ethAmount).mulUnsafe(
      Ethers.FixedNumber.from(Ethers.BigNumber.from(10).pow(18)),
    );

    const amountOfDom = weiAmount.divUnsafe(Ethers.FixedNumber.from($domPrice$)).floor();
    fDomAmount = parseInt(amountOfDom.toString(), 10).toString();
    usdAmount = weiAmount.mulUnsafe($weiPrice$).toUnsafeFloat();
  }
</script>

<style lang="scss">
  .currency-input {
    background: none;
    color: var(--color-gray-dark);
    border: 0.2rem solid rgba(0, 0, 0, 0.1);
    padding: 0.2rem 1rem;
  }

  .ico-form-label {
    background: rgba(0, 0, 0, 0.5);
    padding: 0.5rem 1rem;
  }

  .ico-purchase-button {
    padding: 1rem;
    border: 0.1rem solid var(--color-gray-dark);
    color: var(--color-gray-dark);
    border-radius: 0.5rem;
    transition: transform 0.1s linear;

    &:hover {
      transform: scale(1.04);
    }
  }

  .fieldset {
    margin-bottom: 0;
    box-shadow: 0 0 0.2rem rgba(0, 0, 0, 0.3);
  }

  :global(.arrow-icon svg) {
    filter: drop-shadow(2px 4px 6px white);
  }

  @media (min-width: 768px) {
    .dom-icon-purchase {
      max-width: 30rem;
    }
  }

  .ico-screens {
    width: 120vh;
  }

  @media (max-width: 768px) {
    .ico-screens {
      width: 150vh;
    }
  }
  @media (min-width: 768px) {
    .ico-screens {
      margin-left: 55%;
    }
  }
</style>

<div>
  <div class="opacity-10 overflow-y-visible h-1">
    <svg class="ico-screens" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 895.59736 639.82439"
      ><rect
        x="250.162"
        y="150.83166"
        width="207.97236"
        height="302.01031"
        rx="13.4354"
        transform="translate(-210.09179 -44.46974) rotate(-12.75221)"
        fill="#3f3d56" /><circle cx="87.59736" cy="87" r="6" fill="#fff" /><circle
        cx="93.59736"
        cy="109"
        r="6"
        fill="#fff" /><circle cx="132.59736" cy="270" r="6" fill="#fff" /><circle
        cx="138.59736"
        cy="292"
        r="6"
        fill="#fff" /><rect
        x="287.34855"
        y="259.69755"
        width="124.87617"
        height="20.8127"
        transform="translate(-203.1948 -46.21522) rotate(-12.75221)"
        fill="#f5f5f5" /><rect
        x="397.94823"
        y="256.36244"
        width="207.97236"
        height="302.01031"
        transform="translate(-229.7408 -9.24511) rotate(-12.75221)"
        fill="#707070" /><rect
        x="611.85483"
        y="207.95166"
        width="207.97236"
        height="302.01031"
        transform="translate(-213.77859 36.77746) rotate(-12.75221)"
        fill="#3f3d56" /><rect
        x="411.34855"
        y="292.69755"
        width="124.87617"
        height="20.8127"
        transform="translate(-207.42045 -18.03009) rotate(-12.75221)"
        fill="#f5f5f5" /><rect
        x="399.91546"
        y="341.94676"
        width="166.50156"
        height="5.20317"
        transform="translate(-216.33734 -14.93741) rotate(-12.75221)"
        fill="#f5f5f5" /><rect
        x="402.59534"
        y="353.78804"
        width="166.50156"
        height="5.20317"
        transform="translate(-218.88502 -14.05378) rotate(-12.75221)"
        fill="#f5f5f5" /><rect
        x="405.27523"
        y="365.62931"
        width="166.50156"
        height="5.20317"
        transform="translate(-221.4327 -13.17016) rotate(-12.75221)"
        fill="#f5f5f5" /><rect
        x="409.02463"
        y="387.04161"
        width="79.782"
        height="5.20317"
        transform="translate(-227.13618 -21.3854) rotate(-12.75221)"
        fill="#f5f5f5" /><rect
        x="411.55479"
        y="397.54294"
        width="91.92274"
        height="5.20317"
        transform="translate(-229.24205 -19.22793) rotate(-12.75221)"
        fill="#f5f5f5" /><rect
        x="413.31489"
        y="401.15313"
        width="166.50156"
        height="5.20317"
        transform="translate(-229.07574 -10.51929) rotate(-12.75221)"
        fill="#f5f5f5" /><rect
        x="415.99477"
        y="412.9944"
        width="166.50156"
        height="5.20317"
        transform="translate(-231.62342 -9.63567) rotate(-12.75221)"
        fill="#f5f5f5" /><rect
        x="418.82439"
        y="426.17562"
        width="154.36082"
        height="5.20317"
        transform="translate(-234.61292 -10.02588) rotate(-12.75221)"
        fill="#f5f5f5" /><rect
        x="421.35455"
        y="436.67695"
        width="166.50156"
        height="5.20317"
        transform="translate(-236.71878 -7.86842) rotate(-12.75221)"
        fill="#f5f5f5" /><rect
        x="425.01839"
        y="457.32356"
        width="86.71956"
        height="5.20317"
        transform="translate(-242.1698 -15.35575) rotate(-12.75221)"
        fill="#f5f5f5" /><rect
        x="647.92631"
        y="420.51287"
        width="91.92274"
        height="5.20317"
        transform="translate(-228.48193 33.51412) rotate(-12.75221)"
        fill="#707070"
        opacity="0.3" /><rect
        x="649.68641"
        y="424.12307"
        width="166.50156"
        height="5.20317"
        transform="translate(-228.31563 42.22276) rotate(-12.75221)"
        fill="#707070"
        opacity="0.3" /><rect
        x="652.36629"
        y="435.96434"
        width="166.50156"
        height="5.20317"
        transform="translate(-230.86331 43.10638) rotate(-12.75221)"
        fill="#707070"
        opacity="0.3" /><rect
        x="655.19591"
        y="449.14556"
        width="154.36082"
        height="5.20317"
        transform="translate(-233.8528 42.71617) rotate(-12.75221)"
        fill="#707070"
        opacity="0.3" /><rect
        x="657.72606"
        y="459.64689"
        width="166.50156"
        height="5.20317"
        transform="translate(-235.95867 44.87363) rotate(-12.75221)"
        fill="#707070"
        opacity="0.3" /><rect
        x="497.42189"
        y="461.51781"
        width="100.59469"
        height="69.37565"
        transform="translate(-248.22113 3.0525) rotate(-12.75221)"
        fill="#f5f5f5" /><rect
        x="613.5551"
        y="236.07039"
        width="100.59469"
        height="69.37565"
        transform="translate(-195.59243 23.12624) rotate(-12.75221)"
        fill="#707070"
        opacity="0.3" /><rect
        x="709.58529"
        y="306.8063"
        width="100.59469"
        height="69.37565"
        transform="translate(-208.83762 46.06825) rotate(-12.75221)"
        fill="#707070"
        opacity="0.3" /><g opacity="0.5"
        ><rect x="185.59736" y="510.28636" width="3" height="17" fill="#47e6b1" /><rect
          x="337.79868"
          y="640.37417"
          width="3"
          height="17"
          transform="translate(835.97153 179.48768) rotate(90)"
          fill="#47e6b1" /></g
      ><g opacity="0.5"
        ><rect x="512.59736" width="3" height="17" fill="#47e6b1" /><rect
          x="664.79868"
          y="130.08781"
          width="3"
          height="17"
          transform="translate(652.68517 -657.79868) rotate(90)"
          fill="#47e6b1" /></g
      ><g opacity="0.5"
        ><rect x="885.59736" y="125" width="3" height="17" fill="#47e6b1" /><rect
          x="1037.79868"
          y="255.08781"
          width="3"
          height="17"
          transform="translate(1150.68517 -905.79868) rotate(90)"
          fill="#47e6b1" /></g
      ><path
        d="M512.491,638.67962a3.67461,3.67461,0,0,1-2.04749-4.441,1.766,1.766,0,0,0,.07991-.40754h0a1.84258,1.84258,0,0,0-3.31045-1.22119h0a1.76564,1.76564,0,0,0-.2039.3618,3.6746,3.6746,0,0,1-4.441,2.04748,1.76645,1.76645,0,0,0-.40754-.0799h0a1.84257,1.84257,0,0,0-1.22119,3.31045h0a1.76637,1.76637,0,0,0,.3618.2039,3.67459,3.67459,0,0,1,2.04749,4.441,1.766,1.766,0,0,0-.0799.40754h0a1.84257,1.84257,0,0,0,3.31044,1.22119h0a1.76584,1.76584,0,0,0,.2039-.3618,3.67459,3.67459,0,0,1,4.441-2.04748,1.766,1.766,0,0,0,.40754.0799h0a1.84257,1.84257,0,0,0,1.22119-3.31045h0A1.7661,1.7661,0,0,0,512.491,638.67962Z"
        transform="translate(-152.20132 -130.08781)"
        fill="#4d8af0"
        opacity="0.5" /><path
        d="M658.68918,763.33049a3.6746,3.6746,0,0,1-2.04749-4.441,1.76592,1.76592,0,0,0,.0799-.40754h0a1.84257,1.84257,0,0,0-3.31044-1.22119h0a1.76637,1.76637,0,0,0-.2039.3618,3.67459,3.67459,0,0,1-4.441,2.04749,1.766,1.766,0,0,0-.40754-.0799h0a1.84257,1.84257,0,0,0-1.22119,3.31044h0a1.7661,1.7661,0,0,0,.3618.2039,3.67461,3.67461,0,0,1,2.04749,4.441,1.766,1.766,0,0,0-.07991.40754h0a1.84258,1.84258,0,0,0,3.31045,1.22119h0a1.76564,1.76564,0,0,0,.2039-.3618,3.67462,3.67462,0,0,1,4.441-2.04749,1.76594,1.76594,0,0,0,.40754.07991h0a1.84257,1.84257,0,0,0,1.22119-3.31045h0A1.7659,1.7659,0,0,0,658.68918,763.33049Z"
        transform="translate(-152.20132 -130.08781)"
        fill="#4d8af0"
        opacity="0.5" /><path
        d="M164.491,341.39326a3.67462,3.67462,0,0,1-2.04749-4.441,1.76594,1.76594,0,0,0,.07991-.40754h0a1.84257,1.84257,0,0,0-3.31045-1.22119h0a1.7659,1.7659,0,0,0-.2039.3618,3.6746,3.6746,0,0,1-4.441,2.04749,1.76646,1.76646,0,0,0-.40754-.07991h0a1.84257,1.84257,0,0,0-1.22119,3.31045h0a1.76684,1.76684,0,0,0,.3618.2039,3.67458,3.67458,0,0,1,2.04749,4.441,1.76592,1.76592,0,0,0-.0799.40754h0a1.84257,1.84257,0,0,0,3.31044,1.22119h0a1.76637,1.76637,0,0,0,.2039-.3618,3.67459,3.67459,0,0,1,4.441-2.04749,1.766,1.766,0,0,0,.40754.07991h0a1.84258,1.84258,0,0,0,1.22119-3.31045h0A1.76606,1.76606,0,0,0,164.491,341.39326Z"
        transform="translate(-152.20132 -130.08781)"
        fill="#4d8af0"
        opacity="0.5" /><path
        d="M1029.68918,493.33049a3.6746,3.6746,0,0,1-2.04749-4.441,1.76592,1.76592,0,0,0,.0799-.40754h0a1.84257,1.84257,0,0,0-3.31044-1.22119h0a1.76637,1.76637,0,0,0-.2039.3618,3.67459,3.67459,0,0,1-4.441,2.04749,1.766,1.766,0,0,0-.40754-.0799h0a1.84257,1.84257,0,0,0-1.22119,3.31044h0a1.7661,1.7661,0,0,0,.3618.2039,3.67461,3.67461,0,0,1,2.04749,4.441,1.766,1.766,0,0,0-.07991.40754h0a1.84258,1.84258,0,0,0,3.31045,1.22119h0a1.76564,1.76564,0,0,0,.2039-.3618,3.67462,3.67462,0,0,1,4.441-2.04749,1.76594,1.76594,0,0,0,.40754.07991h0a1.84257,1.84257,0,0,0,1.22119-3.31045h0A1.7659,1.7659,0,0,0,1029.68918,493.33049Z"
        transform="translate(-152.20132 -130.08781)"
        fill="#4d8af0"
        opacity="0.5" /><circle cx="107.59736" cy="455.28636" r="6" fill="#f55f44" opacity="0.5" /><circle
        cx="321.59736"
        cy="6"
        r="6"
        fill="#4d8af0"
        opacity="0.5" /><circle cx="463.79555" cy="457.93723" r="6" fill="#47e6b1" opacity="0.5" /><circle
        cx="809.79555"
        cy="607.93723"
        r="6"
        fill="#f55f44"
        opacity="0.5" /><rect
        x="688.162"
        y="277.83166"
        width="207.97236"
        height="302.01031"
        rx="13.4354"
        transform="translate(-227.32135 55.3448) rotate(-12.75221)"
        fill="#707070" /><circle cx="525.59736" cy="214" r="6" fill="#fff" /><circle
        cx="531.59736"
        cy="236"
        r="6"
        fill="#fff" /><circle cx="570.59736" cy="397" r="6" fill="#fff" /><circle
        cx="576.59736"
        cy="419"
        r="6"
        fill="#fff" /><rect
        x="725.34855"
        y="386.69755"
        width="124.87617"
        height="20.8127"
        transform="translate(-220.42436 53.59932) rotate(-12.75221)"
        fill="#f5f5f5" /></svg>
  </div>
  <div class="z-10 relative">
    <div class="flex w-full justify-center mb-10 mt-10">
      <h2 class="text-4xl font-bold gradient-background color-gray-light py-6 px-8 rounded-full shadow-lg">
        {$_('page.home.dom_ico_purchase')}
      </h2>
    </div>
    <div class="mx-auto dom-icon-purchase mb-14">
      <p class="text-lg">
        The DOM token is used as the DexNews "Fuel", by publishing or validating articles you earn DOM, which can be
        used for governance of the platform, help us take decisions by voting and moderating validators.
      </p>
      <p class="text-lg">
        To support the project and kickstart the economics of the DexNews, we are currently hosting an ICO (Initial Coin
        Offering), buy DOM at a fixed price of 0.003 USD (yes! less than a cent per DOM!)
      </p>
    </div>

    <div class="w-full overflow-hidden dom-icon-purchase mx-auto px-2 py-4">
      <form class="block  bg-white shadow-lg rounded-lg p-2" on:submit|preventDefault={purchase}>
        <div class="fieldset gradient-background-light-checkered rounded-lg w-full px-4 pb-6 pt-4">
          <div class="flex">
            <div class="ico-form-label flex rounded-xl mr-2">
              <label class="block m-auto color-gray-light font-bold" for="ethAmount">ETH</label>
            </div>
            <input
              type="number"
              placeholder="0.0"
              name="ethAmount"
              id="ethAmount"
              step="any"
              class="w-full text-right rounded-md text-4xl currency-input"
              maxlength="5"
              max="1000"
              min="0"
              on:keyup={onChangeEthValue}
              bind:value={fEthAmount}
              use:bindClass={{ form: purchaseForm }} />
          </div>
          <div class="flex mt-2">
            <span class="text-sm color-gray-dark text-left flex-grow"
              >{$_('page.home.usd_balance', {
                values: {
                  amount: $number($accountBalanceInEth$?.toUnsafeFloat() || 0.0, {
                    style: 'currency',
                    currency: 'USD',
                  }),
                },
              })}</span>
            <span class="text-sm color-gray-dark text-right flex-grow"
              >{$_('page.home.purchase_value_in_usd', {
                values: {
                  amount: $number(usdAmount || 0.0, {
                    style: 'currency',
                    currency: 'USD',
                  }),
                },
              })}</span>
          </div>
        </div>

        <div class="flex justify-center -mt-4 -mb-4">
          <Icon path={mdiArrowDownCircle} size={1.5} top={'0'} color="var(--color-gray-dark)" class="arrow-icon" />
        </div>

        <div class="fieldset gradient-background-light-checkered rounded-lg w-full px-4 pt-6 pb-4">
          <div class="flex">
            <div class="ico-form-label flex rounded-xl mr-2">
              <label class="block m-auto color-gray-light font-bold" for="domAmount">DOM</label>
            </div>
            <input
              type="number"
              placeholder="0"
              name="domAmount"
              id="domAmount"
              step="any"
              class="w-full text-right rounded-md p-3 text-4xl currency-input"
              min={$minimumPurchase$?.toString() || '1000'}
              max={$icoBalance$?.toString() || '999999999999'}
              on:keyup={onChangeDomValue}
              bind:value={fDomAmount}
              use:bindClass={{ form: purchaseForm }} />
          </div>
          <div class="flex mt-2">
            <span class="text-sm color-gray-dark text-left flex-grow"
              >{$_('page.home.dom_balance', {
                values: {
                  amount: $number($accountDomBalance$?.toNumber() || 0.0, {
                    style: 'currency',
                    currency: 'USD',
                  }),
                },
              })}</span>
            <span class="text-sm color-gray-dark text-right flex-grow"
              >{$_('page.home.ico_available_funds', {
                values: {
                  amount: $number($icoBalance$?.toNumber() || 0.0, {
                    style: 'currency',
                    currency: 'USD',
                  }),
                },
              })}</span>
          </div>
        </div>

        <button class="block w-full text-4xl mt-2 ico-purchase-button uppercase">{$_('page.home.purchase')}</button>
      </form>
    </div>
  </div>
</div>
