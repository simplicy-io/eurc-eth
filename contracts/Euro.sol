// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Euro is AccessControl, ERC20Burnable, Ownable {
    bool public mintingFinished = false;
    bool public burningFinished = false;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    event Mint(address indexed to, uint256 amount);
    event MintFinished();
    event Burn(address indexed to, uint256 amount);
    event BurnFinished();

    modifier canMint() {
        require(!mintingFinished, "Euro: mint is finished");
        _;
    }

     modifier canBurn() {
        require(!burningFinished, "Euro: burn is finished");
        _;
    }

    constructor (
        string memory name,
        string memory symbol,
        uint8 decimals,
        address initialAccount,
        uint256 initialBalance,
        address minter, 
        address burner
    ) public payable ERC20(name, symbol) {
        _setupDecimals(decimals);
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, minter);
        _setupRole(BURNER_ROLE, burner);
        _mint(initialAccount, initialBalance);
    }

    function mint(address account, uint256 amount) public canMint {
        require(hasRole(MINTER_ROLE, _msgSender()), "Euro: Caller is not a minter");
        _mint(account, amount);
        emit Mint(account, amount);
    }

    function burn(uint256 amount) public override canBurn {
        require(hasRole(BURNER_ROLE, _msgSender()), "Euro: Caller is not a burner");
        _burn(owner(), amount);
        emit Burn(owner(), amount);
    }

    function burnFrom(address account, uint256 amount) public virtual override {
        require(hasRole(BURNER_ROLE, _msgSender()), "Euro: Caller is not a burner");
        super.burnFrom(account, amount);
    }

    function transferInternal(address from, address to, uint256 value) public {
        _transfer(from, to, value);
    }

    function approveInternal(address owner, address spender, uint256 value) public {
        _approve(owner, spender, value);
    }

    /**
    * @dev Function to stop minting new tokens.
    * @return True if the operation was successful.
    */
    function finishMinting() public onlyOwner returns (bool) {
        mintingFinished = true;
        emit MintFinished();
        return true;
    }

    /**
    * @dev Function to stop burning new tokens.
    * @return True if the operation was successful.
    */
    function finishBurning() public onlyOwner returns (bool) {
        burningFinished = true;
        emit BurnFinished();
        return true;
    }
}
