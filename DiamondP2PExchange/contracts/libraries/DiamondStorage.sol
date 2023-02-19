//SPDX-License-Identifier: MIT

pragma solidity 0.8.13;


import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

library DiamondStorage{
    
    using EnumerableSet for EnumerableSet.UintSet;
    
    bytes32 constant STORAGE_POSITION = keccak256("Diamond.Exchange.Storage.Position");
    bytes32 constant EXCHANGE_STORAGE = keccak256("Exchange.Storage");

    struct FacetAddressAndSelectorPosition{
        address facetAddress;
        uint16 selectorPosition;
    }

    struct DStorage{        
        mapping(bytes4 => FacetAddressAndSelectorPosition) facetAddressAndSelectorPosition;
        bytes4[] selectors;
        address contractOwner;
    }

    enum orderType{
        Buy,
        Sell
    }

    struct order{
        address givingToken;
        uint256 givingAmount;
        address requestingToken;
        uint256 requestingAmount;
        
        uint256 orderId;
        orderType order;
        address orderOwner;
    }

    struct ExchangeInfoStorage {
        mapping (address => EnumerableSet.UintSet) addressToIds; //orderIds for each user
        mapping (uint => order) idToOrder; //orderId to Order
        mapping (address => bool) acceptedEkoStables;
        EnumerableSet.UintSet buyIds;
        EnumerableSet.UintSet sellIds;
        address  scoreTokenAddress; 
        uint  actualId;
    }

    function getStorage() internal pure returns(DStorage storage DStorageStruct){
        bytes32 position = STORAGE_POSITION;
        assembly {
            DStorageStruct.slot := position
        }
    } 

    function getExchangeStorage() internal pure returns(ExchangeInfoStorage storage ExchangeInfo){
        bytes32 position = EXCHANGE_STORAGE;
        assembly{
            ExchangeInfo.slot := position
        }
    }  

    

}
