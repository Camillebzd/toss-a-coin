// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract TossACoin is Ownable {
    // state variables
    mapping(address => uint256) public tossed;
    uint256 public totalReceived;

    // events
    event Withdrawal(uint amount);
    event Tossed(uint amount);

    // functions
    constructor() {}

    receive() external payable{
       toss();
    }

    function toss() public payable {
        require(msg.value > 0, "nothing was toss :(");
        tossed[msg.sender] += msg.value;
        totalReceived += msg.value;
        emit Tossed(msg.value);
    }

    function withdraw() external onlyOwner {
        require(address(this).balance > 0, "balance empty");
        (bool success,) = msg.sender.call{value: address(this).balance}("");
        require(success, "transfer failed");
        emit Withdrawal(address(this).balance);
    }
}
