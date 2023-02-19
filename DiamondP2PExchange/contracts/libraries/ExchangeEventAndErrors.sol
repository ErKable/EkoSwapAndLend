//SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

library ErrorsAndEvents {
    error UnacceptedEkoStable(address ekoStable);
    error NotEnougthBalance(address tokenAddress);
    error CannotRetrieveScoreTokens(address scoreTokenOwner);
    error UnexistingOrder(uint orderId);
    error OrderAlreadyFullfilled(address orderOwner, uint orderId);
    error CannotRetrieveEkoStable(address ekoStable, address from);
    error AlreadyUnacceptedEkoStable(address ekoStable);
    error ScoreTokenCannotHaveZeroAddress();
    error NewScoreTokenAddressEqualToThePrevious();
    error OrderAlreadyFulfilleOrTheCallerIsNotTheOwner(uint orderId);

    event SellOrderCreated(address indexed orderOwner, uint indexed orderId, uint scoreTokenAmount, address requestingEkoStable, uint requestingAmount);
    event SellOrderFulfilled(uint indexed orderId, address indexed orderCreator, address indexed buyer);
    event BuyOrderCreated(address indexed orderOwner, uint indexed orderId, address givingEkostable, uint givingAmount, uint scoreTokenAmount);
    event BuyOrderFulfilled(uint indexed orderId, address indexed orderCreator, address indexed seller);
    event NewEkoStableAccepted(address indexed ekoStableAddress);
    event EkoStableNoMoreAccepted(address indexed ekoStableAddress);
    event ScoreTokenAddressUpdated(address indexed oldAddress, address indexed newAddress);
    event OrderWithdrawn(address indexed orderOwner, uint indexed orderId);
}