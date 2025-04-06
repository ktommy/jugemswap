// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EveCoin is ERC20, Ownable {
    constructor() ERC20("EveCoin", "EVE99") Ownable(msg.sender) {
        _mint(msg.sender, 990_000_000 * 10 ** decimals());
    }
}
