// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.4;

/// @notice Single owner access control contract.
/// @author Modified from SushiSwap (https://github.com/sushiswap/trident/blob/master/contracts/TridentOwnable.sol)
contract Ownable {
    event OwnershipTransferred(address indexed from, address indexed to);

    event ClaimTransferred(address indexed from, address indexed to);

    error NotOwner();

    error NotPendingOwner();

    address public owner;

    address public pendingOwner;

    constructor(address owner_) {
        owner = owner_;

        emit OwnershipTransferred(address(0), owner_);
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();

        _;
    }

    function claimOwner() public virtual {
        if (msg.sender != pendingOwner) revert NotPendingOwner();

        emit OwnershipTransferred(owner, msg.sender);

        owner = msg.sender;

        pendingOwner = address(0);
    }

    function transferOwner(address to, bool direct) public onlyOwner virtual {
        if (direct) {
            owner = to;

            emit OwnershipTransferred(msg.sender, to);
        } else {
            pendingOwner = to;

            emit ClaimTransferred(msg.sender, to);
        }
    }
}
