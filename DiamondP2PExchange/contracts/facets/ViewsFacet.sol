//SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import {ViewsLibrary as vl} from "../libraries/ViewsLibrary.sol";
import {DiamondStorage as dsto} from "../libraries/DiamondStorage.sol";
contract ViewsFacet {

    function getOrdersIdByOwner(address ownerAddress) external view returns(uint[] memory idList){
        idList = vl._getOrdersIdByOwner(ownerAddress);
    }

    function getLatestBuyOrders(uint ordersToShow) external view returns(uint[] memory latestBuyIds){
        latestBuyIds = vl._getLatestBuyOrders(ordersToShow);
    }

    function getLatestSellOrders(uint ordersToShow) external view returns(uint[] memory latestSellIds){
        latestSellIds = vl._getLatestSellOrders(ordersToShow);
    }

    function getAcceptedEkoStable(address ekoStableAddress) external view returns(bool isAccepted){
        return vl._getAcceptedEkoStable(ekoStableAddress);
    }

    function getScoreTokenAddress() external view returns(address scoreTokenAddress){
        scoreTokenAddress = vl._getScoreTokenAddress();
    }

    function getOrderByOrderId(uint orderId) external view returns(dsto.order memory rOrder){
        rOrder = vl._getOrderByOrderId(orderId);
    }

}