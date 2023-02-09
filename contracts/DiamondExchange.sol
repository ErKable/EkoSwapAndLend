//SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {DiamondStorage as dsl} from "./libraries/DiamondStorage.sol";
import {DiamondCutLib as dcl} from "./libraries/DiamondCutLib.sol";
import {DiamondLoupeLib as dll} from "./libraries/DiamondLoupeLib.sol";
import {OwnershipLib as ol} from "./libraries/OwnershipLib.sol";
contract DiamondExchange {


    constructor(dcl.FacetCut[] memory diamondCuts) {
        ol.setContractOwner(msg.sender);       
        dcl._diamondCut(diamondCuts);        
    }

    fallback() external payable{
        dsl.DStorage storage ds = dsl.getStorage();
        //retrieving facet address
        address facet = ds.facetAddressAndSelectorPosition[msg.sig].facetAddress;
        if(facet == address(0)){
            revert dcl.UnexistingFunctionSelector(msg.sig);
        }

        assembly{
            //copy function selector and any arguments
            calldatacopy(0, 0, calldatasize()) // => copies tthe calldata into memory which is where delegatecall loads from
            // execute function call against the relevant facet
            // note that we send in the entire calldata including the function selector
            let result := delegatecall(gas(), facet, 0, calldatasize(), 0, 0)
            //get any return value
            returndatacopy(0, 0, returndatasize())
            //return any return value or error back to the calle
            switch result
                case 0 {
                    revert(0, returndatasize()) //so revert
                }
                default{
                    return(0, returndatasize()) //delegatecall succeded, return any return data
                }
        }
    }

    receive() external payable{}
    
}