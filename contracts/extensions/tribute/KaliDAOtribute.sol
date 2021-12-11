// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import '../../libraries/SafeTransferLib.sol';
import './interfaces/IKaliDAOtribute.sol';
import '../../utils/ReentrancyGuard.sol';

/// @notice Tribute contract that escrows ETH or tokens for DAO proposals.
contract KaliDAOtribute is ReentrancyGuard {
    event NewTributeProposal(
        IKaliDAOtribute indexed dao,
        address indexed proposer, 
        uint256 indexed proposal, 
        address asset, 
        uint256 assetAmount
    );

    event TributeProposalCancelled(IKaliDAOtribute indexed dao, uint256 indexed proposal);

    event TributeProposalReleased(IKaliDAOtribute indexed dao, uint256 indexed proposal);

    mapping(IKaliDAOtribute => mapping(uint256 => Tribute)) public tributes;

    struct Tribute {
        IKaliDAOtribute dao;
        address proposer;
        address asset;
        uint256 amount;
    }

    function submitTributeProposal(
        IKaliDAOtribute dao,
        IKaliDAOtribute.ProposalType proposalType, 
        string calldata description,
        address[] calldata accounts,
        uint256[] calldata amounts,
        bytes[] calldata payloads,
        address asset, 
        uint256 assetAmount
    ) public payable nonReentrant virtual {
        // escrow tribute
        if (msg.value > 0) {
            asset = address(0);
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

    function cancelTributeProposal(IKaliDAOtribute dao, uint256 proposal) public nonReentrant virtual {
        Tribute storage trib = tributes[dao][proposal];

        require(msg.sender == trib.proposer, 'NOT_PROPOSER');

        dao.cancelProposal(proposal);

        // return tribute from escrow
        if (trib.asset == address(0)) {
            SafeTransferLib.safeTransferETH(trib.proposer, trib.amount);
        } else {
            SafeTransferLib.safeTransfer(trib.asset, trib.proposer, trib.amount);
        }

        delete tributes[dao][proposal];

        emit TributeProposalCancelled(dao, proposal);
    }

    function releaseTributeProposal(IKaliDAOtribute dao, uint256 proposal) public nonReentrant virtual {
        Tribute storage trib = tributes[dao][proposal];
        // TO DO - confirm proposal has processed
        require(address(trib.dao) != address(0), 'NOT_PROPOSAL');

        if (dao.linked(proposal) > 0) proposal = dao.linked(proposal);

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

        delete tributes[dao][proposal];

        emit TributeProposalReleased(dao, proposal);
    }
}
