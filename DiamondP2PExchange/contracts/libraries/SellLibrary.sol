//SPDX-License-Identifier: MIT
pragma solidity 0.8.13;
import {DiamondStorage as dsto} from "./DiamondStorage.sol";
import {ErrorsAndEvents as ee} from "./ExchangeEventAndErrors.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
library SellScoreTokenLibrary {
    
    
    function _createSellScoreTokenOrder(uint stAmount, address requestingEkostable, uint ekoStableAmount) internal returns(uint orderId){
        dsto.ExchangeInfoStorage storage es = dsto.getExchangeStorage();
        address scoreTokenAddress = es.scoreTokenAddress;
        if(!es.acceptedEkoStables[requestingEkostable]){
            revert ee.UnacceptedEkoStable(requestingEkostable);
        }
        if(IERC20(scoreTokenAddress).balanceOf(msg.sender) < stAmount){
            revert ee.NotEnougthBalance(scoreTokenAddress);
        }
        uint tempId = es.actualId;
        dsto.order memory tempOrder = dsto.order(scoreTokenAddress, stAmount, requestingEkostable, ekoStableAmount, tempId, dsto.orderType.Sell, msg.sender);
        es.idToOrder[tempId] = tempOrder;
        EnumerableSet.add(es.addressToIds[msg.sender], tempId);
        EnumerableSet.add(es.sellIds, tempId);

        bool success = IERC20(scoreTokenAddress).transferFrom(msg.sender, address(this), stAmount);
        if(!success){
            revert ee.CannotRetrieveScoreTokens(msg.sender);
        }
        emit ee.SellOrderCreated(msg.sender, tempId, stAmount, requestingEkostable, ekoStableAmount);
        ++es.actualId;
        orderId = tempId;
    }

    function _buyScoreTokenFromSellOrder(uint orderId) internal {
        dsto.ExchangeInfoStorage storage es = dsto.getExchangeStorage();
        dsto.order memory tempOrder = es.idToOrder[orderId];
        if(!EnumerableSet.contains(es.sellIds, orderId)){
            revert ee.UnexistingOrder(orderId);
        }
        if(!EnumerableSet.contains(es.addressToIds[tempOrder.orderOwner], orderId)){
            revert ee.OrderAlreadyFullfilled(tempOrder.orderOwner, orderId);
        }
        if(IERC20(tempOrder.requestingToken).balanceOf(msg.sender) < tempOrder.requestingAmount){
            revert ee.NotEnougthBalance(tempOrder.requestingToken);
        }
        delete es.idToOrder[orderId];
        EnumerableSet.remove(es.addressToIds[tempOrder.orderOwner], orderId);
        EnumerableSet.remove(es.sellIds, orderId);

        bool success = IERC20(tempOrder.requestingToken).transferFrom(msg.sender, tempOrder.orderOwner, tempOrder.requestingAmount);
        if(!success){
            revert ee.CannotRetrieveScoreTokens(msg.sender);
        }
        success = IERC20(tempOrder.givingToken).transfer(msg.sender, tempOrder.givingAmount);
        if(!success){
            revert ee.CannotRetrieveEkoStable(tempOrder.givingToken, address(this));
        }
        emit ee.SellOrderFulfilled(orderId, tempOrder.orderOwner, msg.sender);
    }
}