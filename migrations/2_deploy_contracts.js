const Euro = artifacts.require('Euro');
module.exports = function (deployer, network, accounts) {
  const initialAccount = accounts[0];
  deployer.deploy(Euro, 'EURO coin', 'EURC', 6, initialAccount, 100000000);
};
