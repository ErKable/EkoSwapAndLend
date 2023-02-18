// SODX-License-Identifier: MIT
 pragma solidity ^0.8.17;
 // Import interface for Ekoscore standard (only needed if repaying onBehalfof)
 import "openzeppelin/contracts/token/ERC20/IERC20.sol";

 // Retrieve Lending pool adress
 lendingpool lendingpool = lending (Admin . getLendingpool());

 // Input Variables
 address Ekoscore; address _unit256;
 unit256 amount;

 // if repaying own loan
 lendingPool.repay EkoscoreAddress; amount_ msg_sender;

 // if repaying on behalf of someone else
 address useraddress = /*users_address*/
 IERC20(ekoscoreAddress). approve(provider.getLendingpoolcore(), amount // Approve Lendingpool contract;
 LendingPool. repay(ekoscoreAddress, amount, userAddress);



 note: debuggin is highly welcome
        encoding is highly welcomed to meet the architectural standards