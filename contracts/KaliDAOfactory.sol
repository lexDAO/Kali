// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import './KaliDAO.sol';
import './interfaces/IRicardianLLC.sol';

/// @notice Factory to deploy KaliDAO.
contract KaliDAOfactory {
    event DAOdeployed(KaliDAO indexed kaliDAO, string indexed name, string docs);

    address payable public immutable kaliMaster;

    IRicardianLLC public immutable ricardianLLC;

    constructor(address payable kaliMaster_, IRicardianLLC ricardianLLC_) {
        kaliMaster = kaliMaster_;

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

        kaliDAO = KaliDAO(_cloneAsMinimalProxy(kaliMaster));
        
        kaliDAO.init{value: msg.value}(
            name_, 
            symbol_, 
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

        emit DAOdeployed(kaliDAO, name_, docs_);
    }

    /// @dev modified from Aelin (https://github.com/AelinXYZ/aelin/blob/main/contracts/MinimalProxyFactory.sol)
    function _cloneAsMinimalProxy(address payable base) internal virtual returns (address payable clone) {
        bytes memory createData = abi.encodePacked(
            // constructor
            bytes10(0x3d602d80600a3d3981f3),
            // proxy code
            bytes10(0x363d3d373d3d3d363d73),
            base,
            bytes15(0x5af43d82803e903d91602b57fd5bf3)
        );

        assembly {
            clone := create(
                0, // no value
                add(createData, 0x20), // data
                55 // data is always 55 bytes (10 constructor + 45 code)
            )
        }
        // if CREATE fails for some reason, address(0) is returned
        require(clone != address(0), 'NULL_DEPLOY');
    }
}
