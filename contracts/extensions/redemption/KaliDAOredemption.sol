// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import '../../libraries/SafeTransferLib.sol';
import './interfaces/IERC20minimal.sol';
import '../../utils/ReentrancyGuard.sol';

/// @notice Redemption contract that transfers registered tokens from DAO in proportion to burnt DAO tokens.
contract KaliDAOredemption is ReentrancyGuard {
    mapping(address => address[]) public redeemables;

    mapping(address => uint256) public redemptionStarts;

    function setExtension(address dao, bytes calldata extensionData) public nonReentrant virtual {
        (address[] memory tokens, uint256 redemptionStart) = abi.decode(extensionData, (address[], uint256));

        require(tokens.length != 0, "NULL_TOKENS");
        
        require(redeemables[dao].length == 0, "INITIALIZED");
        
        // this is reasonably safe from overflow because incrementing `i` loop beyond
        // 'type(uint256).max' is exceedingly unlikely compared to optimization benefits
        unchecked {
            for (uint256 i; i < tokens.length; i++) {
                redeemables[dao].push(tokens[i]);
            }
        }

        redemptionStarts[msg.sender] = redemptionStart;
    }

    function callExtension(
        address account, 
        uint256 amount, 
        bytes calldata
    ) public nonReentrant virtual returns (uint256 amountOut) {
        require(block.timestamp >= redemptionStarts[msg.sender], 'NOT_STARTED');

        for (uint256 i; i < redeemables[msg.sender].length; i++) {
            // calculate fair share of given token for redemption
            uint256 amountToRedeem = amount * IERC20minimal(redeemables[msg.sender][i]).balanceOf(msg.sender) / 
                IERC20minimal(msg.sender).totalSupply();
            
            // `transferFrom` DAO to redeemer
            if (amountToRedeem != 0) {
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

    function addTokens(address[] memory tokens) public nonReentrant virtual {
        // this is reasonably safe from overflow because incrementing `i` loop beyond
        // 'type(uint256).max' is exceedingly unlikely compared to optimization benefits
        unchecked {
            for (uint256 i; i < tokens.length; i++) {
                redeemables[msg.sender].push(tokens[i]);
            }
        }
    }

    function removeTokens(uint256[] memory tokenIndex) public nonReentrant virtual {
        for (uint256 i; i < tokenIndex.length; i++) {
            // move last token to replace indexed spot and pop array to remove last token
            redeemables[msg.sender][tokenIndex[i]] = redeemables[msg.sender][redeemables[msg.sender].length - 1];

            redeemables[msg.sender].pop();
        }
    }
}
