//SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {OwnershipLib as ol} from "./OwnershipLib.sol";
import {DiamondStorage as dsto} from "./DiamondStorage.sol";
import {ErrorsAndEvents as ee} from "./ExchangeEventAndErrors.sol";

library OwnerActionsLibrary {

    function _addEkoStable(address _ekoStableAddress) internal {
        ol.checkOwnership();
        dsto.ExchangeInfoStorage storage es = dsto.getExchangeStorage();
        es.acceptedEkoStables[_ekoStableAddress] = true;
        emit ee.NewEkoStableAccepted(_ekoStableAddress);
    }

    function _removeEkoStable(address _ekoStableAddress) internal {
        ol.checkOwnership();
        dsto.ExchangeInfoStorage storage es = dsto.getExchangeStorage();
        if(es.acceptedEkoStables[_ekoStableAddress]){
            es.acceptedEkoStables[_ekoStableAddress] = false;
            emit ee.EkoStableNoMoreAccepted(_ekoStableAddress);
        } else{
            revert ee.AlreadyUnacceptedEkoStable(_ekoStableAddress);
        }
    }

    function _setScoreTokenAddress(address _newScoreTokenAddress) internal {
        ol.checkOwnership();
        if(_newScoreTokenAddress == address(0)){
            revert ee.ScoreTokenCannotHaveZeroAddress();
        }        
        dsto.ExchangeInfoStorage storage es = dsto.getExchangeStorage();
        address scoreTokenAddress = es.scoreTokenAddress;
        if(_newScoreTokenAddress == scoreTokenAddress){
            revert ee.NewScoreTokenAddressEqualToThePrevious();
        }
        es.scoreTokenAddress = _newScoreTokenAddress;
        emit ee.ScoreTokenAddressUpdated(scoreTokenAddress, _newScoreTokenAddress);
    }

}