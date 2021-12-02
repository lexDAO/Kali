// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

/// @notice DAO membership extension interface.
interface IKaliDAOextension {
    function setExtension(address dao, bytes calldata extensionData) external;

    function callExtension(
        address account, 
        uint256 amount, 
        bytes calldata extensionData
    ) external payable returns (uint256 amountOut);
}
