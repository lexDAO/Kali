// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.4;

import '../../utils/ReentrancyGuard.sol';

/// @notice Vesting contract for KaliDAO tokens.
contract KaliDAOvesting is ReentrancyGuard {
    using SafeTransferLib for address;

    event ExtensionSet(address indexed dao, address[] accounts, uint256[] amounts, uint256[] deadlines);

    event ExtensionCalled(address indexed dao, uint256 vestingId, address indexed member, uint256 indexed amountOut);

    error NoArrayParity();

    error NotDAO();

    error NotVestee();

    error VestNotStarted();

    error VestExceeded();

    uint256 vestingCount;

    mapping(uint256 => Vesting) public vestings;

    struct Vesting {
        address dao;
        address account;
        uint256 amount;
        uint256 deadline;
    }

    function setExtension(bytes calldata extensionData) public nonReentrant virtual {
        (address[] memory accounts, uint256[] memory amounts, uint256[] memory deadlines) 
            = abi.decode(extensionData, (address[], uint256[], uint256[]));
        
        if (accounts.length != amounts.length || amounts.length != deadlines.length) revert NoArrayParity();

        // this is reasonably safe from overflow because incrementing `i` loop beyond
        // 'type(uint256).max' is exceedingly unlikely compared to optimization benefits
        unchecked {
            for (uint256 i; i < accounts.length; i++) {
                uint256 vestingId = vestingCount;

                vestings[vestingId] = Vesting({
                    dao: msg.sender,
                    account: accounts[i],
                    amount: amounts[i],
                    deadline: deadlines[i]
                });
            }

            vestingCount++;
        }

        emit ExtensionSet(msg.sender, accounts, amounts, deadlines);
    }

    function callExtension(
        address account, 
        uint256 amount, 
        bytes calldata extensionData
    ) public nonReentrant virtual returns (bool mint, uint256 amountOut) {
        uint256 vestingId = abi.decode(extensionData, (uint256));

        Vesting storage vest = vestings[vestingId];

        if (msg.sender != vest.dao) revert NotDAO();

        if (account != vest.account) revert NotVestee();

        if (block.timestamp < vest.deadline) revert VestNotStarted();

        if (amount > vest.amount) revert VestExceeded();

        // this is safe as amount is checked in above reversion
        unchecked {
            vest.amount -= amount;
        }

        (mint, amountOut) = (true, amount);

        emit ExtensionCalled(msg.sender, vestingId, account, amount);
    }
}
