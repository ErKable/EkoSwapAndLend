//SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {DiamondStorage as dsto} from "./DiamondStorage.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

library ViewsLibrary {
    

    function _getOrdersIdByOwner(address ownerAddress) internal view returns(uint[] memory idList){
        dsto.ExchangeInfoStorage storage es = dsto.getExchangeStorage();
        uint length = EnumerableSet.length(es.addressToIds[ownerAddress]);
        idList = new uint[](length);
        for(uint i = 0; i < length; ++i){
            idList[i] = EnumerableSet.at(es.addressToIds[ownerAddress], i);
        }
    }

    function _getLatestBuyOrders(uint ordersToShow) internal view returns(uint[] memory latestBuyIds){
        dsto.ExchangeInfoStorage storage es = dsto.getExchangeStorage();
        uint length = EnumerableSet.length(es.buyIds);
        if(ordersToShow > length) {
            latestBuyIds = new uint[](length);
            for(uint i = 0; i < length; ++i){
                latestBuyIds[i] = EnumerableSet.at(es.buyIds, length - 1 - i);
            }
        } else {
            latestBuyIds = new uint[](ordersToShow);
            for(uint i = 0; i < ordersToShow; ++i){
                latestBuyIds[i] = EnumerableSet.at(es.buyIds, length - 1 - i);
            }
        }
    }

    function _getLatestSellOrders(uint ordersToShow) internal view returns(uint[] memory latestSellIds){
        dsto.ExchangeInfoStorage storage es = dsto.getExchangeStorage();
        uint length = EnumerableSet.length(es.sellIds);
        if(ordersToShow > length){
            latestSellIds = new uint[](length);
            for(uint i = 0; i < length; ++i){
                latestSellIds[i] = EnumerableSet.at(es.sellIds, length - 1 - i);
            }
        } else {
            latestSellIds = new uint[](ordersToShow);
            for(uint i = 0; i < ordersToShow; ++i){
                latestSellIds[i] = EnumerableSet.at(es.sellIds, length - 1 - i);
            }
        }

    }

    function _getScoreTokenAddress() internal view returns(address scoreTokenAddress){
        dsto.ExchangeInfoStorage storage es = dsto.getExchangeStorage();
        scoreTokenAddress = es.scoreTokenAddress;
    }

    function _getAcceptedEkoStable(address ekoStableAddress) internal view returns(bool isAccepted){
        dsto.ExchangeInfoStorage storage es = dsto.getExchangeStorage();
        isAccepted = es.acceptedEkoStables[ekoStableAddress];
    }

    function _getOrderByOrderId(uint orderId) internal view returns(dsto.order memory rOrder){
        dsto.ExchangeInfoStorage storage es = dsto.getExchangeStorage();
        rOrder = es.idToOrder[orderId];
    }

}