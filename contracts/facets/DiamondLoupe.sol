//SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import {DiamondLoupeLib as dll} from "../libraries/DiamondLoupeLib.sol";

contract DiamondLoupe {

    function getFacets() external view returns(dll.Facet[] memory){
        return dll._getFacets();
    }

    function getFacetsAddresses() external view returns(address[] memory){
        return dll._getFacetsAddresses();
    }

    function getFacetAddress(bytes4 functionSelector) external view returns(address facetAddress){
        facetAddress = dll._getFacetAddress(functionSelector);
    }

    function getFunctionSelectors(address facetAddress) external view returns(bytes4[] memory functionSelectors){
        functionSelectors = dll._getFunctionSelectors(facetAddress);
    }
}