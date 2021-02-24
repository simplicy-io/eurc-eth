const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const { expect } = require('chai');

const Euro = artifacts.require('Euro');

contract('Euro', function (accounts) {
  const [ owner, minter, burner, other ] = accounts;

  const name = 'Euro stable coin';
  const symbol = 'EURC';
  const decimals = 6;
  const uri = 'https://eurc.simplicy.io/bank-balance';

  const initialSupply = new BN(100);

  beforeEach(async function () {
    this.ownable = await Euro.new(name, symbol, decimals, uri, owner, initialSupply, minter, burner, { from: owner });
  });

  it('has an owner', async function () {
    expect(await this.ownable.owner()).to.equal(owner);
  });

  describe('transfer ownership', function () {
    it('changes owner after transfer', async function () {
      const receipt = await this.ownable.transferOwnership(other, { from: owner });
      expectEvent(receipt, 'OwnershipTransferred');

      expect(await this.ownable.owner()).to.equal(other);
    });

    it('prevents non-owners from transferring', async function () {
      await expectRevert(
        this.ownable.transferOwnership(other, { from: other }),
        'Ownable: caller is not the owner',
      );
    });

    it('guards ownership against stuck state', async function () {
      await expectRevert(
        this.ownable.transferOwnership(ZERO_ADDRESS, { from: owner }),
        'Ownable: new owner is the zero address',
      );
    });
  });

  describe('renounce ownership', function () {
    it('loses owner after renouncement', async function () {
      const receipt = await this.ownable.renounceOwnership({ from: owner });
      expectEvent(receipt, 'OwnershipTransferred');

      expect(await this.ownable.owner()).to.equal(ZERO_ADDRESS);
    });

    it('prevents non-owners from renouncement', async function () {
      await expectRevert(
        this.ownable.renounceOwnership({ from: other }),
        'Ownable: caller is not the owner',
      );
    });
  });
});
