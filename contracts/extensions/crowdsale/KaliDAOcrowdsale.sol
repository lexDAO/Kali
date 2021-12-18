// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import '../../libraries/SafeTransferLib.sol';
import '../../access/interfaces/IKaliWhitelistManager.sol';
import '../../utils/ReentrancyGuard.sol';

/// @notice Crowdsale contract that receives ETH or tokens to mint registered DAO tokens, including merkle whitelisting.
contract KaliDAOcrowdsale is ReentrancyGuard {
    using SafeTransferLib for address;
    
    IKaliWhitelistManager public immutable whitelistManager;

    mapping(address => Crowdsale) public crowdsales;

    struct Crowdsale {
        uint256 listId;
        address purchaseToken;
        uint8 purchaseMultiplier;
        uint96 purchaseLimit;
        uint96 amountPurchased;
        uint32 saleEnds;
    }

    constructor(IKaliWhitelistManager whitelistManager_) {
        whitelistManager = whitelistManager_;
    }

    function setExtension(bytes calldata extensionData) public nonReentrant virtual {
        (uint256 listId, address purchaseToken, uint8 purchaseMultiplier, uint96 purchaseLimit, uint32 saleEnds) 
            = abi.decode(extensionData, (uint256, address, uint8, uint96, uint32));
        
        require(purchaseMultiplier != 0, 'NULL_MULTIPLIER'); 

        crowdsales[msg.sender] = Crowdsale({
            listId: listId,
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

        if (sale.listId != 0) require(whitelistManager.whitelistedAccounts(sale.listId, account), 
            'NOT_WHITELISTED');

        if (sale.purchaseToken == address(0)) {
            amountOut = msg.value * sale.purchaseMultiplier;

            require(sale.amountPurchased + amountOut <= sale.purchaseLimit, 'PURCHASE_LIMIT');

            // send ETH to DAO
            msg.sender.safeTransferETH(msg.value);

            sale.amountPurchased += uint96(amountOut);
        } else {
            // send tokens to DAO
            sale.purchaseToken.safeTransferFrom(account, msg.sender, amount);

            amountOut = amount * sale.purchaseMultiplier;

            require(sale.amountPurchased + amountOut <= sale.purchaseLimit, 'PURCHASE_LIMIT');

            sale.amountPurchased += uint96(amountOut);
        }
    }
}
