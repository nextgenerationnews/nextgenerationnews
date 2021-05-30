const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = process.env.AUTH_MNEMONIC;
const deployUrl = process.env.DEPLOY_URL;

const providerFactory = function () {
  if (!mnemonic) {
    throw new Error('Mnemonic not provided! Please use the AUTH_MNEMONIC environment variable');
  }
  if (!deployUrl) {
    throw new Error('Mnemonic not provided! Please use the DEPLOY_URL environment variable');
  }
  const provider = new HDWalletProvider({
    mnemonic,
    providerOrUrl: deployUrl,
    addressIndex: 0,
  });

  return provider;
};

module.exports = {
  migrations_directory: './build/migrations',
  compilers: {
    solc: {
      version: '0.8.4',
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '1337',
      gas: 9999999,
      ganacheOptions: {
        chainId: '1337',
        default_balance_ether: 500,
      },
    },
    test: {
      host: '127.0.0.1',
      port: 8546,
      network_id: '9998',
      gas: 9999999,
      gasPrice: 100,
    },
    main: {
      provider: providerFactory,
      network_id: '1',
    },
    rinkeby: {
      provider: providerFactory,
      network_id: '4',
    },
    kovan: {
      provider: providerFactory,
      network_id: '42',
    },
  },
};
