// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

/// @notice Gas-optimized reentrancy protection.
/// @author Modified from RariCapital (https://github.com/Rari-Capital/solmate/blob/main/src/utils/ReentrancyGuard.sol)
/// License-Identifier: AGPL-3.0-only
abstract contract ReentrancyGuard {
    uint256 internal reentrancyStatus = 1;

    modifier nonReentrant() {
        require(reentrancyStatus == 1, 'REENTRANCY');

        reentrancyStatus = 2;

        _;

        reentrancyStatus = 1;
    }
}
