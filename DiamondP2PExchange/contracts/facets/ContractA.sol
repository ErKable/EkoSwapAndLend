//SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

contract ContractA {

    function getMessage() external pure returns(string memory message){
        message = 'Message from contract A';
    }
}