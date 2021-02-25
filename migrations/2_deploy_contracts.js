const Euro = artifacts.require('Euro');
module.exports = function (deployer, network, accounts) {
  const initialAccount = accounts[0];
  const minter = accounts[1];
  const burner = accounts[2];
  deployer.deploy(Euro, 'EURO coin', 'EURC', 6, 'https://eurc.simplicy.io/',initialAccount, 100000000, minter, burner);
};
