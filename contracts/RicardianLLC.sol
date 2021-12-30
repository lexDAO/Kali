// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.4;

import "../tokens/erc721/ERC721.sol";
import "../utils/Multicall.sol";

/// @notice Ricardian LLC NFT minter.
contract RicardianLLC is ERC721, Multicall {
    error NotGovernance();

    error NotFee();

    error ETHtransferFailed();

    address public governance;

    string public commonURI;

    string public masterOperatingAgreement;

    uint256 private mintFee;

    modifier onlyGovernance {
        if (msg.sender != governance) revert NotGovernance();

        _;
    }

    constructor(
        string memory name_, 
        string memory symbol_, 
        string memory commonURI_,
        string memory masterOperatingAgreement_,
        uint256 mintFee_
    ) ERC721(name_, symbol_) {
        governance = msg.sender;

        commonURI = commonURI_;

        masterOperatingAgreement = masterOperatingAgreement_;

        mintFee = mintFee_;
    }

    function tokenURI(uint256) public override view virtual returns (string memory) {
        return commonURI;
    }
    
    function mintLLC(address to) public payable virtual { 
        if (msg.value != mintFee) revert NotFee();

        uint256 tokenId = totalSupply;

        _mint(to, tokenId);
    }

    receive() external payable virtual {
        mintLLC(msg.sender);
    }

    function burn(uint256 tokenId) public virtual {
        if (msg.sender != ownerOf[tokenId]) revert NotOwner();

        _burn(tokenId);
    }

    /*///////////////////////////////////////////////////////////////
                            GOV LOGIC
    //////////////////////////////////////////////////////////////*/

    function govMint(address to) public onlyGovernance virtual {
        uint256 tokenId = totalSupply;
        
        _mint(to, tokenId);
    }

    function govBurn(uint256 tokenId) public onlyGovernance virtual {
        _burn(tokenId);
    }

    function updateGov(address governance_) public onlyGovernance virtual {
        governance = governance_;
    }

    function updateURI(string calldata commonURI_) public onlyGovernance virtual {
        commonURI = commonURI_;
    }

    function updateAgreement(string calldata masterOperatingAgreement_) public onlyGovernance virtual {
        masterOperatingAgreement = masterOperatingAgreement_;
    }

    function updateFee(uint256 mintFee_) public onlyGovernance virtual {
        mintFee = mintFee_;
    }

    function collectFee() public onlyGovernance virtual {
        _safeTransferETH(governance, address(this).balance);
    }

    function _safeTransferETH(address to, uint256 amount) internal {
        bool callStatus;

        assembly {
            // transfer the ETH and store if it succeeded or not
            callStatus := call(gas(), to, amount, 0, 0, 0, 0)
        }

        if (!callStatus) revert ETHtransferFailed();
    }
}
