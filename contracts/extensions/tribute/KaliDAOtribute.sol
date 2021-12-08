// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import '../../libraries/SafeTransferLib.sol';
import './interfaces/IKaliDAOTribute.sol';
import '../../utils/ReentrancyGuard.sol';

/// @notice Tribute contract that escrows ETH or tokens for DAO proposals.
contract KaliDAOtribute is ReentrancyGuard {
    event NewTributeProposal(
        IKaliDAOTribute indexed dao,
        address indexed proposer, 
        uint256 indexed proposal, 
        address asset, 
        uint256 assetAmount
    );

    event TributeProposalCancelled(IKaliDAOTribute indexed dao, uint256 indexed proposal);

    event TributeProposalReleased(IKaliDAOTribute indexed dao, uint256 indexed proposal);

    mapping(IKaliDAOTribute => mapping(uint256 => Tribute)) public tributes;

    struct Tribute {
        IKaliDAOTribute dao;
        address proposer;
        address asset;
        uint256 amount;
    }

    function submitTributeProposal(
        IKaliDAOTribute dao,
        IKaliDAOTribute.ProposalType proposalType, 
        string calldata description,
        address[] calldata accounts,
        uint256[] calldata amounts,
        bytes[] calldata payloads,
        address asset, 
        uint256 assetAmount
    ) public payable nonReentrant virtual {
        // escrow tribute
        if (asset == address(0)) {
            assetAmount = msg.value;
        } else {
            SafeTransferLib.safeTransferFrom(asset, msg.sender, address(this), assetAmount);
        }

        uint256 proposal = dao.propose(
            proposalType,
            description,
            accounts,
            amounts,
            payloads
        );

        tributes[dao][proposal] = Tribute({
            dao: dao,
            proposer: msg.sender,
            asset: asset,
            amount: assetAmount
        });

        emit NewTributeProposal(dao, msg.sender, proposal, asset, assetAmount);
    }

    function cancelTributeProposal(IKaliDAOTribute dao, uint256 proposal) public nonReentrant virtual {
        Tribute storage trib = tributes[dao][proposal];

        require(msg.sender == trib.proposer, 'NOT_PROPOSER');

        dao.cancelProposal(proposal);

        // return tribute from escrow
        if (trib.asset == address(0)) {
            SafeTransferLib.safeTransferETH(trib.proposer, trib.amount);
        } else {
            SafeTransferLib.safeTransfer(trib.asset, trib.proposer, trib.amount);
        }

        emit TributeProposalCancelled(dao, proposal);
    }

    function releaseTributeProposal(IKaliDAOTribute dao, uint256 proposal) public nonReentrant virtual {
        Tribute storage trib = tributes[dao][proposal];

        // release tribute from escrow based on proposal outcome
        if (dao.passed(proposal)) {
            if (trib.asset == address(0)) {
                SafeTransferLib.safeTransferETH(address(trib.dao), trib.amount);
            } else {
                SafeTransferLib.safeTransfer(trib.asset, address(trib.dao), trib.amount);
            }
        } else {
            if (trib.asset == address(0)) {
                SafeTransferLib.safeTransferETH(trib.proposer, trib.amount);
            } else {
                SafeTransferLib.safeTransfer(trib.asset, trib.proposer, trib.amount);
            }
        }

        emit TributeProposalReleased(dao, proposal);
    }
}
