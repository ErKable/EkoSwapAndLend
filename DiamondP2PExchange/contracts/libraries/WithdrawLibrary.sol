//SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {DiamondStorage as dsto} from "./DiamondStorage.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {ErrorsAndEvents as ee} from "./ExchangeEventAndErrors.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

library WithdrawLibrary {

    function _withdrawOrder(uint orderId, dsto.orderType _isBuyOrder) internal {
        dsto.ExchangeInfoStorage storage es = dsto.getExchangeStorage();
        if(_isBuyOrder == dsto.orderType.Buy){
            if(EnumerableSet.contains(es.buyIds, orderId)){
                EnumerableSet.remove(es.buyIds, orderId);
            } else revert ee.UnexistingOrder(orderId);
        } else {
            if(EnumerableSet.contains(es.sellIds, orderId)){
                EnumerableSet.remove(es.sellIds, orderId);
            } else revert ee.UnexistingOrder(orderId);
        }
        if(!EnumerableSet.contains(es.addressToIds[msg.sender], orderId)){
            revert ee.OrderAlreadyFulfilleOrTheCallerIsNotTheOwner(orderId);
        }
        dsto.order memory tempOrder = es.idToOrder[orderId];
        delete es.idToOrder[orderId];
        EnumerableSet.remove(es.addressToIds[msg.sender], orderId);
        bool success = IERC20(tempOrder.givingToken).transfer(msg.sender, tempOrder.givingAmount);
        if(!success){
            if(_isBuyOrder == dsto.orderType.Buy){
                revert ee.CannotRetrieveScoreTokens(address(this));
            } else {
                revert ee.CannotRetrieveEkoStable(tempOrder.givingToken, address(this));
            }
        }
        emit ee.OrderWithdrawn(msg.sender, orderId);
    }
}