// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

/// @notice KaliDAO tribute escrow interface.
interface IKaliDAOTribute {
    enum ProposalType {
        MINT, 
        BURN, 
        CALL, 
        PERIOD, 
        QUORUM, 
        SUPERMAJORITY, 
        TYPE, 
        PAUSE, 
        EXTENSION
    }

    function passed(uint256 proposal) external returns (bool);

    function propose(
        ProposalType proposalType,
        string calldata description,
        address[] calldata accounts,
        uint256[] calldata amounts,
        bytes[] calldata payloads
    ) external returns (uint256 proposal);

    function cancelProposal(uint256 proposal) external;
}
