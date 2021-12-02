// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import '../ERC721.sol';

/// @notice Public NFT minter for KaliDAO.
contract KaliNFT is ERC721 {
    constructor(string memory name_, string memory symbol_) 
        ERC721(name_, symbol_) {}
    
    function mint(
        address to, 
        uint256 tokenId, 
        string memory tokenURI_
    ) external { 
        _mint(
            to, 
            tokenId, 
            tokenURI_
        );
    }

    function burn(uint256 tokenId) external {
        require(msg.sender == ownerOf[tokenId], 'NOT_OWNER');

        _burn(tokenId);
    }
}
