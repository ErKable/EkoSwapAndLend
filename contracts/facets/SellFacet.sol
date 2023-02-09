//SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {SellScoreTokenLibrary as sl} from "../libraries/SellLibrary.sol";

contract SellScoreTokenFacet{

    function createSellScoreTokenOrder(uint stAmount, address requestingEkostable, uint ekoStableAmount) external returns(uint orderId){
        orderId = sl._createSellScoreTokenOrder(stAmount, requestingEkostable, ekoStableAmount);
    }

    function buyScoreTokensFromSellOrder(uint orderId) external {
        sl._buyScoreTokenFromSellOrder(orderId);
    }

}