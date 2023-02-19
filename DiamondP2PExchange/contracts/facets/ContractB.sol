//SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

contract ContractB {

    function getMessage() external pure returns(string memory message){
        message = 'Message from contract B';
    }
}