// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.4;

import '../../libraries/SafeTransferLib.sol';
import '../../interfaces/IKaliDAOextension.sol';
import '../../interfaces/IKaliWhitelistManager.sol';
import '../../utils/ReentrancyGuard.sol';

/// @notice Crowdsale contract that receives ETH or tokens to mint registered DAO tokens, including merkle whitelisting.
contract KaliDAOcrowdsale is ReentrancyGuard {
    using SafeTransferLib for address;

    event ExtensionSet(
        uint256 indexed crowdsaleId, 
        uint256 indexed listId, 
        address indexed dao, 
        address purchaseToken, 
        uint8 purchaseMultiplier, 
        uint96 purchaseLimit, 
        uint32 saleEnds
    );

    event ExtensionCalled(uint256 indexed crowdsaleId, address member, address indexed dao, uint256 indexed amountOut);

    error NullMultiplier();

    error NotDAO();

    error SaleEnded();

    error NotWhitelisted();

    error PurchaseLimit();

    uint256 public crowdsaleCount;
    
    IKaliWhitelistManager public immutable whitelistManager;

    mapping(uint256 => Crowdsale) public crowdsales;

    struct Crowdsale {
        uint256 listId;
        address dao;
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
        
        if (purchaseMultiplier == 0) revert NullMultiplier();

        uint256 crowdsaleId = crowdsaleCount++;

        crowdsales[crowdsaleId] = Crowdsale({
            listId: listId,
            dao: msg.sender,
            purchaseToken: purchaseToken,
            purchaseMultiplier: purchaseMultiplier,
            purchaseLimit: purchaseLimit,
            amountPurchased: 0,
            saleEnds: saleEnds
        });

        emit ExtensionSet(crowdsaleId, listId, msg.sender, purchaseToken, purchaseMultiplier, purchaseLimit, saleEnds);
    }

    function callExtension(
        address, 
        uint256 amount, 
        bytes calldata data
    ) public payable nonReentrant virtual returns (bool mint, uint256 amountOut) {
        uint256 crowdsaleId = abi.decode(data, (uint256));

        Crowdsale storage sale = crowdsales[crowdsaleId];

        bytes memory extensionData = abi.encode(true);

        if (block.timestamp > sale.saleEnds) revert SaleEnded();

        if (sale.listId != 0) 
            if (!whitelistManager.whitelistedAccounts(sale.listId, msg.sender)) revert NotWhitelisted();

        if (sale.purchaseToken == address(0)) {
            amountOut = msg.value * sale.purchaseMultiplier;

            if (sale.amountPurchased + amountOut > sale.purchaseLimit) revert PurchaseLimit();

            // send ETH to DAO
            sale.dao._safeTransferETH(msg.value);

            sale.amountPurchased += uint96(amountOut);

            IKaliDAOextension(sale.dao).callExtension(msg.sender, amountOut, extensionData);
        } else {
            // send tokens to DAO
            sale.purchaseToken._safeTransferFrom(msg.sender, sale.dao, amount);

            amountOut = amount * sale.purchaseMultiplier;

            if (sale.amountPurchased + amountOut > sale.purchaseLimit) revert PurchaseLimit();

            sale.amountPurchased += uint96(amountOut);

            IKaliDAOextension(sale.dao).callExtension(msg.sender, amountOut, extensionData);
        }

        mint = true;

        emit ExtensionCalled(crowdsaleId, msg.sender, sale.dao, amountOut);
    }
}
