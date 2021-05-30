import { defer, Observable, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AggregatorV3Abi } from 'generated-contracts/data/ContractAbis';
import { getAggregatorV3Address } from 'generated-contracts/data/ContractAddresses';
import type { AggregatorV3 } from 'generated-contracts/types/AggregatorV3';

import { web3ProviderService } from './web3-provider.service';
import { lazyLibService } from './Ethers.service';
import type { FixedNumber } from '@ethersproject/bignumber';

class AggregatorService {
  public readonly ethereumPrice$: Observable<FixedNumber>;
  public readonly weiPrice$: Observable<FixedNumber>;

  constructor() {
    this.ethereumPrice$ = this.makeEthereumPrice$();
    this.weiPrice$ = this.makeWeiPrice$();
  }

  private async getEthereumPriceFromAggregator(aggregator: AggregatorV3) {
    const ethers = await lazyLibService.getEthers();

    const decimals = await aggregator.decimals();
    const { answer } = await aggregator.latestRoundData();

    return ethers.FixedNumber.from(answer).divUnsafe(
      ethers.FixedNumber.fromValue(ethers.BigNumber.from(10).pow(decimals)),
    );
  }

  private async getWeiPriceFromAggregator(aggregator: AggregatorV3) {
    const ethers = await lazyLibService.getEthers();

    const decimals = await aggregator.decimals();
    const { answer } = await aggregator.latestRoundData();

    return ethers.FixedNumber.from(answer).divUnsafe(
      ethers.FixedNumber.fromValue(ethers.BigNumber.from(10).pow(18 + decimals)),
    );
  }

  async getEthereumPrice() {
    const aggregator = await web3ProviderService.makeContract<AggregatorV3>(AggregatorV3Abi, getAggregatorV3Address);
    return this.getEthereumPriceFromAggregator(aggregator);
  }

  async getWeiPrice() {
    const aggregator = await web3ProviderService.makeContract<AggregatorV3>(AggregatorV3Abi, getAggregatorV3Address);
    return this.getWeiPriceFromAggregator(aggregator);
  }

  makeEthereumPrice$() {
    return web3ProviderService.contract$<AggregatorV3>(AggregatorV3Abi, getAggregatorV3Address).pipe(
      switchMap(aggregator => {
        return timer(0, 25000).pipe(
          switchMap(() => {
            return defer(() => {
              return this.getEthereumPriceFromAggregator(aggregator);
            });
          }),
        );
      }),
    );
  }

  makeWeiPrice$() {
    return web3ProviderService.contract$<AggregatorV3>(AggregatorV3Abi, getAggregatorV3Address).pipe(
      switchMap(aggregator => {
        return timer(0, 25000).pipe(
          switchMap(() => {
            return defer(() => {
              return this.getWeiPriceFromAggregator(aggregator);
            });
          }),
        );
      }),
    );
  }
}

export const aggregatorService = new AggregatorService();
