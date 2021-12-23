// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

contract DropETH { 
    event ETHDropped(string indexed message);
    
    uint256 public amount;
    address payable[] public recipients;


    function dropETH(address payable[] memory _recipients, string memory message) public payable {
        recipients = _recipients;
        amount = msg.value / recipients.length;
        for (uint256 i = 0; i < recipients.length; i++) {
	     recipients[i].transfer(amount);
        }
        emit ETHDropped(message);
    }

    receive() external payable virtual {}
}