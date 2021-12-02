// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import '../../libraries/SafeTransferLib.sol';
import '../../ReentrancyGuard.sol';

/// @notice Crowdsale contract that receives ETH or tokens to mint registered DAO tokens.
contract KaliDAOcrowdsale is ReentrancyGuard {
    mapping(address => Crowdsale) public crowdsales;

    struct Crowdsale {
        address purchaseToken;
        uint8 purchaseMultiplier;
        uint112 purchaseLimit;
        uint112 amountPurchased;
    }

    function setExtension(bytes calldata extensionData_) public nonReentrant virtual {
        (address dao_, address purchaseToken_, uint8 purchaseMultiplier_, uint112 purchaseLimit_) 
            = abi.decode(extensionData_, (address, address, uint8, uint112));
        
        require(purchaseMultiplier_ > 0, "NULL_MULTIPLIER"); 

        require(crowdsales[dao_].purchaseMultiplier > 0 || dao_ == msg.sender, 
            "INITIALIZED_OR_NOT_DAO"); 

        crowdsales[dao_] = Crowdsale({
            purchaseToken: purchaseToken_,
            purchaseMultiplier: purchaseMultiplier_,
            purchaseLimit: purchaseLimit_,
            amountPurchased: 0
        });
    }

    function callExtension(address account, uint256 amount) public payable nonReentrant virtual returns (uint256 amountOut) {
        Crowdsale storage sale = crowdsales[msg.sender];

        if (sale.purchaseToken == address(0)) {
            amountOut = msg.value * sale.purchaseMultiplier;

            require(sale.amountPurchased + amountOut <= sale.purchaseLimit, "PURCHASE_LIMIT");

            // send ETH to `dao`
            SafeTransferLib.safeTransferETH(msg.sender, msg.value);

            sale.amountPurchased += uint112(amountOut);
        } else {
            // send tokens to `dao`
            SafeTransferLib.safeTransferFrom(sale.purchaseToken, account, msg.sender, amount);

            amountOut = amount * sale.purchaseMultiplier;

            require(sale.amountPurchased + amountOut <= sale.purchaseLimit, "PURCHASE_LIMIT");

            sale.amountPurchased += uint112(amountOut);
        }
    }
}
