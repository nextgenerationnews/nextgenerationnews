import { defer, timer, Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, shareReplay, switchMap } from 'rxjs/operators';
import kebabCase from 'lodash.kebabcase';
import { DexNewsAbi } from 'generated-contracts/data/ContractAbis';
import { getDexNewsAddress } from 'generated-contracts/data/ContractAddresses';
import { web3ProviderService } from './web3-provider.service';
import { aggregatorService } from './Aggregator.service';
import { Country, CountrySort } from 'models/Country.model';
import { COUNTRY_CODE_MAP } from 'utils/CountryList';
import { UserProfile, UserProfileUpdate, UserProfileUtils } from 'models/UserProfile.model';
import { PostWithAuthorUtils } from 'models/PostWithAuthor.model';
import { lazyLibService } from './Ethers.service';
import { PostUtils } from 'models/Post.model';
import { i18nService } from './i18n.service';

import type { NewsCreationForm } from 'models/NewsCreationForm.model';
import type { DexNews } from '../generated-contracts/types/DexNews';
import type { PostWithAuthor } from 'models/PostWithAuthor.model';
import type { FixedNumber } from '@ethersproject/bignumber';

export const POST_PAGE_SIZE = 10;

const NO_ADDRESS = '0x0000000000000000000000000000000000000000';

class DexNewsService {
  public readonly categories$: Observable<string[]>;
  public readonly countries$: Observable<Country[]>;
  public readonly authorBalance$: Observable<FixedNumber>;
  public readonly contractOwner$: Observable<string>;
  public readonly contractOwnerBalance$: Observable<FixedNumber>;
  public readonly profile$: Observable<UserProfile>;
  public readonly refreshCounterSubject: BehaviorSubject<number>;
  public readonly latestNewsFirstPage$: Observable<PostWithAuthor[]>;
  private readonly refreshCounter$: Observable<number>;

  constructor() {
    this.refreshCounterSubject = new BehaviorSubject<number>(0);
    this.refreshCounter$ = this.refreshCounterSubject.asObservable();
    this.categories$ = this.makeCategories$();
    this.countries$ = this.makeCountries$();
    this.authorBalance$ = this.makeAuthorBalance$();
    this.contractOwner$ = this.makeContractOwner$();
    this.contractOwnerBalance$ = this.makeContractOwnerBalance$();
    this.profile$ = this.makeProfile$();
    this.latestNewsFirstPage$ = this.makeLatestNewsFirstPage$();
  }

  async postNews(newsCreationForm: NewsCreationForm): Promise<string> {
    const DexNews = await web3ProviderService.makeContract<DexNews>(DexNewsAbi, getDexNewsAddress);
    const account = web3ProviderService.getAccount();
    const slug = `${kebabCase(newsCreationForm.title.trim().normalize('NFD'))}_${Date.now()}`;

    const gasEstimate = await DexNews.estimateGas.createPost(
      PostUtils.makePostCreationArray(slug, newsCreationForm),
      1,
      1,
      {
        from: account,
      },
    );

    await DexNews.createPost(PostUtils.makePostCreationArray(slug, newsCreationForm), 1, 1, {
      from: account,
      gasLimit: gasEstimate.add(100),
    });

    this.refresh();

    return slug;
  }

  async donateToPost(slug: string, amountInDolars: number): Promise<void> {
    const Ethers = await lazyLibService.getEthers();
    const dexNews = await web3ProviderService.makeContract<DexNews>(DexNewsAbi, getDexNewsAddress);
    const account = web3ProviderService.getAccount();
    const weiPrice = await aggregatorService.getWeiPrice();
    const weiAmount = Ethers.FixedNumber.from(amountInDolars).divUnsafe(weiPrice);
    const weiAmountStr = weiAmount.ceiling().toUnsafeFloat().toString();

    const gasEstimate = await dexNews.estimateGas.sendPostDonation(slug, {
      from: account,
      value: weiAmountStr,
    });

    await dexNews.sendPostDonation(slug, {
      from: account,
      gasLimit: gasEstimate.add(10),
      value: weiAmountStr,
    });

    web3ProviderService.refresh();
    this.refresh();
  }

  async withdrawForAuthor() {
    const dexNews = await web3ProviderService.makeContract<DexNews>(DexNewsAbi, getDexNewsAddress);
    const account = web3ProviderService.getAccount();
    const gasEstimate = await dexNews.estimateGas.withDrawForAuthor(account);

    await dexNews.withDrawForAuthor(account, {
      gasLimit: gasEstimate.add(10),
      from: account,
    });

    web3ProviderService.refresh();
    this.refresh();
  }

  async withdrawForOwner() {
    const dexNews = await web3ProviderService.makeContract<DexNews>(DexNewsAbi, getDexNewsAddress);
    const account = web3ProviderService.getAccount();
    const gasEstimate = await dexNews.estimateGas.withDrawForContractOwner(account);

    await dexNews.withDrawForContractOwner(account, {
      gasLimit: gasEstimate.add(5),
      from: account,
    });

    web3ProviderService.refresh();
    this.refresh();
  }

  postBySlug$(slug: string): Observable<PostWithAuthor | null> {
    return web3ProviderService.contract$<DexNews>(DexNewsAbi, getDexNewsAddress).pipe(
      switchMap(dexNews => {
        return timer(0, 30_000).pipe(
          switchMap(() =>
            defer(() => {
              return dexNews.getPostBySlug(slug).then(r => PostWithAuthorUtils.make(r));
            }),
          ),
        );
      }),
    );
  }

  authorProfile$(authorAddress: string): Observable<UserProfile | null> {
    return web3ProviderService.contract$<DexNews>(DexNewsAbi, getDexNewsAddress).pipe(
      switchMap(dexNews => {
        return timer(0, 90_000).pipe(
          switchMap(() =>
            defer(() => {
              return dexNews
                .getAuthorProfile(authorAddress)
                .then(r => UserProfileUtils.make({ ...r, address: authorAddress }));
            }),
          ),
        );
      }),
    );
  }

  async getUserProfile() {
    const dexNews = await web3ProviderService.makeContract<DexNews>(DexNewsAbi, getDexNewsAddress);
    return UserProfileUtils.make(await (dexNews.getUserProfile() as Promise<Partial<UserProfile>>));
  }

  async setUserProfile(profile: UserProfileUpdate) {
    const dexNews = await web3ProviderService.makeContract<DexNews>(DexNewsAbi, getDexNewsAddress);
    const account = web3ProviderService.getAccount();

    const gasEstimate = await dexNews.estimateGas.setUserProfile(
      profile.name,
      profile.profileDescription,
      profile.imageUrl,
      profile.bannerUrl,
      {
        from: account,
      },
    );

    await dexNews.setUserProfile(profile.name, profile.profileDescription, profile.imageUrl, profile.bannerUrl, {
      gasLimit: gasEstimate.add(5),
      from: account,
    });
  }

  async startPostValidation(postSlug: string) {
    const dexNews = await web3ProviderService.makeContract<DexNews>(DexNewsAbi, getDexNewsAddress);
    await dexNews.applyForPostValidator(postSlug);
  }

  async finishPostValidation(postSlug: string, score: number, comment: string) {
    const dexNews = await web3ProviderService.makeContract<DexNews>(DexNewsAbi, getDexNewsAddress);
    await dexNews.setPostValidationResult(postSlug, score, comment);
  }

  isValidatingPost$(postSlug: string) {
    return combineLatest([
      web3ProviderService.contract$<DexNews>(DexNewsAbi, getDexNewsAddress),
      web3ProviderService.account$,
      timer(0, 100_000),
    ]).pipe(
      switchMap(([DexNews, account]) =>
        defer(async () => {
          const Ethers = await lazyLibService.getEthers();

          if (!account) {
            return { isValidating: false, timeStamp: Ethers.BigNumber.from(0), isValidationDone: false };
          }

          const [isValidating, timeStamp, isValidationDone] = await DexNews.isValidatingPost(postSlug);
          return { isValidating, timeStamp, isValidationDone };
        }),
      ),
    );
  }

  async getLatestNews(page: number, category = ''): Promise<PostWithAuthor[]> {
    if (!web3ProviderService.isConnected()) {
      return [];
    }

    const dexNews = await web3ProviderService.makeContract<DexNews>(DexNewsAbi, getDexNewsAddress);

    return dexNews
      .getPostList(
        NO_ADDRESS,
        category,
        i18nService.getCurrentCountry().code,
        false,
        Math.max(1, POST_PAGE_SIZE * (page - 1) - 1),
        POST_PAGE_SIZE,
      )
      .then(async ({ '0': posts }) => {
        await lazyLibService.getEthers();
        return posts.map(e => PostWithAuthorUtils.make(e)).filter(Boolean);
      });
  }

  async searchNews(page: number, _title = '', category = '', authorAddress = NO_ADDRESS): Promise<PostWithAuthor[]> {
    if (!web3ProviderService.isConnected()) {
      return [];
    }

    const dexNews = await web3ProviderService.makeContract<DexNews>(DexNewsAbi, getDexNewsAddress);

    return dexNews
      .getPostList(
        authorAddress,
        category,
        i18nService.getCurrentCountry().code,
        false,
        Math.max(1, POST_PAGE_SIZE * (page - 1) - 1),
        POST_PAGE_SIZE,
      )
      .then(({ '0': posts }) => {
        return posts.map(e => PostWithAuthorUtils.make(e)).filter(Boolean);
      });
  }

  latestNews$(page: number): Observable<PostWithAuthor[]> {
    if (page === 1) {
      return this.latestNewsFirstPage$;
    }

    return combineLatest([
      web3ProviderService.contract$<DexNews>(DexNewsAbi, getDexNewsAddress),
      i18nService.currentCountry$,
      this.refreshCounter$,
    ]).pipe(
      switchMap(([dexNews, country]) => {
        return timer(0, 180_000).pipe(
          switchMap(() =>
            defer(() => {
              return dexNews
                .getPostList(NO_ADDRESS, '', country.code, false, POST_PAGE_SIZE * (page - 1), POST_PAGE_SIZE)
                .then(({ '0': posts }) => {
                  return posts.map(e => PostWithAuthorUtils.make(e)).filter(Boolean);
                });
            }),
          ),
        );
      }),
    );
  }

  makeCategories$() {
    return web3ProviderService.contract$<DexNews>(DexNewsAbi, getDexNewsAddress).pipe(
      switchMap(dexNews => {
        return timer(0, 10_000).pipe(switchMap(() => defer(() => dexNews.getCategoriesList())));
      }),
    );
  }

  makeCountries$(): Observable<Country[]> {
    return web3ProviderService.contract$<DexNews>(DexNewsAbi, getDexNewsAddress).pipe(
      switchMap(dexNews => {
        return timer(0, 10_000).pipe(
          switchMap(() =>
            defer(() =>
              dexNews.getCountriesList().then(list => list.map(code => COUNTRY_CODE_MAP[code]).sort(CountrySort)),
            ),
          ),
        );
      }),
    );
  }

  makeAuthorBalance$() {
    return combineLatest([
      web3ProviderService.contract$<DexNews>(DexNewsAbi, getDexNewsAddress),
      aggregatorService.weiPrice$,
      this.refreshCounter$,
    ]).pipe(
      switchMap(([dexNews, weiPrice]) => {
        return timer(0, 10_000).pipe(
          switchMap(() =>
            defer(() =>
              dexNews.getBalanceForAuthor().then(async value => {
                return weiPrice.mulUnsafe(lazyLibService.getCachedEthers().FixedNumber.from(value));
              }),
            ),
          ),
        );
      }),
    );
  }

  makeContractOwner$() {
    return web3ProviderService
      .contract$<DexNews>(DexNewsAbi, getDexNewsAddress)
      .pipe(switchMap(dexNews => defer(() => dexNews.contractOwner())));
  }

  makeContractOwnerBalance$() {
    return combineLatest([
      web3ProviderService.contract$<DexNews>(DexNewsAbi, getDexNewsAddress),
      aggregatorService.weiPrice$,
      this.refreshCounter$,
    ]).pipe(
      switchMap(([dexNews, weiPrice]) => {
        return timer(0, 30_000).pipe(
          switchMap(() =>
            defer(() =>
              dexNews.getBalanceForContractOwner().then(async value => {
                return weiPrice.mulUnsafe(lazyLibService.getCachedEthers().FixedNumber.from(value));
              }),
            ),
          ),
        );
      }),
    );
  }

  makeProfile$() {
    return combineLatest([
      web3ProviderService.contract$<DexNews>(DexNewsAbi, getDexNewsAddress),
      web3ProviderService.account$,
      this.refreshCounter$,
    ]).pipe(
      switchMap(([dexNews, account]) => {
        return timer(0, 30_000).pipe(
          switchMap(() =>
            defer(() => {
              if (!account) {
                return null;
              }

              return dexNews.getUserProfile().then(r => UserProfileUtils.make(r));
            }),
          ),
        );
      }),
    );
  }

  makeLatestNewsFirstPage$() {
    return combineLatest([
      web3ProviderService.contract$<DexNews>(DexNewsAbi, getDexNewsAddress),
      i18nService.currentCountry$,
      this.refreshCounter$,
      timer(0, 180_000),
    ]).pipe(
      distinctUntilChanged(),
      switchMap(([dexNews, country]) => {
        return defer(() => {
          return dexNews.getPostList(NO_ADDRESS, '', country.code, false, 0, POST_PAGE_SIZE).then(({ '0': posts }) => {
            return posts.map(e => PostWithAuthorUtils.make(e)).filter(Boolean);
          });
        });
      }),
      shareReplay(1),
    );
  }

  refresh() {
    this.refreshCounterSubject.next(Date.now());
  }
}

export const dexNewsService = new DexNewsService();
