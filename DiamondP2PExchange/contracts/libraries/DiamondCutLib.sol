//SPDX-License-Identifier: MIT
pragma solidity 0.8.13;
import {DiamondStorage as dsto} from "./DiamondStorage.sol";
import "hardhat/console.sol";
library DiamondCutLib {

    enum FacetCuAction{
        Add,
        Replace,
        Remove
    }

    struct FacetCut {
        address facetAddress; //facet contract address
        bytes4[] functionSelectors; //which function from this facet we want to add
        FacetCuAction action;
    }

    event DiamondCut(FacetCut diamondCut);


    error CannotAddSelectorsToZeroAddress(bytes4[] selectors);
    error CannotAddAlreadyExistingFunction(bytes4 selector);
    error CannotReplaceFunctionWithZeroAddress(bytes4[] selectors);
    error CannotReplaceImmutableFunction(bytes4 selector);
    error CannotReplaceFunctionFromTheSameFacet(bytes4 selector);
    error CannotReplaceUnexistingFunction(bytes4 selector);
    error RemoveFacetAddressMustBeZeroAddress(address facetAddress);
    error CannotRemoveUnexistingFunction(bytes4 selector);
    error CannotRemoveImmutableFunction(bytes4 selector);
    error functionSelectorAlreadyExisting(bytes4 functionSelector);
    error NoSelectorsGiven(FacetCut diamondCut);
    error cannotRemoveSelectorsFromZeroAddress(FacetCut diamondCut);
    error UnexistingFunctionSelector(bytes4 functionSelector);
    error cannotReplaceSelectorsFromZeroAddress(FacetCut diamondCut);
    error IncorrectAction(FacetCut diamondCut);

    function _diamondCut(FacetCut[] memory diamondCut) internal {
        console.log('Diamond cut chiamatp');
        for(uint facetIndex = 0 ; facetIndex < diamondCut.length; ++facetIndex){
            bytes4[] memory functionSelectors = diamondCut[facetIndex].functionSelectors;
            address facetAddress = diamondCut[facetIndex].facetAddress;
            console.log('facetAddress', facetAddress);
            if(functionSelectors.length == 0){
                revert NoSelectorsGiven(diamondCut[facetIndex]);
            }
            FacetCuAction action = diamondCut[facetIndex].action;
            if(action == FacetCuAction.Add){
                addFunctions(facetAddress, functionSelectors);
            } else if (action == FacetCuAction.Replace){
                replaceFunctions(facetAddress, functionSelectors);
            } else if (action == FacetCuAction.Remove){
                removeFunctions(facetAddress, functionSelectors);
            } else{
                revert IncorrectAction(diamondCut[facetIndex]);
            }
            emit DiamondCut(diamondCut[facetIndex]);
        }    
    }

    function addFunctions(address _facetAddress, bytes4[] memory _functionSelectors) internal {
        console.log('Add function chiamato', _facetAddress);
        if(_facetAddress == address(0)){
            revert CannotAddSelectorsToZeroAddress(_functionSelectors);
        }
        dsto.DStorage storage ds = dsto.getStorage();
        uint16 selectorCount = uint16(ds.selectors.length);
        _enforceHasContractCode(_facetAddress, "LibDiamondCut: Add facet has no code");
        for(uint selectorIndex; selectorIndex < _functionSelectors.length; ++selectorIndex){
            bytes4 selector = _functionSelectors[selectorIndex];
            address oldFacetAddress = ds.facetAddressAndSelectorPosition[selector].facetAddress;
            if(oldFacetAddress != address(0)){
                revert CannotAddAlreadyExistingFunction(selector);
            }
            ds.facetAddressAndSelectorPosition[selector] = dsto.FacetAddressAndSelectorPosition(_facetAddress, selectorCount);
            ds.selectors.push(selector);
            ++selectorCount;            
        }        
    }

    function replaceFunctions(address _facetAddress, bytes4[] memory selectors) internal {
        dsto.DStorage storage ds = dsto.getStorage();
        if(_facetAddress == address(0)){
            revert CannotReplaceFunctionWithZeroAddress(selectors);            
        }
        _enforceHasContractCode(_facetAddress, "LibDiamondCut: Replace facet has no code");
        for(uint selectorIndex; selectorIndex < selectors.length; ++selectorIndex){
            bytes4 selector = selectors[selectorIndex];
            address oldFacetAddress = ds.facetAddressAndSelectorPosition[selector].facetAddress;

            if(oldFacetAddress == address(this)){
                revert CannotReplaceImmutableFunction(selector);
            }
            if(oldFacetAddress == _facetAddress){
                revert CannotReplaceFunctionFromTheSameFacet(selector);
            }
            if(oldFacetAddress == address(0)){
                revert CannotReplaceUnexistingFunction(selector);
            }
            ds.facetAddressAndSelectorPosition[selector].facetAddress = _facetAddress;
        }
    }

    function removeFunctions(address _facetAddress, bytes4[] memory selectors) internal {
        dsto.DStorage storage ds = dsto.getStorage();
        uint selectorCount = ds.selectors.length;
        if(_facetAddress != address(0)){
            revert RemoveFacetAddressMustBeZeroAddress(_facetAddress);
        }
        for(uint selectorIndex = 0; selectorIndex < selectors.length; ++selectorIndex){
            bytes4 selector = selectors[selectorIndex];
            dsto.FacetAddressAndSelectorPosition memory oldFacetAddressAndSelectorPosition = ds.facetAddressAndSelectorPosition[selector];
            if(oldFacetAddressAndSelectorPosition.facetAddress == address(0)){
                revert CannotRemoveUnexistingFunction(selector);
            }

            if(oldFacetAddressAndSelectorPosition.facetAddress == address(this)){
                revert CannotRemoveImmutableFunction(selector);
            }

            --selectorCount;
            if(oldFacetAddressAndSelectorPosition.selectorPosition != selectorCount){
                bytes4 lastSelector = ds.selectors[selectorCount];
                ds.selectors[oldFacetAddressAndSelectorPosition.selectorPosition] = lastSelector;
                ds.facetAddressAndSelectorPosition[lastSelector].selectorPosition = oldFacetAddressAndSelectorPosition.selectorPosition;
            }
            ds.selectors.pop();
            delete ds.facetAddressAndSelectorPosition[selector];
        }
    }

    function _enforceHasContractCode(address _contract, string memory _errorMessage) private view {
        uint256 contractSize;
        assembly {
            contractSize := extcodesize(_contract)
        }
        require(contractSize > 0, _errorMessage);
    }


/*     function addFunction(FacetCut memory diamondCut) internal {
        dsto.DStorage storage ds = dsto.getStorage();
        for(uint i = 0; i < diamondCut.functionSelectors.length; ++i){
            if(diamondCut.functionSelectors.length == 0){
                revert NoSelectorsGiven(diamondCut);
            }
            if(diamondCut.facetAddress == address(0)){
                revert CannotAddSelectorsToZeroAddress(diamondCut);
            }
            if(ds.selectorToAddress[diamondCut.functionSelectors[i]] != address(0)){
                revert functionSelectorAlreadyExisting(diamondCut.functionSelectors[i]);
            }
            _enforceHasContractCode(diamondCut.facetAddress, "No facet implementation");          
            ds.selectorToAddress[diamondCut.functionSelectors[i]] = diamondCut.facetAddress;
            ds.addressToSelectors[diamondCut.facetAddress].push(diamondCut.functionSelectors[i]);
            ds.addressToSelectorToPosition[diamondCut.facetAddress][diamondCut.functionSelectors[i]] = ds.addressToSelectors[diamondCut.facetAddress].length;
            ds.facetAddresses.push(diamondCut.facetAddress);
            uint length =  ds.facetAddresses.length;
            ds.indexToFacet[length-1] = diamondCut.facetAddress;
            emit DiamondCut(diamondCut);
        }
    }

    function removeFunction(FacetCut memory diamondCut) internal {
        dsto.DStorage storage ds = dsto.getStorage();
        for(uint i = 0; i < diamondCut.functionSelectors.length; ++i){
            if(diamondCut.functionSelectors.length == 0){
                revert NoSelectorsGiven(diamondCut);
            }
            if(diamondCut.facetAddress == address(0)){
                revert cannotRemoveSelectorsFromZeroAddress(diamondCut);
            }
            if(ds.selectorToAddress[diamondCut.functionSelectors[i]] == address(0)){
                revert UnexistingFunctionSelector(diamondCut.functionSelectors[i]);
            }
            delete ds.selectorToAddress[diamondCut.functionSelectors[i]];
            uint oldPosition = ds.addressToSelectorToPosition[diamondCut.facetAddress][diamondCut.functionSelectors[i]];
            delete ds.addressToSelectorToPosition[diamondCut.facetAddress][diamondCut.functionSelectors[i]];
            delete ds.addressToSelectors[diamondCut.facetAddress][oldPosition];
            emit DiamondCut(diamondCut);          
        }
    }

    function replaceFunction(FacetCut memory diamondCut) internal {
        dsto.DStorage storage ds = dsto.getStorage();
        for(uint i = 0; i < diamondCut.functionSelectors.length; ++i){
            if(diamondCut.functionSelectors.length == 0){
                revert NoSelectorsGiven(diamondCut);
            }
            if(diamondCut.facetAddress == address(0)){
                revert cannotReplaceSelectorsFromZeroAddress(diamondCut);
            }
            if(ds.selectorToAddress[diamondCut.functionSelectors[i]] == address(0)){
                revert UnexistingFunctionSelector(diamondCut.functionSelectors[i]);
            }
            ds.selectorToAddress[diamondCut.functionSelectors[i]] = diamondCut.facetAddress;
            uint oldPosition = ds.addressToSelectorToPosition[diamondCut.facetAddress][diamondCut.functionSelectors[i]];
            delete ds.addressToSelectorToPosition[diamondCut.facetAddress][diamondCut.functionSelectors[i]];
            delete ds.addressToSelectors[diamondCut.facetAddress][oldPosition];
            ds.addressToSelectors[diamondCut.facetAddress].push(diamondCut.functionSelectors[i]);
            ds.addressToSelectorToPosition[diamondCut.facetAddress][diamondCut.functionSelectors[i]] = ds.addressToSelectors[diamondCut.facetAddress].length;
            emit DiamondCut(diamondCut); 
        }
    } */
}