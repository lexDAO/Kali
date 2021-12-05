// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import './KaliDAO.sol';
import './IRicardianLLC.sol';

/// @notice Factory to deploy KaliDAO.
contract KaliDAOfactory {
    event DAOdeployed(string indexed name, KaliDAO indexed kaliDAO);

    IRicardianLLC public immutable ricardianLLC;

    constructor(IRicardianLLC ricardianLLC_) {
        ricardianLLC = ricardianLLC_;
    }
    
    function deployKaliDAO(
        string memory name_,
        string memory symbol_,
        string memory docs_,
        bool paused_,
        address[] memory extensions_,
        bytes[] memory extensionsData_,
        address[] calldata voters_,
        uint256[] calldata shares_,
        uint32 votingPeriod_,
        uint8[] memory govSettings_
    ) external payable returns (KaliDAO kaliDAO) {
        require(extensions_.length == extensionsData_.length, 'NO_ARRAY_PARITY');
        
        kaliDAO = new KaliDAO{value: msg.value}(
            name_, 
            symbol_, 
            docs_,
            paused_, 
            extensions_,
            voters_, 
            shares_, 
            votingPeriod_, 
            govSettings_
        );

        if (extensions_.length > 0) {
            // this is reasonably safe from overflow because incrementing `i` loop beyond
            // 'type(uint256).max' is exceedingly unlikely compared to optimization benefits
            unchecked {
                for (uint256 i; i < extensions_.length; i++) {
                    IKaliDAOextension(extensions_[i]).setExtension(address(kaliDAO), extensionsData_[i]);
                }
            }
        }

        bytes memory docs = bytes(docs_);

        if (docs.length == 0) {
            ricardianLLC.mintLLC(address(kaliDAO));
        }

        emit DAOdeployed(name_, kaliDAO);
    }
}
