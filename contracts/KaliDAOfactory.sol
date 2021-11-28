// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import './KaliDAO.sol';

/// @notice Factory to deploy KaliDAO.
contract KaliDAOfactory {
    event DAOdeployed(string indexed name, KaliDAO indexed kaliDAO);
    
    function deployKaliDAO(
        string memory name_,
        string memory symbol_,
        string memory docs_,
        bool paused_,
        address[] memory voters_,
        uint256[] memory shares_,
        uint32 votingPeriod_,
        uint8 quorum_,
        uint8 supermajority_,
        uint8 member_,
        uint8 call_,
        uint8 gov_
    ) external payable returns (KaliDAO kaliDAO) {
        kaliDAO = new KaliDAO{value: msg.value}(
            name_, 
            symbol_, 
            docs_,
            paused_, 
            voters_, 
            shares_, 
            votingPeriod_, 
            quorum_, 
            supermajority_
        );
        
        kaliDAO.setVoteTypes(member_, call_, gov_);
        
        emit DAOdeployed(name_, kaliDAO);
    }
}
