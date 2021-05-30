import { BehaviorSubject, combineLatest, defer, NEVER, Observable, timer } from 'rxjs';
import { web3ProviderService } from './web3-provider.service';
import { DOMTokenAbi } from 'generated-contracts/data/ContractAbis';
import { getDOMTokenAddress } from 'generated-contracts/data/ContractAddresses';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';

import type { BigNumber } from '@ethersproject/bignumber';
import type { DOMToken } from 'generated-contracts/types/DOMToken';

class DomTokenService {
  public readonly accountDomBalance$: Observable<BigNumber>;
  public readonly icoAddress$: Observable<string>;
  public readonly icoBalance$: Observable<BigNumber>;
  private readonly refreshHash: BehaviorSubject<number>;
  constructor() {
    this.refreshHash = new BehaviorSubject(0);
    this.accountDomBalance$ = this.makeAccountDomBalance$();
    this.icoAddress$ = this.makeIcoAddress$();
    this.icoBalance$ = this.makeIcoBalance$();
  }

  private makeAccountDomBalance$() {
    return combineLatest([
      web3ProviderService.contract$<DOMToken>(DOMTokenAbi, getDOMTokenAddress),
      web3ProviderService.account$,
      this.refreshHash.asObservable(),
    ]).pipe(
      distinctUntilChanged(),
      switchMap(([DomToken, account]) => {
        if (!account) {
          return NEVER;
        }
        return timer(0, 30_000).pipe(switchMap(() => defer(() => DomToken.balanceOf(account))));
      }),
    );
  }

  private makeIcoAddress$() {
    return web3ProviderService
      .contract$<any>(DOMTokenAbi, getDOMTokenAddress)
      .pipe(switchMap(DomToken => defer(() => DomToken.icoAddress() as Promise<string>)));
  }

  private makeIcoBalance$() {
    return combineLatest([
      web3ProviderService.contract$<DOMToken>(DOMTokenAbi, getDOMTokenAddress),
      this.icoAddress$,
    ]).pipe(switchMap(([DomToken, icoAddress]) => defer(() => DomToken.balanceOf(icoAddress))));
  }

  domBalanceForAddress$(account: string) {
    return web3ProviderService
      .contract$<DOMToken>(DOMTokenAbi, getDOMTokenAddress)
      .pipe(switchMap(DomToken => defer(() => DomToken.balanceOf(account))));
  }

  refresh() {
    this.refreshHash.next(Date.now());
  }
}

export const domTokenService = new DomTokenService();
