// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.4;

import '../../../utils/ReentrancyGuard.sol';

/// @notice Vesting contract for KaliDAO tokens.
contract KaliDAOvesting is ReentrancyGuard {
    event ExtensionSet(address indexed dao, address[] accounts, uint256[] amounts, uint256[] cliffTimes, uint256[] cliffAmounts, uint256[] startTimes, uint256[] endTimes);

    event ExtensionCalled(address indexed dao, uint256 vestingId, address indexed member, uint256 indexed amountOut);

    error NoArrayParity();

    error InvalidCliffAmount();

    error InvalidTimespan();

    error NotDAO();

    error NotVestee();

    error VestNotStarted();

    error VestExceeded();

    error VestNotPastCliff();

    uint256 vestingCount;

    mapping(uint256 => Vesting) public vestings;

    struct Vesting {
        address dao;
        address account;
        uint128 depositAmount; // total shares to vest
        uint128 cliffAmount;
        uint128 withdrawAmount; // shares vested and withdrawn 
        uint128 rate; 
        uint64 cliffTime;
        uint64 startTime;
        uint64 endTime;
    }
    uint256 public withdrawn;
    function setExtension(bytes calldata extensionData) public nonReentrant virtual {
        (
            address[] memory accounts, 
            uint256[] memory amounts, 
            uint256[] memory cliffTimes, 
            uint256[] memory cliffAmounts, 
            uint256[] memory startTimes, 
            uint256[] memory endTimes
        ) 
            = abi.decode(extensionData, (address[], uint256[], uint256[], uint256[], uint256[], uint256[]));
        
        if (accounts.length != amounts.length 
            || amounts.length != cliffTimes.length 
            || cliffTimes.length != cliffAmounts.length 
            || cliffAmounts.length != startTimes.length 
            || startTimes.length != endTimes.length) 
            revert NoArrayParity();

        // this is reasonably safe from overflow because incrementing `i` loop beyond
        // 'type(uint256).max' is exceedingly unlikely compared to optimization benefits,
        // and `timeDifference` is checked by reversion
        unchecked {
            for (uint256 i; i < accounts.length; i++) {
                if (startTimes[i] > endTimes[i]) revert InvalidTimespan();

                if (cliffAmounts[i] > amounts[i]) revert InvalidCliffAmount();
                
                uint256 timeDifference;

                uint256 rate;
            
                if (cliffAmounts[i] == 0) {
                    timeDifference = endTimes[i] - startTimes[i];
                    rate = amounts[i] / timeDifference;
                } else {
                    timeDifference = endTimes[i] - cliffTimes[i];
                    rate = (amounts[i] - (amounts[i] * cliffAmounts[i]) / 100) / timeDifference;
                }

                uint256 vestingId = vestingCount++;

                vestings[vestingId] = Vesting({
                    dao: msg.sender,
                    account: accounts[i],
                    depositAmount: uint128(amounts[i]),
                    cliffAmount: uint128((amounts[i] * cliffAmounts[i]) / 100),
                    withdrawAmount: 0,
                    rate: uint128(rate),
                    cliffTime: uint64(cliffTimes[i]),
                    startTime: uint64(startTimes[i]),
                    endTime: uint64(endTimes[i])
                });
            }
        }

        emit ExtensionSet(msg.sender, accounts, amounts, cliffAmounts, cliffTimes, startTimes, endTimes);
    }

    function callExtension(
        address account, 
        uint256 amount, 
        bytes calldata extensionData
    ) public nonReentrant virtual returns (bool mint, uint256 amountOut) {
        uint256 vestingId = abi.decode(extensionData, (uint256));

        uint256 timeDelta;

        uint256 vesteeBalance;

        Vesting storage vest = vestings[vestingId];

        if (msg.sender != vest.dao) revert NotDAO();

        if (account != vest.account) revert NotVestee();

        if (block.timestamp < vest.startTime) revert VestNotStarted();

        unchecked {
            if (vest.cliffAmount == 0) {
                timeDelta = block.timestamp - vest.startTime;
                vesteeBalance = (vest.rate * timeDelta) - uint256(vest.withdrawAmount);
                vest.withdrawAmount += uint128(vesteeBalance);
            } else if (block.timestamp > vest.endTime) {
                timeDelta = block.timestamp - vest.startTime;
                vesteeBalance = vest.depositAmount - uint256(vest.withdrawAmount);
                vest.withdrawAmount += uint128(vesteeBalance);
            } else if (block.timestamp > vest.cliffTime && vest.cliffAmount > vest.withdrawAmount) { // Cliff vested but not withdrawn
                timeDelta = block.timestamp - vest.cliffTime;
                vesteeBalance = vest.cliffAmount + (vest.rate * timeDelta) - uint256(vest.withdrawAmount);
                vest.withdrawAmount += uint128(vesteeBalance);
            } else if (block.timestamp > vest.cliffTime && vest.cliffAmount < vest.withdrawAmount) { // Cliff vested and withdrawn
                timeDelta = block.timestamp - vest.cliffTime;
                vesteeBalance = vest.cliffAmount + (vest.rate * timeDelta) - uint256(vest.withdrawAmount);
                vest.withdrawAmount += uint128(vesteeBalance);
            } else {
                revert VestNotPastCliff();
            }
        }

        withdrawn = vesteeBalance;        

        if (vest.withdrawAmount > vest.depositAmount) revert VestExceeded();

        (mint, amountOut) = (true, vesteeBalance);

        emit ExtensionCalled(msg.sender, vestingId, account, amountOut);
    }
}
