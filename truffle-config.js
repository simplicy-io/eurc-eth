/* eslint-disable */
const { mnemonic, projectId, bscApiKey, privateKey } = require('./secrets.json');
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '43',
    },
    moonbean_dev: {
      provider: () => new HDWalletProvider(mnemonic, `http://localhost:9933/`),
      network_id: 43,
    },
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${projectId}`),
      network_id: 3,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${projectId}`),
      network_id: 4, 
      skipDryRun: true,
    },
    kovan: {
      provider: () => new HDWalletProvider(mnemonic, `https://kovan.infura.io/v3/${projectId}`),
      network_id: 42,
      skipDryRun: true,
    },
    binance_testnet: {
      provider: () => new HDWalletProvider(mnemonic, `https://data-seed-prebsc-1-s1.binance.org:8545`),
      network_id: 97,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    bsc: {
      provider: () => new HDWalletProvider(mnemonic, `https://bsc-dataseed1.binance.org`),
      network_id: 56,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    moonbase: {
      provider: () => new HDWalletProvider(privateKey, `https://rpc.testnet.moonbeam.network`),
      network_id: 1287,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  mocha: {
    timeout: 100000
  },
  compilers: {
    solc: {
      version: '0.8.0',
    },
  },
  plugins: [
    'truffle-plugin-verify',
    'moonbeam-truffle-plugin'
  ],
  api_keys: {
    bscscan: bscApiKey
  }
};
