pragma solidity >=0.4.22 <0.8.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

/**
 * A ERC20 token for testing the HashedTimeLockERC20.
 */
contract TestERC20 is ERC20 {
    string public constant name = "Test Token";
    string public constant symbol = "TestToken";
    uint8 public constant decimals = 18;

    constructor(uint256 initialBalance) public {
        _mint(msg.sender, initialBalance);
    }
}
