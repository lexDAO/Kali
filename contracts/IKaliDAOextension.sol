// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

/// @notice DAO membership extension module.
interface IKaliDAOextension {
    function extensionCall(address account, uint256 amount) external payable returns (uint256 amountOut);
}
