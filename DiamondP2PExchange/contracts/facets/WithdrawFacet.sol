//SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {WithdrawLibrary as wl} from "../libraries/WithdrawLibrary.sol";
import {DiamondStorage as dsto} from "../libraries/DiamondStorage.sol";
contract WithdrawFacet {

    function withdrawOrder(uint orderId, dsto.orderType isBuyOrder) external {
        wl._withdrawOrder(orderId, isBuyOrder);
    }

}