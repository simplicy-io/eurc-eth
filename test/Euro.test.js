const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { ZERO_ADDRESS } = constants;

const Euro = artifacts.require('Euro');

const {
  shouldBehaveLikeERC20,
  shouldBehaveLikeERC20Transfer,
  shouldBehaveLikeERC20Approve,
} = require('./behaviors/ERC20.behavior');

contract('Euro', function (accounts) {
  const [ initialHolder, minter, burner, recipient, anotherAccount, ...otherAccounts ] = accounts;

  const name = 'Euro stable coin';
  const symbol = 'EURC';
  const decimals = 6;
  const uri = 'https://eurc.simplicy.io/';
  const newUri = 'https://eurc.simplicy.io/new';

  const initialSupply = new BN(100);

  beforeEach(async function () {
    this.token = await Euro.new(
      name,
      symbol,
      decimals,
      uri,
      initialHolder,
      initialSupply,
      minter,
      burner,
      { from: initialHolder },
    );
  });

  it('has a name', async function () {
    expect(await this.token.name()).to.equal(name);
  });

  it('has a symbol', async function () {
    expect(await this.token.symbol()).to.equal(symbol);
  });

  it('has 6 decimals', async function () {
    expect(await this.token.decimals()).to.be.bignumber.equal('6');
  });

  it('has uri', async function () {
    expect(await this.token.uri()).to.equal(uri);
  });

  describe('setUrl', function () {
    it(' URI can be set', async function () {
      await this.token.setUrl(newUri, { from : initialHolder });
      expect(await this.token.uri()).to.equal(newUri);
    });
  });

  describe('mint', function () {
    it('Mint #1 should start with a totalSupply of initialSupply', async function () {
      expect(await this.token.totalSupply()).to.be.bignumber.equal(initialSupply);
    });

    it('Mint #2 should return mintingFinished false after construction', async function () {
      assert.equal(await this.token.mintingFinished(), false);
    });

    it('Mint #3 should mint a given amount of tokens to a given address', async function () {
      assert.equal(await this.token.balanceOf(recipient), 0);

      await this.token.mint(recipient, 100, { from: minter });

      assert.equal(await this.token.balanceOf(recipient), 100);
      assert.equal(await this.token.totalSupply(), 200);
    });

    it('Mint #4 should fail to mint after call to finishMinting', async function () {
      assert.equal(await this.token.balanceOf(recipient), 0);

      await this.token.finishMinting({ from: initialHolder });
      assert.equal(await this.token.mintingFinished({ from: minter }), true);
      await expectRevert(this.token.mint(recipient, initialSupply, { from: minter }), 'Euro: mint is finished');

      assert.equal(await this.token.balanceOf(recipient), 0);
    });
    it('Mint #5 should fail to mint from non minter account', async function () {
      await expectRevert(
        this.token.mint(recipient, 100), 'Euro: Caller is not a minter',
      );
    });
  });

  describe('burn', function () {
    it('Burn #1 should start with a totalSupply of initialSupply', async function () {
      expect(await this.token.totalSupply()).to.be.bignumber.equal(initialSupply);
    });

    it('Burn #2 should return burningFinished false after construction', async function () {
      assert.equal(await this.token.burningFinished(), false);
    });

    it('Burn #3 should burn a given amount of tokens', async function () {
      expect(await this.token.balanceOf(initialHolder)).to.be.bignumber.equal(initialSupply);

      ({ logs: this.logs } = await this.token.burn(new BN(5), { from: burner }));
      assert.equal(await this.token.balanceOf(initialHolder), initialSupply - new BN(5));
      assert.equal(await this.token.totalSupply(), initialSupply - new BN(5));
    });
    it('Burn #4 should fail to burn after call to finishBurning', async function () {
      expect(await this.token.balanceOf(initialHolder)).to.be.bignumber.equal(initialSupply);

      await this.token.finishBurning({ from: initialHolder });
      assert.equal(await this.token.burningFinished({ from: burner }), true);
      await expectRevert(this.token.burn(initialSupply, { from: burner }), 'Euro: burn is finished');

      expect(await this.token.balanceOf(initialHolder)).to.be.bignumber.equal(initialSupply);
    });
    it('Burn #5 should fail to burn from non burner account', async function () {
      await expectRevert(
        this.token.burn(initialSupply, { from: otherAccounts[0] }), 'Euro: Caller is not a burner',
      );
    });
    it('Burn #6 should fail to burn whe given amount is greater than the totalSupply', async function () {
      await expectRevert(
        this.token.burn(initialSupply.addn(1), { from: burner }), 'ERC20: burn amount exceeds balance',
      );
    });
  });

  shouldBehaveLikeERC20('ERC20', initialSupply, initialHolder, recipient, anotherAccount);

  describe('decrease allowance', function () {
    describe('when the spender is not the zero address', function () {
      const spender = recipient;

      function shouldDecreaseApproval (amount) {
        describe('when there was no approved amount before', function () {
          it('reverts', async function () {
            await expectRevert(this.token.decreaseAllowance(
              spender, amount, { from: initialHolder }), 'ERC20: decreased allowance below zero',
            );
          });
        });

        describe('when the spender had an approved amount', function () {
          const approvedAmount = amount;

          beforeEach(async function () {
            ({ logs: this.logs } = await this.token.approve(spender, approvedAmount, { from: initialHolder }));
          });

          it('emits an approval event', async function () {
            const { logs } = await this.token.decreaseAllowance(spender, approvedAmount, { from: initialHolder });

            expectEvent.inLogs(logs, 'Approval', {
              owner: initialHolder,
              spender: spender,
              value: new BN(0),
            });
          });

          it('decreases the spender allowance subtracting the requested amount', async function () {
            await this.token.decreaseAllowance(spender, approvedAmount.subn(1), { from: initialHolder });

            expect(await this.token.allowance(initialHolder, spender)).to.be.bignumber.equal('1');
          });

          it('sets the allowance to zero when all allowance is removed', async function () {
            await this.token.decreaseAllowance(spender, approvedAmount, { from: initialHolder });
            expect(await this.token.allowance(initialHolder, spender)).to.be.bignumber.equal('0');
          });

          it('reverts when more than the full allowance is removed', async function () {
            await expectRevert(
              this.token.decreaseAllowance(spender, approvedAmount.addn(1), { from: initialHolder }),
              'ERC20: decreased allowance below zero',
            );
          });
        });
      }

      describe('when the sender has enough balance', function () {
        const amount = initialSupply;

        shouldDecreaseApproval(amount);
      });

      describe('when the sender does not have enough balance', function () {
        const amount = initialSupply.addn(1);

        shouldDecreaseApproval(amount);
      });
    });

    describe('when the spender is the zero address', function () {
      const amount = initialSupply;
      const spender = ZERO_ADDRESS;

      it('reverts', async function () {
        await expectRevert(this.token.decreaseAllowance(
          spender, amount, { from: initialHolder }), 'ERC20: decreased allowance below zero',
        );
      });
    });
  });

  describe('increase allowance', function () {
    const amount = initialSupply;

    describe('when the spender is not the zero address', function () {
      const spender = recipient;

      describe('when the sender has enough balance', function () {
        it('emits an approval event', async function () {
          const { logs } = await this.token.increaseAllowance(spender, amount, { from: initialHolder });

          expectEvent.inLogs(logs, 'Approval', {
            owner: initialHolder,
            spender: spender,
            value: amount,
          });
        });

        describe('when there was no approved amount before', function () {
          it('approves the requested amount', async function () {
            await this.token.increaseAllowance(spender, amount, { from: initialHolder });

            expect(await this.token.allowance(initialHolder, spender)).to.be.bignumber.equal(amount);
          });
        });

        describe('when the spender had an approved amount', function () {
          beforeEach(async function () {
            await this.token.approve(spender, new BN(1), { from: initialHolder });
          });

          it('increases the spender allowance adding the requested amount', async function () {
            await this.token.increaseAllowance(spender, amount, { from: initialHolder });

            expect(await this.token.allowance(initialHolder, spender)).to.be.bignumber.equal(amount.addn(1));
          });
        });
      });

      describe('when the sender does not have enough balance', function () {
        const amount = initialSupply.addn(1);

        it('emits an approval event', async function () {
          const { logs } = await this.token.increaseAllowance(spender, amount, { from: initialHolder });

          expectEvent.inLogs(logs, 'Approval', {
            owner: initialHolder,
            spender: spender,
            value: amount,
          });
        });

        describe('when there was no approved amount before', function () {
          it('approves the requested amount', async function () {
            await this.token.increaseAllowance(spender, amount, { from: initialHolder });

            expect(await this.token.allowance(initialHolder, spender)).to.be.bignumber.equal(amount);
          });
        });

        describe('when the spender had an approved amount', function () {
          beforeEach(async function () {
            await this.token.approve(spender, new BN(1), { from: initialHolder });
          });

          it('increases the spender allowance adding the requested amount', async function () {
            await this.token.increaseAllowance(spender, amount, { from: initialHolder });

            expect(await this.token.allowance(initialHolder, spender)).to.be.bignumber.equal(amount.addn(1));
          });
        });
      });
    });

    describe('when the spender is the zero address', function () {
      const spender = ZERO_ADDRESS;

      it('reverts', async function () {
        await expectRevert(
          this.token.increaseAllowance(spender, amount, { from: initialHolder }), 'ERC20: approve to the zero address',
        );
      });
    });
  });

  describe('_mint', function () {
    const amount = new BN(50);
    it('rejects a null account', async function () {
      await expectRevert(
        this.token.mint(ZERO_ADDRESS, amount, { from: minter }), 'ERC20: mint to the zero address',
      );
    });

    describe('for a non zero account', function () {
      beforeEach('minting', async function () {
        const { logs } = await this.token.mint(recipient, amount, { from: minter });
        this.logs = logs;
      });

      it('increments totalSupply', async function () {
        const expectedSupply = initialSupply.add(amount);
        expect(await this.token.totalSupply()).to.be.bignumber.equal(expectedSupply);
      });

      it('increments recipient balance', async function () {
        expect(await this.token.balanceOf(recipient)).to.be.bignumber.equal(amount);
      });

      it('emits Transfer event', async function () {
        const event = expectEvent.inLogs(this.logs, 'Transfer', {
          from: ZERO_ADDRESS,
          to: recipient,
        });

        expect(event.args.value).to.be.bignumber.equal(amount);
      });
    });
  });

  describe('_burn', function () {
    describe('for a non zero account', function () {
      it('rejects burning more than balance', async function () {
        await expectRevert(
          this.token.burn(initialSupply.addn(1), { from: burner }), 'ERC20: burn amount exceeds balance',
        );
      });

      const describeBurn = function (description, amount) {
        describe(description, function () {
          beforeEach('burning', async function () {
            const { logs } = await this.token.burn(amount, { from: burner });
            this.logs = logs;
          });

          it('decrements totalSupply', async function () {
            const expectedSupply = initialSupply.sub(amount);
            expect(await this.token.totalSupply()).to.be.bignumber.equal(expectedSupply);
          });

          it('decrements initialHolder balance', async function () {
            const expectedBalance = initialSupply.sub(amount);
            expect(await this.token.balanceOf(initialHolder)).to.be.bignumber.equal(expectedBalance);
          });

          it('emits Transfer event', async function () {
            const event = expectEvent.inLogs(this.logs, 'Transfer', {
              from: initialHolder,
              to: ZERO_ADDRESS,
            });

            expect(event.args.value).to.be.bignumber.equal(amount);
          });
        });
      };

      describeBurn('for entire balance', initialSupply);
      describeBurn('for less amount than balance', initialSupply.subn(1));
    });
  });

  describe('_transfer', function () {
    shouldBehaveLikeERC20Transfer('ERC20', initialHolder, recipient, initialSupply, function (from, to, amount) {
      return this.token.transferInternal(from, to, amount);
    });

    describe('when the sender is the zero address', function () {
      it('reverts', async function () {
        await expectRevert(this.token.transferInternal(ZERO_ADDRESS, recipient, initialSupply),
          'ERC20: transfer from the zero address',
        );
      });
    });
  });

  describe('_approve', function () {
    shouldBehaveLikeERC20Approve('ERC20', initialHolder, recipient, initialSupply, function (owner, spender, amount) {
      return this.token.approveInternal(owner, spender, amount);
    });

    describe('when the owner is the zero address', function () {
      it('reverts', async function () {
        await expectRevert(this.token.approveInternal(ZERO_ADDRESS, recipient, initialSupply),
          'ERC20: approve from the zero address',
        );
      });
    });
  });
});
