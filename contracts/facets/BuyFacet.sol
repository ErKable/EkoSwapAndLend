//SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {BuyScoreTokensLibrary as bs} from "../libraries/BuyLibrary.sol";

contract BuyScoreTokenFacet {

    function createBuyScoreTokensOrder(address ekoStableAddress, uint givingAmount, uint requestingAmount) external returns(uint orderId){
        orderId = bs._createBuyScoreTokensOrder(ekoStableAddress, givingAmount, requestingAmount);
    }

    function sellScoreTokenToABuyOrder(uint orderId) external {
        bs._sellScoreTokenToABuyOrder(orderId);
    }

}