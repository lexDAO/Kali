// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import '../ReentrancyGuard.sol';

/// @notice Crowdsale contract that receives ETH or tokens to mint DAO tokens.
contract KaliDAOcrowdsale is ReentrancyGuard {
    address public immutable dao;
    
    address public immutable purchaseToken;
    
    uint8 public immutable purchaseMultiplier;

    bool public immutable ethBased;

    uint256 public immutable purchaseLimit;

    uint256 public amountPurchased;
    
    constructor(address dao_, address purchaseToken_, uint8 purchaseMultiplier_, bool ethBased_, uint256 purchaseLimit_) {
        dao = dao_;
        
        purchaseToken = purchaseToken_;
        
        purchaseMultiplier = purchaseMultiplier_;

        ethBased = ethBased_;

        purchaseLimit = purchaseLimit_;
    }
    
    function extensionCall(address account, uint256 amount) public payable nonReentrant virtual returns (uint256 amountOut) {
        require(msg.sender == dao, 'NOT_DAO');
        
        if (ethBased) {
            amountOut = msg.value * purchaseMultiplier;

            require(amountPurchased + amountOut <= purchaseLimit, "PURCHASE_LIMIT");
            
            // send ETH back to Kali
            safeTransferETH(msg.sender, msg.value);

            amountPurchased += amountOut;
        } else {
            // send tokens back to Kali
            safeTransferFrom(purchaseToken, account, msg.sender, amount);
            
            amountOut = amount * purchaseMultiplier;

            require(amountPurchased + amountOut <= purchaseLimit, "PURCHASE_LIMIT");

            amountPurchased += amountOut;
        }
    }
    
    /*///////////////////////////////////////////////////////////////
                            TRANSFER HELPERS
    //////////////////////////////////////////////////////////////*/
    
    function safeTransferFrom(address token, address from, address to, uint256 amount) internal virtual {
        // transferFrom(address,address,uint256)
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x23b872dd, from, to, amount));
        
        require(success && (data.length == 0 || abi.decode(data, (bool))), "PULL_FAILED");
    }
    
    function safeTransferETH(address to, uint256 value) internal virtual {
        (bool success, ) = to.call{value: value}("");
        
        require(success, "ETH_TRANSFER_FAILED");
    }
}
