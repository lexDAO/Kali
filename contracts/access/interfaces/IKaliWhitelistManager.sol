// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

/// @notice Kali DAO whitelist manager interface.
interface IWhitelistManager {
    function whitelistedAccounts(address operator, address account) external returns (bool);
}
