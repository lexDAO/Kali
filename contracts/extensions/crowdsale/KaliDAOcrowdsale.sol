// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import '../../libraries/SafeTransferLib.sol';
import '../../access/interfaces/IKaliWhitelistManager.sol';
import '../../utils/ReentrancyGuard.sol';

/// @notice Crowdsale contract that receives ETH or tokens to mint registered DAO tokens, including merkle whitelisting.
contract KaliDAOcrowdsale is ReentrancyGuard {
    IKaliWhitelistManager public immutable whitelistManager;

    mapping(address => Crowdsale) public crowdsales;

    struct Crowdsale {
        address operator;
        address purchaseToken;
        uint8 purchaseMultiplier;
        uint96 purchaseLimit;
        uint96 amountPurchased;
        uint32 saleEnds;
    }

    constructor(IKaliWhitelistManager whitelistManager_) {
        whitelistManager = whitelistManager_;
    }

    function setExtension(address dao, bytes calldata extensionData) public nonReentrant virtual {
        (address operator, address purchaseToken, uint8 purchaseMultiplier, uint96 purchaseLimit, uint32 saleEnds) 
            = abi.decode(extensionData, (address, address, uint8, uint96, uint32));
        
        require(purchaseMultiplier > 0, 'NULL_MULTIPLIER'); 

        require(crowdsales[dao].purchaseMultiplier > 0 || dao == msg.sender, 
            'INITIALIZED_OR_NOT_DAO'); 

        crowdsales[dao] = Crowdsale({
            operator: operator,
            purchaseToken: purchaseToken,
            purchaseMultiplier: purchaseMultiplier,
            purchaseLimit: purchaseLimit,
            amountPurchased: 0,
            saleEnds: saleEnds
        });
    }

    function callExtension(
        address account, 
        uint256 amount, 
        bytes calldata
    ) public payable nonReentrant virtual returns (uint256 amountOut) {
        Crowdsale storage sale = crowdsales[msg.sender];

        require(block.timestamp <= sale.saleEnds, 'SALE_ENDED');

        if (sale.operator != address(0)) require(whitelistManager.whitelistedAccounts(sale.operator, account), 
            'NOT_WHITELISTED');

        if (sale.purchaseToken == address(0)) {
            amountOut = msg.value * sale.purchaseMultiplier;

            require(sale.amountPurchased + amountOut <= sale.purchaseLimit, 'PURCHASE_LIMIT');

            // send ETH to DAO
            SafeTransferLib.safeTransferETH(msg.sender, msg.value);

            sale.amountPurchased += uint96(amountOut);
        } else {
            // send tokens to DAO
            SafeTransferLib.safeTransferFrom(sale.purchaseToken, account, msg.sender, amount);

            amountOut = amount * sale.purchaseMultiplier;

            require(sale.amountPurchased + amountOut <= sale.purchaseLimit, 'PURCHASE_LIMIT');

            sale.amountPurchased += uint96(amountOut);
        }
    }
}
