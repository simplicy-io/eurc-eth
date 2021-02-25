# EUR-ETH 
EUR is an ERC-20 stablecoin - Smart contract of digital EUR on Ethereum Blockchain


## Overview
The EURC smart contract used OpenZeppelin which is library for secure smart contract development.

## Installation
The guides in the [OpenZeppelin docs site](https://docs.openzeppelin.com/learn/developing-smart-contracts) will teach how to deploy and interaction to smart contract.

## Step by Step Installation using Truffle
1. Make sure you have node v12.8.3 or higher, check it with
```
node --version
```

2. Install packages
```
yarn
```

4. Download, install and open [Ganache](https://www.trufflesuite.com/ganache)

5. Compile solidity with truffle
```
yarn truffle compile
```

5. Deploy smart contracts to your localhost Ethereum Ganache
```
yarn truffle migrate --network development
```

result of your deployment:
```
Starting migrations...
======================
> Network name:    'development'
> Network id:      5777
> Block gas limit: 6721975 (0x6691b7)


1_initial_migration.js
======================

Replacing 'Migrations'
----------------------
> transaction hash:    0x22f3d8f6b36baa7d55484e497119ae494c226b2ac0868ff8f149cf46c613035f
> Blocks: 0            Seconds: 0
> contract address:    0x0569F5E69aaD81a62d91D927995621EF13AA2d7F
> block number:        1
> block timestamp:     1611340650
> account:             0x7904bF7aC4EdC845b2057d2F44A1D19e33468ce5
> balance:             99.99626074
> gas used:            186963 (0x2da53)
> gas price:           20 gwei
> value sent:          0 ETH
> total cost:          0.00373926 ETH


> Saving migration to chain.
> Saving artifacts
   -------------------------------------
> Total cost:          0.00373926 ETH


2_deploy_contracts.js
=====================

Replacing 'Euro'
----------------
> transaction hash:    0x6df413a4b34331bc5ab4f4366ad57dcbc60fcfb1da2c72e94c79cb9e8bc4e9a6
> Blocks: 0            Seconds: 0
> contract address:    0x6E01BF5B1003833DFB4D6237821FD49a48b1446D
> block number:        3
> block timestamp:     1611340650
> account:             0x7904bF7aC4EdC845b2057d2F44A1D19e33468ce5
> balance:             99.95791582
> gas used:            1874911 (0x1c9bdf)
> gas price:           20 gwei
> value sent:          0 ETH
> total cost:          0.03749822 ETH


> Saving migration to chain.
> Saving artifacts
   -------------------------------------
> Total cost:          0.03749822 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0.04123748 ETH
```

## Interacting from the Console
```
$ yarn truffle console --network development
truffle(development)> Euro = await Euro.deployed()
undefined
```

### Minting Euro coin 
Use Owner adres for examample:0x7904bF7aC4EdC845b2057d2F44A1D19e33468ce5
Minting 500 Euro coins:
We are using 6 decimals which means 500000000 to mint
```
$ truffle(development)> await Euro.mint("0x7904bF7aC4EdC845b2057d2F44A1D19e33468ce5", 500000000)
```

### Sending Euro coin to User
See also [OpenZeppelin documentation](https://docs.openzeppelin.com/contracts/3.x/api/token/erc20)
transfer(address recipient, uint256 amount)

User adress example: 0xd7ab3436414E7412c004811ec960c908d34704ef
```
$ truffle(development)> await Euro.transfer("0xd7ab3436414E7412c004811ec960c908d34704ef", 500000000)
```

## Import Account to metamask
See also [this medium blog](https://medium.com/@kacharlabhargav21/using-ganache-with-remix-and-metamask-446fe5748ccf)

## Add Euro coin to metamask
Make sure you change your network to Ganache Development in Metamask and read [this blog](https://metamask.zendesk.com/hc/en-us/articles/360015489031-How-to-View-See-Your-Tokens-and-Custom-Tokens-in-Metamask)


## Testing and linting
Running unit test
```
yarn test
```

Running test coverage
```
yarn coverage
```

Lint solidity
```
yarn lint:sol
```

## Connecting to public test networks
see also [Connecting to public test networks](https://docs.openzeppelin.com/learn/connecting-to-public-test-networks)

### Create a new account 
To send transactions in a testnet, you will need a new Ethereum account using mnemonics package
```
yarn mnemonics
drama film snack motion ...
```

### Copy and change secrets
```
cp secrets.json.example secrets.json
```

Copy your mnemonics words to secret.json

### Get Alchemyapi Key and copy your API KEY
https://www.alchemyapi.io/
Copy your API KEY to secret.json

### Get funds
Using [Rinkeby Authenticated Faucet](https://faucet.rinkeby.io/)
or using [MetaMask’s faucet](https://faucet.metamask.io/)

### Deploy and migrate to rinkeby
```
yarn truffle migrate --network rinkeby
```

### Deploy and migrate to Ropsten
```
yarn truffle migrate --network ropsten
```

### Deploy and migrate to Binance testnet
```
yarn truffle migrate --network binance_testnet
```


## Verify your contract on Binance Smart Chain


1. Generate an API Key on your BSCscan account

If you don't have one yet, just go to [this page](https://bscscan.com/login) to sign up.


Add your BSCscan API key to your secrets.json


2.  Deploy your contract

```
truffle compile
truffle migrate --network binance_testnet
```

3. Verify your contract

```
truffle run verify BEP20Token@{deployed-address} --network binance_testnet

```

## Step by Step Installation Moonbean using Truffle
1. Make sure you have node v15.8.0 or higher, check it with
```
node --version
```

2. Install packages
```
yarn
```

3. Run a Standalone Moonbean TestNet
```
truffle run moonbeam install
```
4. Start the Standalone Moonbean TestNet
```
Node has started - Endpoints: HTTP http://127.0.0.1:9933  WS ws://127.0.0.1:9944 - Container ID 7804c8f439c9 
```

5. Compile solidity with truffle
```
yarn truffle compile
```

5. Deploy smart contracts to your localhost Ethereum Ganache
```
truffle migrate --network moonbean_dev
```

### Deploy and migrate to Moonbean testnet
```
yarn truffle migrate --network moonbase
```

## Security

If you find a security issue, please join our Discord

## Developer Resources


- Ask for help and follow progress at: Discord

Interested in contributing to EURC?

- Issue tracker: [issues](https://github.com/simplicy-io/eurc-eth/issues)
- Contribution guidelines: [contributing](https://github.com/simplicy-io/eurc-eth/blob/master/CONTRIBUTING.md)


## License
Code released under the [MIT License](https://github.com/simplicy-io/eurc-eth/blob/master/LICENSE).
