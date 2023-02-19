//SPDX-License-Identifier: MIT

pragma solidity 0.8.13;
import {DiamondStorage as dsto} from "./DiamondStorage.sol";
import "hardhat/console.sol";
library DiamondLoupeLib{

    struct Facet{
        address facetAddress;
        bytes4[] selectors;
    }

    function _getFacets() internal view returns(Facet[] memory facets){
        dsto.DStorage storage ds = dsto.getStorage();
        uint selectorCount = ds.selectors.length;
        facets = new Facet[](selectorCount);
        uint16[] memory numFacetSelectors = new uint16[](selectorCount);
        uint numFacets;

        for(uint selectorIndex; selectorIndex < selectorCount; ++selectorIndex){
            bytes4 selector = ds.selectors[selectorIndex];
            address facetAddress = ds.facetAddressAndSelectorPosition[selector].facetAddress;
            bool continueLoop = false;

            for(uint256 facetIndex; facetIndex < numFacets; ++facetIndex){
                if(facets[facetIndex].facetAddress == facetAddress){
                    facets[facetIndex].selectors[numFacetSelectors[facetIndex]] = selector;
                    ++numFacetSelectors[facetIndex];
                    continueLoop = true;
                    break;
                }
            }
            if(continueLoop){
                continueLoop = false;
                continue;
            }
            facets[numFacets].facetAddress = facetAddress;
            facets[numFacets].selectors = new bytes4[](selectorCount);
            facets[numFacets].selectors[0] = selector;
            numFacetSelectors[numFacets] = 1;
            ++numFacets;
        }
        for(uint facetIndex = 0; facetIndex < numFacets; ++facetIndex){
            uint numSelectors = numFacetSelectors[facetIndex];
            bytes4[] memory selectors = facets[facetIndex].selectors;

            assembly{
                mstore(selectors, numSelectors)
            }
        }
        assembly{
            mstore(facets, numFacets)
        }
    }

    function _getFacetsAddresses() internal view returns(address[] memory facetAddresses){
        dsto.DStorage storage ds = dsto.getStorage();
        uint selectorCount = ds.selectors.length;
        
        facetAddresses = new address[](selectorCount);
        uint numFacets;

        for(uint selectorIndex; selectorIndex < selectorCount; ++selectorIndex){
            bytes4 selector = ds.selectors[selectorIndex];
            address facetAddress = ds.facetAddressAndSelectorPosition[selector].facetAddress;
            bool continueLoop = false;

            for(uint facetIndex; facetIndex < numFacets; ++facetIndex){
                if(facetAddress == facetAddresses[facetIndex]){
                    continueLoop = true;
                    break;
                }
            }
            if(continueLoop){
                continueLoop = false;
                continue;
            }
            facetAddresses[numFacets] = facetAddress;
            ++numFacets;
        }
        assembly{
            mstore(facetAddresses, numFacets)
        }
    }

    function _getFacetAddress(bytes4 functionSelector) internal view returns(address facetAddress){
        dsto.DStorage storage ds = dsto.getStorage();
        facetAddress = ds.facetAddressAndSelectorPosition[functionSelector].facetAddress;
    }

    function _getFunctionSelectors(address facet) internal view returns(bytes4[] memory functionSelectors){
        dsto.DStorage storage ds = dsto.getStorage();
        uint selectorCount = ds.selectors.length;
        uint numSelectors;
        functionSelectors = new bytes4[](selectorCount);

        for(uint selectorIndex; selectorIndex < selectorCount; ++selectorIndex){
            bytes4 selector = ds.selectors[selectorIndex];
            address facetAddress = ds.facetAddressAndSelectorPosition[selector].facetAddress;
            if(facet == facetAddress){
                functionSelectors[numSelectors] = selector;
                ++numSelectors;
            }
        }
        assembly{
            mstore(functionSelectors, numSelectors)
        }
    }



}