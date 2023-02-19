//SPDX-License-Identifier: MIT
pragma solidity 0.8.13;
import {DiamondStorage as dsto} from "./DiamondStorage.sol";
library OwnershipLib{

    error NotTheOwner(address user, address contractOwner);

    event OwnershipTransferred(address indexed from, address indexed to);

    function setContractOwner(address _newOwner) internal{
        dsto.DStorage storage ds = dsto.getStorage();
        address previousOwner = ds.contractOwner;
        ds.contractOwner = _newOwner;
        emit OwnershipTransferred(previousOwner, _newOwner);
    }

    function getOwner() internal view returns(address owner){
        owner = dsto.getStorage().contractOwner;
    }

    function checkOwnership() internal view{
        if(msg.sender != dsto.getStorage().contractOwner){
            revert NotTheOwner(msg.sender, dsto.getStorage().contractOwner);
        }
    }
    
}