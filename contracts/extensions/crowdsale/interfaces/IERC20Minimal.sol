// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

/// @notice Minimal ERC-20 interface.
interface IERC20Minimal { 
    function balanceOf(address account) external view returns (uint256);

    function totalSupply() external view returns (uint256);
}
