// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import '../../libraries/SafeTransferLib.sol';
import '../../ReentrancyGuard.sol';
import './interfaces/IKaliDAOTribute.sol';

/// @notice Tribute contract that escrows ETH or tokens for DAO proposals.
contract KaliDAOtribute is ReentrancyGuard {
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
    }

    function cancelTributeProposal(IKaliDAOTribute dao, uint256 proposal) public virtual {
        Tribute storage trib = tributes[dao][proposal];

        require(msg.sender == trib.proposer, 'NOT_PROPOSER');

        dao.cancelProposal(proposal);

        // return tribute from escrow
        if (trib.asset == address(0)) {
            SafeTransferLib.safeTransferETH(trib.proposer, trib.amount);
        } else {
            SafeTransferLib.safeTransfer(trib.asset, trib.proposer, trib.amount);
        }
    }

    function releaseTributeProposal(IKaliDAOTribute dao, uint256 proposal) public virtual {
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
    }
}
