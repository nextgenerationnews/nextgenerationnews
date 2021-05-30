import { web3ProviderService } from './web3-provider.service';
import { DomTokenPurchaseAbi } from 'generated-contracts/data/ContractAbis';
import { getDomTokenPurchaseAddress } from 'generated-contracts/data/ContractAddresses';
import { defer, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import type { DomTokenPurchase } from 'generated-contracts/types/DomTokenPurchase';
import type { BigNumber } from '@ethersproject/bignumber';

class DomTokenPurchaseService {
  public readonly domPrice$: Observable<BigNumber>;
  public readonly minimumPurchase$: Observable<BigNumber>;

  constructor() {
    this.domPrice$ = this.makeDomPrice$();
    this.minimumPurchase$ = this.makeMinimumPurchase$();
  }

  async makeDomPurchaseContract() {
    return web3ProviderService.makeContract<DomTokenPurchase>(DomTokenPurchaseAbi, getDomTokenPurchaseAddress);
  }

  makeDomPrice$() {
    return web3ProviderService
      .contract$<DomTokenPurchase>(DomTokenPurchaseAbi, getDomTokenPurchaseAddress)
      .pipe(switchMap(DomTokenPurchase => defer(() => DomTokenPurchase.domTokenPriceinWei())));
  }
  makeMinimumPurchase$() {
    return web3ProviderService
      .contract$<DomTokenPurchase>(DomTokenPurchaseAbi, getDomTokenPurchaseAddress)
      .pipe(switchMap(DomTokenPurchase => defer(() => DomTokenPurchase.minimumDomBuy())));
  }

  async purchaseTokens(amount: BigNumber) {
    const DomPurchase = await this.makeDomPurchaseContract();
    const price = await DomPurchase.domTokenPriceinWei();
    const valueInWei = price.mul(amount);

    const gasEstimate = await DomPurchase.estimateGas.purchaseTokens({
      value: valueInWei,
    });

    DomPurchase.purchaseTokens({
      value: valueInWei,
      gasLimit: gasEstimate.add(5),
    });
  }
}

export const domTokenPurchaseService = new DomTokenPurchaseService();
