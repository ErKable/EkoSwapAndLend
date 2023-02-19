//SPDX-License-Identifier: MIT
pragma solidity 0.8.13;
import {DiamondStorage as dsto} from "./DiamondStorage.sol";
import {ErrorsAndEvents as ee} from "./ExchangeEventAndErrors.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";
library BuyScoreTokensLibrary {
    function _createBuyScoreTokensOrder(address ekoStableAddress, uint givingAmount, uint requestingAmount) internal returns(uint orderId){
        dsto.ExchangeInfoStorage storage es = dsto.getExchangeStorage();
        if(!es.acceptedEkoStables[ekoStableAddress]){
            revert ee.UnacceptedEkoStable(ekoStableAddress);
        } 
        if(IERC20(ekoStableAddress).balanceOf(msg.sender) < givingAmount){
            revert ee.NotEnougthBalance(ekoStableAddress);
        } 
        uint tempId = es.actualId;
        dsto.order memory tempOrder = dsto.order(ekoStableAddress, givingAmount, es.scoreTokenAddress, requestingAmount, tempId, dsto.orderType.Buy, msg.sender);
        es.idToOrder[tempId] = tempOrder;
        EnumerableSet.add(es.addressToIds[msg.sender], tempId);
        EnumerableSet.add(es.buyIds, tempId);

        bool success = IERC20(ekoStableAddress).transferFrom(msg.sender, address(this), givingAmount);
        if(!success){
            revert ee.CannotRetrieveEkoStable(ekoStableAddress, msg.sender);
        }
        emit ee.BuyOrderCreated(msg.sender, tempId, ekoStableAddress, givingAmount, requestingAmount);
        ++ es.actualId;
        orderId = tempId;
    }

    function _sellScoreTokenToABuyOrder(uint orderId) internal {
        dsto.ExchangeInfoStorage storage es = dsto.getExchangeStorage();
        dsto.order memory tempOrder = es.idToOrder[orderId];

        if(!EnumerableSet.contains(es.buyIds, orderId)){
            revert ee.UnexistingOrder(orderId);
        }
        if(!EnumerableSet.contains(es.addressToIds[tempOrder.orderOwner], orderId)){
           revert ee.OrderAlreadyFullfilled(tempOrder.orderOwner ,orderId); 
        }
        address scoreTokenAddress = es.scoreTokenAddress;
        if(IERC20(scoreTokenAddress).balanceOf(msg.sender) < tempOrder.requestingAmount){
            revert ee.NotEnougthBalance(scoreTokenAddress);
        }

        delete es.idToOrder[orderId];
        EnumerableSet.remove(es.addressToIds[tempOrder.orderOwner], orderId);
        EnumerableSet.remove(es.buyIds, orderId);
        console.log('ORDER OWNER', tempOrder.orderOwner);
        bool success = IERC20(scoreTokenAddress).transferFrom(msg.sender, tempOrder.orderOwner, tempOrder.requestingAmount);
        if(!success){
            revert ee.CannotRetrieveScoreTokens(msg.sender);
        }
        console.log('Primo transfer');
        success = IERC20(tempOrder.givingToken).transfer(msg.sender, tempOrder.givingAmount);
        if(!success){
            revert ee.CannotRetrieveEkoStable(tempOrder.givingToken, address(this));
        }
        console.log('secondo transfer');
        emit ee.BuyOrderFulfilled(orderId, tempOrder.orderOwner, msg.sender);
    }
}