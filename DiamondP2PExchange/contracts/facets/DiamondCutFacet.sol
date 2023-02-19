//SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import {DiamondCutLib as dcl} from "../libraries/DiamondCutLib.sol";
import {OwnershipLib as ol} from "../libraries/OwnershipLib.sol";
contract DiamondCutFacet {

    function diamondCut(dcl.FacetCut[] memory _diamondCut) external {
        ol.checkOwnership();
        dcl._diamondCut(_diamondCut);
    }   
}