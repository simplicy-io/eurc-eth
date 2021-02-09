/* eslint-disable */
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction
const { alchemyApiKey, mnemonic, projectId, privateKey } = require('./secrets.json');
//const rpcURL = `https://eth-kovan.alchemyapi.io/v2/${alchemyApiKey}`;
var web3 = new Web3(new Web3.providers.HttpProvider(`https://eth-kovan.alchemyapi.io/v2/${alchemyApiKey}`))

const owner = "0xdaa3249E3e5Ed1C2C70D73A860D0f2338C353527";
const euroAddress = "0xA9549EB9AE5a98EbD8D6d7EC987274fF89BFa832";

let amount = web3.utils.toBN(5);

// get transaction count, later will used as nonce
web3.eth.getTransactionCount(owner).then(function(v){console.log(v); count = v})  

// get transaction count, later will used as nonce
let count = web3.eth.getTransactionCount(owner).then(function(v){console.log(v); count = v})  


// set your private key here, we'll sign the transaction below
var newPrivateKey = new Buffer(privateKey, 'hex')   

var contractABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name_",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "symbol_",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "addedValue",
          "type": "uint256"
        }
      ],
      "name": "increaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "subtractedValue",
          "type": "uint256"
        }
      ],
      "name": "decreaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];



web3.eth.getBalance(owner, (err, wei) => {
    balance = web3.utils.fromWei(wei, 'ether')
    console.log('Ether Balance= ' +balance);
})

var euro = new web3.eth.Contract(contractABI, euroAddress, {from: owner});


euro.methods.name().call(function (err, res) {
    if (err) {
      console.log("An error occured", err)
      return
    }
    console.log("The name is: ", res)
});

euro.methods.totalSupply().call(function (err, res) {
    if (err) {
      console.log("An error occured", err)
      return
    }
    console.log("The totalSupply is: ", res)
});


const receiverAddress = "0x821e28109872cad442da8d8335be37d317d4f1e7";

  euro.methods.balanceOf(owner).call(function (err, res) {
    if (err) {
      console.log("An error occured", err)
      return
    }
    console.log("The balance of " +owner +" is :", res)
});


var address2 = "0x11B9183206d2a99D5fF3Ac4a9279F0932Ae00CAc";

euro.methods.balanceOf(address2).call(function (err, res) {
    if (err) {
      console.log("An error occured", err)
      return
    }
    console.log("The balance of " +address2 +" is :", res)
});

var rawTransaction = {"from":owner, "gasPrice":web3.utils.toHex(2 * 1e9),"gasLimit":web3.utils.toHex(210000),"to":euroAddress,"value":"0x0","data":euro.methods.transfer(receiverAddress, amount).encodeABI(), "nonce":web3.utils.toHex(count)} 

var transaction = new EthereumTx(rawTransaction, { chain: 'kovan', hardfork: 'constantinople' })
transaction.sign(newPrivateKey)

web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
