// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import './KaliDAOcrowdsale.sol';

/// @notice Factory to deploy crowdsale.
contract KaliDAOcrowdsaleFactory {
    event CrowdSaleDeployed(KaliDAOcrowdsale indexed kaliDAOcrowdsale);

    function deployKaliDAOcrowdsale(
        address dao_, 
        address purchaseToken_, 
        bool ethBased_,
        uint8 purchaseMultiplier_,
        uint256 purchaseLimit_
    ) public virtual returns (KaliDAOcrowdsale kaliDAOcrowdsale) {
        kaliDAOcrowdsale = new KaliDAOcrowdsale(
            dao_, 
            purchaseToken_,
            ethBased_, 
            purchaseMultiplier_, 
            purchaseLimit_ 
        );

        emit CrowdSaleDeployed(kaliDAOcrowdsale);
    }
}
