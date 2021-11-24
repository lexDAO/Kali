// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import '../../ReentrancyGuard.sol';
import '../interfaces/IERC20.sol';

/// @notice Redemption contract that transfers ETH or tokens in proportion of burnt DAO tokens.
contract KaliDAOredemption is ReentrancyGuard {
    IERC20 public immutable dao;

    IERC20[] public tokens;

    constructor(IERC20 dao_, IERC20[] memory tokens_) {
        dao = dao_;

        // this is reasonably safe from overflow because incrementing `i` loop beyond
        // 'type(uint256).max' is exceedingly unlikely compared to optimization benefits
        unchecked {
            for (uint256 i; i < tokens_.length; i++) {
                tokens.push(tokens_[i]);
            }
        }
    }

    function extensionCall(address account, uint256 amount) public nonReentrant virtual returns (uint256 amountOut) {
        uint256 totalSupply = dao.totalSupply();
        
        for (uint256 i; i < tokens.length; i++) {
            // calculate fair share of given token for redemption
            uint256 amountToRedeem = amount * tokens[i].balanceOf(address(this)) / totalSupply;

            if (amountToRedeem > 0) {
                _safeTransfer(address(tokens[i]), account, amountToRedeem);
            }
        }

        // placeholder value to conform to interface
        amountOut = amount;
    }

    /*///////////////////////////////////////////////////////////////
                            TRANSFER HELPERS
    //////////////////////////////////////////////////////////////*/

    function _safeTransferETH(address to, uint256 value) internal virtual {
        (bool success, ) = to.call{value: value}("");

        require(success, "ETH_TRANSFER_FAILED");
    }

    function _safeTransfer(address token, address to, uint256 amount) internal virtual {
        // transfer(address,uint256)
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb, to, amount));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "TRANSFER_FAILED");
    }
}
