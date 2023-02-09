//SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import {OwnershipLib as lib} from "../libraries/OwnershipLib.sol";

contract OwnershipFacet{

    function transferOwnership(address newOwner) external {
        lib.checkOwnership();
        lib.setContractOwner(newOwner);
    }

    function owner() external view returns(address _owner){
        _owner = lib.getOwner();
    }
}