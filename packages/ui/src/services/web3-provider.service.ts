import { BehaviorSubject, combineLatest, defer, NEVER, Observable, timer } from 'rxjs';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import { loggingService } from './Logging.service';
import { lazyLibService } from './Ethers.service';
import StatusWalletIcon from 'assets/status_logo.png';
import type { JsonRpcProvider, ExternalProvider, Network } from '@ethersproject/providers';
import type { Contract, ContractInterface } from '@ethersproject/contracts';
import type { FixedNumber } from '@ethersproject/bignumber';
import type Web3Modal from 'web3modal_async';

const isDevelopment = process.env.NODE_ENV === 'development';

class Web3ProviderService {
  // private modal: Web3Modal;
  private readonly providerSubject: BehaviorSubject<JsonRpcProvider | null>;
  private readonly networkSubject: BehaviorSubject<Network | null>;
  private readonly accountSubject: BehaviorSubject<string>;
  private readonly refresherSubject: BehaviorSubject<number>;
  private developmentProvider: JsonRpcProvider | null;
  private readonly modalSubject: BehaviorSubject<Web3Modal | null>;

  public readonly accountBalanceInWei$: Observable<FixedNumber>;
  public readonly accountBalanceInEth$: Observable<FixedNumber>;

  public readonly account$: Observable<string>;
  public readonly provider$: Observable<JsonRpcProvider>;
  public readonly network$: Observable<Network>;
  public readonly refreshHash$: Observable<number>;
  private contractCache: Map<(chainId: string | number) => string, Observable<unknown>>;

  constructor() {
    this.developmentProvider = null;
    this.providerSubject = new BehaviorSubject<JsonRpcProvider | null>(null);
    this.accountSubject = new BehaviorSubject<string>('');
    this.networkSubject = new BehaviorSubject<Network | null>(null);
    this.refresherSubject = new BehaviorSubject<number>(0);
    this.modalSubject = new BehaviorSubject<Web3Modal | null>(null);
    this.refreshHash$ = this.makeRefreshHash$();
    this.account$ = this.makeAccount$();
    this.provider$ = this.makeProvider$();
    this.network$ = this.makeNetwork$();
    this.accountBalanceInWei$ = this.makeAccountBalanceInWei$();
    this.accountBalanceInEth$ = this.makeAccountBalanceInEth$();
    this.contractCache = new Map();
    const resetContractCache = () => {
      this.contractCache = new Map();
    };

    this.account$.subscribe(resetContractCache);
    this.network$.subscribe(resetContractCache);
    this.provider$.subscribe(resetContractCache);

    this.createDevelopmentProvider().then(provider => {
      this.developmentProvider = provider;
      const defaultProvider = this.createDefaultProvider();
      this.providerSubject.next(defaultProvider);

      defaultProvider?.getNetwork().then(network => {
        this.networkSubject.next(network);
      });
    });

    import('web3modal_async').then(web3ModalModule => {
      const isStatusWallet = Boolean(window?.ethereum?.isStatus);

      const modal = new web3ModalModule.default({
        disableInjectedProvider: false,
        cacheProvider: false,
        providerOptions: {
          walletconnect: {
            packageFactory: async () => {
              return (await import('@walletconnect/web3-provider')).default;
            },
            options: {
              infuraId: process.env.INFURA_ID,
            },
          },
          fortmatic: {
            packageFactory: async () => {
              return (await import('fortmatic')).default;
            },
            options: {
              key: process.env.FORTMATIC_KEY,
            },
          },
          portis: {
            packageFactory: async () => {
              return (await import('@portis/web3/lib')).default;
            },
            options: {
              id: process.env.PORTIS_KEY,
            },
          },
          burnerconnect: {
            packageFactory: async () => {
              return (await import('@burner-wallet/burner-connect-provider')).default;
            },
          },
          torus: {
            packageFactory: async () => {
              return (await import('@toruslabs/torus-embed')).default;
            },
          },
          authereum: {
            packageFactory: async () => {
              return (await import('authereum')).default;
            },
          },
          bitski: {
            packageFactory: async () => {
              return (await import('bitski')).default;
            },
            options: {
              clientId: process.env.BITSTKI_CLIENT_ID,
              callbackUrl: process.env.BITSTKI_CALLBACK_URL,
            },
          },
          ...(isDevelopment
            ? {
                'custom-ganache': {
                  display: {
                    logo: 'https://raw.githubusercontent.com/trufflesuite/ganache-cli/develop/resources/icons/ganache-cli-128x128.png',
                    name: 'Ganache',
                    description: 'Connect to your local ganache development server',
                  },
                  package: {},
                  connector: async () => {
                    return this.developmentProvider;
                  },
                },
              }
            : {}),
          ...(isStatusWallet
            ? {
                'custom-status': {
                  display: {
                    logo: StatusWalletIcon,
                    name: 'Status',
                    description: 'Connect with your status wallet',
                  },
                  package: {},
                  connector: async () => {
                    await window.ethereum.enable();
                    return window.ethereum;
                  },
                },
              }
            : {}),
        },
      });
      modal.clearCachedProvider();
      this.modalSubject.next(modal);
    });
  }

  async createDevelopmentProvider() {
    const ethers = await lazyLibService.getEthers();
    if (isDevelopment) {
      return new ethers.JsonRpcProvider(`${window.location.origin}/ganache-provider`);
    }
    return null;
  }

  createDefaultProvider(): JsonRpcProvider | null {
    if (isDevelopment) {
      return this.developmentProvider;
    }
    return null;
  }

  async connect() {
    const [ethers, baseProvider]: [typeof window['Ethers'], JsonRpcProvider | ExternalProvider] = await Promise.all([
      lazyLibService.getEthers(),
      this.modalSubject.getValue()?.connect(),
    ]);

    const provider =
      baseProvider === this.developmentProvider
        ? this.developmentProvider
        : new ethers.Web3Provider(baseProvider as ExternalProvider);

    let providerToListenOn = provider;

    if ('on' in baseProvider) {
      providerToListenOn = baseProvider;
    }

    if ('on' in providerToListenOn) {
      providerToListenOn.on('networkChanged', (() => {
        this.providerSubject
          .getValue()
          ?.getNetwork()
          .then(network => {
            this.networkSubject.next(network);
          });
      }) as any);

      providerToListenOn.on('chainChanged', (() => {
        this.providerSubject
          .getValue()
          ?.getNetwork()
          .then(network => {
            this.networkSubject.next(network);
          });
      }) as any);

      providerToListenOn.on('accountsChanged', ((accounts: string[]) => {
        this.providerSubject
          .getValue()
          ?.getNetwork()
          .then(network => {
            this.networkSubject.next(network);
          });
        this.accountSubject.next(accounts?.[0] || '');
      }) as any);

      providerToListenOn.on('disconnect', ((error: { code: number; message: string }) => {
        this.disconnect();
        loggingService.logException(new Error(error.message));
      }) as any);
    }

    const account = await provider.getSigner().getAddress();

    this.providerSubject.next(provider);
    provider.getNetwork().then(network => this.networkSubject.next(network));
    this.accountSubject.next(account);
  }

  getProvider(): JsonRpcProvider | null {
    if (!this.providerSubject.getValue()) {
      throw new Error('No wallet is connected!');
    }
    return this.providerSubject.getValue();
  }

  getAccount(): string {
    if (!this.providerSubject.getValue()) {
      throw new Error('No wallet is connected!');
    }
    return this.accountSubject.getValue();
  }

  private makeAccount$() {
    return this.accountSubject.asObservable();
  }

  private makeProvider$() {
    return this.providerSubject.asObservable();
  }

  private makeNetwork$() {
    return this.networkSubject.asObservable();
  }

  private makeAccountBalanceInEth$() {
    return combineLatest([this.account$, this.refreshHash$]).pipe(
      switchMap(([account]) => {
        const provider = this.providerSubject.getValue();
        if (account && provider) {
          return timer(0, 10_000).pipe(
            switchMap(() =>
              defer(async () => {
                const Ethers = lazyLibService.getCachedEthers();
                const value = await provider.getBalance(account);
                return Ethers.FixedNumber.from(value).divUnsafe(
                  Ethers.FixedNumber.from(Ethers.BigNumber.from(10).pow(18)),
                );
              }),
            ),
          );
        }
        return NEVER;
      }),
    );
  }

  private makeAccountBalanceInWei$() {
    return combineLatest([this.account$, timer(0, 10000), this.refreshHash$]).pipe(
      switchMap(([account]) => {
        const provider = this.providerSubject.getValue();
        if (account && provider) {
          return defer(async () => {
            const Ethers = lazyLibService.getCachedEthers();
            const value = await provider.getBalance(account);
            return Ethers.FixedNumber.from(value);
          });
        }
        return NEVER;
      }),
    );
  }

  contract$<InstanceInterface extends Contract>(
    abi: ContractInterface,
    addressGetter: (chainId: string | number) => string,
  ) {
    const cachedContract = this.contractCache.get(addressGetter);

    if (cachedContract) {
      return cachedContract as Observable<InstanceInterface>;
    }

    const contractObs = combineLatest([this.provider$, this.network$]).pipe(
      distinctUntilChanged(),
      switchMap(([provider, network]) => {
        if (!provider || !network) {
          return NEVER;
        }
        return defer(async () => {
          const ethers = await lazyLibService.getEthers();
          return new ethers.Contract(addressGetter(network.chainId), abi, provider.getSigner()) as InstanceInterface;
        });
      }),
    );

    this.contractCache.set(addressGetter, contractObs);

    return contractObs;
  }

  async makeContract<InstanceInterface extends Contract>(
    abi: ContractInterface,
    addressGetter: (chainId: string | number) => string,
  ) {
    const ethers = await lazyLibService.getEthers();
    const provider = this.providerSubject.getValue();
    const network = await provider?.getNetwork();

    if (!provider) {
      throw new Error('No wallet is connected!');
    }

    return new ethers.Contract(addressGetter(network.chainId), abi, provider.getSigner()) as InstanceInterface;
  }

  disconnect() {
    this.modalSubject.getValue()?.clearCachedProvider();
    this.accountSubject.next('');
    this.providerSubject.next(this.createDefaultProvider());
    this.networkSubject.next(null);
  }

  refresh() {
    this.refresherSubject.next(Date.now());
  }

  isConnected() {
    return Boolean(this.providerSubject.getValue());
  }

  private makeRefreshHash$() {
    return this.refresherSubject.asObservable();
  }
}

export const web3ProviderService = new Web3ProviderService();
