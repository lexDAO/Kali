// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import '../../ReentrancyGuard.sol';

/// @notice Crowdsale contract that receives ETH or tokens to mint DAO tokens.
contract KaliDAOcrowdsale is ReentrancyGuard {
    address public immutable dao;
    
    address public immutable purchaseToken;

    bool public immutable ethBased;
    
    uint8 public immutable purchaseMultiplier;

    uint256 public immutable purchaseLimit;

    uint256 public amountPurchased;
    
    constructor(address dao_, address purchaseToken_, bool ethBased_, uint8 purchaseMultiplier_, uint256 purchaseLimit_) {
        dao = dao_;
        
        purchaseToken = purchaseToken_;

        ethBased = ethBased_;
        
        purchaseMultiplier = purchaseMultiplier_;

        purchaseLimit = purchaseLimit_;
    }
    
    function extensionCall(address account, uint256 amount) public payable nonReentrant virtual returns (uint256 amountOut) {
        require(msg.sender == dao, 'NOT_DAO');
        
        if (ethBased) {
            amountOut = msg.value * purchaseMultiplier;

            require(amountPurchased + amountOut <= purchaseLimit, "PURCHASE_LIMIT");
            
            // send ETH to `dao`
            safeTransferETH(msg.sender, msg.value);

            amountPurchased += amountOut;
        } else {
            // send tokens to `dao`
            safeTransferFrom(purchaseToken, account, msg.sender, amount);
            
            amountOut = amount * purchaseMultiplier;

            require(amountPurchased + amountOut <= purchaseLimit, "PURCHASE_LIMIT");

            amountPurchased += amountOut;
        }
    }
    
    /*///////////////////////////////////////////////////////////////
                            TRANSFER HELPERS
    //////////////////////////////////////////////////////////////*/

    function safeTransferETH(address to, uint256 value) internal virtual {
        (bool success, ) = to.call{value: value}("");
        
        require(success, "ETH_TRANSFER_FAILED");
    }
    
    function safeTransferFrom(address token, address from, address to, uint256 amount) internal virtual {
        // transferFrom(address,address,uint256)
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x23b872dd, from, to, amount));
        
        require(success && (data.length == 0 || abi.decode(data, (bool))), "PULL_FAILED");
    }
}
