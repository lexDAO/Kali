// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import '../../libraries/SafeTransferLib.sol';
import './interfaces/IERC20Minimal.sol';
import '../../ReentrancyGuard.sol';

/// @notice Redemption contract that transfers registered tokens from DAO in proportion to burnt DAO tokens.
contract KaliDAOredemption is ReentrancyGuard {
    mapping(address => IERC20Minimal[]) public redeemables;

    function setExtension(address dao, bytes calldata extensionData) public nonReentrant virtual {
        (IERC20Minimal[] memory tokens) = abi.decode(extensionData, (IERC20Minimal[]));

        require(tokens.length > 0, "NULL_TOKENS");
        
        require(redeemables[dao].length == 0, "INITIALIZED");
        
        // this is reasonably safe from overflow because incrementing `i` loop beyond
        // 'type(uint256).max' is exceedingly unlikely compared to optimization benefits
        unchecked {
            for (uint256 i; i < tokens.length; i++) {
                redeemables[dao].push(tokens[i]);
            }
        }
    }

    function callExtension(
        address account, 
        uint256 amount, 
        bytes calldata
    ) public nonReentrant virtual returns (uint256 amountOut) {
        for (uint256 i; i < redeemables[msg.sender].length; i++) {
            // calculate fair share of given token for redemption
            uint256 amountToRedeem = amount * redeemables[msg.sender][i].balanceOf(msg.sender) / 
                IERC20Minimal(msg.sender).totalSupply();
            
            // `transferFrom` DAO to redeemer
            if (amountToRedeem > 0) {
                SafeTransferLib.safeTransferFrom(
                    address(redeemables[msg.sender][i]), 
                    msg.sender, 
                    account, 
                    amountToRedeem
                );
            }
        }

        // placeholder value to conform to interface
        amountOut = amount;
    }

    function addTokens(IERC20Minimal[] memory tokens) public nonReentrant virtual {
        // this is reasonably safe from overflow because incrementing `i` loop beyond
        // 'type(uint256).max' is exceedingly unlikely compared to optimization benefits
        unchecked {
            for (uint256 i; i < tokens.length; i++) {
                redeemables[msg.sender].push(tokens[i]);
            }
        }
    }
}
