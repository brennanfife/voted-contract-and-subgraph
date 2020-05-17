// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.6.8;

import "@openzeppelin/contracts/math/SafeMath.sol";


contract Vote {
    using SafeMath for uint256;

    uint256 public TotalTrumpVotes;
    uint256 public TotalBidenVotes;

    event Voted(address caller, uint256 choice);

    constructor() public {
        TotalTrumpVotes = 0;
        TotalBidenVotes = 0;
    }

    function vote(uint256 choice) public {
        if (choice == 0) TotalTrumpVotes = TotalTrumpVotes.add(1);
        else if (choice == 1) TotalBidenVotes = TotalBidenVotes.add(1);
        emit Voted(msg.sender, choice);
    }
}
