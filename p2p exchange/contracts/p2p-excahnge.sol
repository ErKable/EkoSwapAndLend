//SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract peer2peerExchange is ReentrancyGuard, Ownable{
    //this data structure allows you to managin set of primitive type -> https://docs.openzeppelin.com/contracts/3.x/api/utils#EnumerableSet
    using EnumerableSet for EnumerableSet.UintSet;

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

    EnumerableSet.UintSet private buyIds;
    EnumerableSet.UintSet private sellIds;

    address public scoreTokenAddress; 
    uint public actualId;

    mapping (address => EnumerableSet.UintSet) private addressToIds; //orderIds for each user
    mapping (uint => order) public idToOrder; //orderId to Order
    mapping (address => bool) public acceptedEkoStables; //in this way in future can be added/removed ekostables
    //errors
    error ekoStableUnaccepted(address ekoStableAddress); 
    error notEnougthBalance(address tokenAddress);
    error cannotRetrieveScoreToken(address from);
    error cannotRetrieveEkoStable(address ekoStableAddress, address from);
    error unexistingOrder(uint orderId);
    error orderAlreadyFulfilled(address orderOwner, uint orderId);
    //event
    event sellOrderCreated(address indexed orderOwner, uint indexed orderId, uint scoreTokenAmount, address requestingEkoStable, uint requestingAmount);
    event sellOrderFullfilled(uint indexed orderId, address indexed orderOwner, address indexed buyer);
    event buyOrderCreated(address indexed orderOwner, uint indexed orderId, address ekoStableAddress, uint ekoStableAmount, uint scoreTokenAmount);
    event buyOrderFulfilled(uint indexed orderId, address indexed orderOwner, address indexed seller);
    event orderWithdrawn(address indexed orderOwner, uint indexed orderId);
    event newEkoStableAccepted(address indexed ekoStableAddress);
    event ekoStableNoMoreAccepted(address indexed ekoStableAddress);
    /*
    this function allows scoreTokens owner to create a sell order on the platform.
    stAmount  = scoreToken to sell
    requestingEkoStable = the address of the ekostable the order owner wants in exchange of his scoreTokens. On the front-end there copuld be a drop-down menu in which
                            he can choose the one he prefers.
    ekoStableAmout = the amount of ekostable the order owner wants.
    */
    function createSellScoreTokensOrder(uint stAmount, address requestingEkoStable, uint ekoStableAmount) external nonReentrant returns(uint){
        //checking if the ekoStable is accepted. Just in case someone interacts with the P2P exchange through the etherscan interface.
        if(!acceptedEkoStables[requestingEkoStable]){
            revert ekoStableUnaccepted(requestingEkoStable);
        }
        //checking if the caller has enougth scoreToken to create the sell order
        if(IERC20(scoreTokenAddress).balanceOf(msg.sender) < stAmount){
            revert notEnougthBalance(scoreTokenAddress);
        }
        uint tempId = actualId;
        order memory tempOrder = order(scoreTokenAddress, stAmount, requestingEkoStable, ekoStableAmount, tempId, orderType.Sell, msg.sender);
        idToOrder[tempId] = tempOrder;
        EnumerableSet.add(addressToIds[msg.sender], tempId);
        EnumerableSet.add(sellIds, tempId);
        //retrieving scoreTokens from the caller
        bool success = IERC20(scoreTokenAddress).transferFrom(msg.sender, address(this), stAmount);
        if(!success){
            revert cannotRetrieveScoreToken(msg.sender);
        }
        emit sellOrderCreated(msg.sender, tempId, stAmount, requestingEkoStable, ekoStableAmount);
        ++actualId;
        return tempId;
    }
    /*
    this function allows a buyer to buy a specific order by providing its id
    */
    function buyScoreTokenFromSellOrder(uint orderId) external nonReentrant{
        order memory tempOrder = idToOrder[orderId];
        //checking if the sellOrder exists
        if(!EnumerableSet.contains(sellIds, orderId)){
            revert unexistingOrder(orderId);
        }
        //checking if the order is still valid
        if(!EnumerableSet.contains(addressToIds[tempOrder.orderOwner], orderId)){
            revert orderAlreadyFulfilled(tempOrder.orderOwner, orderId);
        } 
        //checking if the buyer has enougth ekoStable to buy the order         
        if(IERC20(tempOrder.requestingToken).balanceOf(msg.sender) < tempOrder.requestingAmount){
            revert notEnougthBalance(tempOrder.requestingToken);
        } 
        //Storage managing     
        delete idToOrder[orderId];
        EnumerableSet.remove(addressToIds[tempOrder.orderOwner], orderId);
        EnumerableSet.remove(sellIds, orderId);
        //retrieving the ekoStable from the buyer and sending them to the seller
        bool success = IERC20(tempOrder.requestingToken).transferFrom(msg.sender, tempOrder.orderOwner, tempOrder.requestingAmount);
        if(!success){
            revert cannotRetrieveEkoStable(tempOrder.requestingToken, msg.sender);
        }
        //retrieving the scoreToken on the sc and sending them to the buyer
        (success) = IERC20(scoreTokenAddress).transfer(msg.sender, tempOrder.givingAmount);
        if(!success){
            revert cannotRetrieveScoreToken(address(this));
        }
        emit sellOrderFullfilled(orderId, tempOrder.orderOwner, msg.sender);
    }
    /*
    This function works the opposite of createSellScoreTokensOrder(), basically allows a buyer to create buy order for scoreTokens
    ekoStableAddress: the address of the ekoStable he's giving
    givingAmount: the amount of ekoStable he's giving
    requestingScoreToken: the amount of scoreTokens he wants
    */
    function createBuyScoreTokensOrder(address ekoStableAddress, uint givingAmount, uint requestingScoreToken) external nonReentrant returns(uint){
        //checking if the ekoStable address provided is valid
        if(!acceptedEkoStables[ekoStableAddress]){
            revert ekoStableUnaccepted(ekoStableAddress);
        }
        //checking if the caller has enougth balance
        if(IERC20(ekoStableAddress).balanceOf(msg.sender) < givingAmount){
            revert notEnougthBalance(ekoStableAddress);
        }
        uint tempId = actualId;
        order memory tempOrder = order(ekoStableAddress, givingAmount, scoreTokenAddress, requestingScoreToken, tempId, orderType.Buy, msg.sender);
        idToOrder[tempId] = tempOrder;
        EnumerableSet.add(addressToIds[msg.sender], tempId);
        EnumerableSet.add(buyIds, tempId);
        //retrieving the ekoStable from the caller
        bool success = IERC20(ekoStableAddress).transferFrom(msg.sender, address(this), givingAmount);
        if(!success){
            revert cannotRetrieveEkoStable(ekoStableAddress, msg.sender);
        }
        emit buyOrderCreated(msg.sender, tempId, ekoStableAddress, givingAmount, requestingScoreToken);
        ++actualId;
        return tempId;
    }
    /*
    this function works the opposite of buyScoreTokenFromSellOrder() and allows seller to sell their tokens to a specif sell order by providing its id
    */
    function sellScoreTokensToABuyOrder(uint orderId) external{
        order memory tempOrder = idToOrder[orderId];
        //checking if the order exists
        if(!EnumerableSet.contains(buyIds, orderId)){
            revert unexistingOrder(orderId);
        }
        //checking if the order is still valid
        if(!EnumerableSet.contains(addressToIds[tempOrder.orderOwner], orderId)){
            revert orderAlreadyFulfilled(tempOrder.orderOwner, orderId);
        }
        //checking if the caller has enougth score token      
        if(IERC20(scoreTokenAddress).balanceOf(msg.sender) < tempOrder.requestingAmount){
            revert notEnougthBalance(tempOrder.requestingToken);
        }
        //storage managing
        delete idToOrder[orderId];
        EnumerableSet.remove(addressToIds[tempOrder.orderOwner], orderId);
        EnumerableSet.remove(buyIds, orderId);
        //sending the scoreToken from the seller to the buyer
        bool success = IERC20(scoreTokenAddress).transferFrom(msg.sender, tempOrder.orderOwner, tempOrder.requestingAmount);
         if(!success){
            revert cannotRetrieveScoreToken(msg.sender);
        }
        //sending the ekostable from the sc to the seller
        success = IERC20(tempOrder.givingToken).transferFrom(address(this), msg.sender, tempOrder.givingAmount);
        if(!success){
            revert cannotRetrieveEkoStable(tempOrder.givingToken, address(this));
        }
        emit buyOrderFulfilled(orderId, tempOrder.orderOwner, msg.sender);
    }
    /*
    This function allows a orderOrder to withdraw his order if it's not already fulfilled
    orderId = the id of the order
    isBuyOrder = the type of the order, on the front-end there could be a drop-down menu where the user can choose
    */
    function withdrawOrder(uint orderId, orderType isBuyOrder) external {
        //cheking if the id exists and removing it from the appropriate list
        if(isBuyOrder == orderType.Buy){
            if(EnumerableSet.contains(buyIds, orderId)){                
                EnumerableSet.remove(buyIds, orderId);
            } else revert unexistingOrder(orderId);
        } else{
            if(EnumerableSet.contains(sellIds, orderId)){
                EnumerableSet.remove(sellIds, orderId);
            } else revert unexistingOrder(orderId);
        }        
        //checking if the caller is the owner
        if(!EnumerableSet.contains(addressToIds[msg.sender], orderId)){
            revert orderAlreadyFulfilled(msg.sender, orderId);
        }
        order memory tempOrder = idToOrder[orderId];
        //storage managing
        delete idToOrder[orderId];
        EnumerableSet.remove(addressToIds[msg.sender], orderId);
        //retrieving the tokens he sent to the sc
        bool success = IERC20(tempOrder.givingToken).transferFrom(address(this), msg.sender, tempOrder.givingAmount);
        if(isBuyOrder == orderType.Buy){
            if(!success){
                revert cannotRetrieveEkoStable(tempOrder.givingToken, address(this));
            } else{
                if(!success){
                    revert cannotRetrieveScoreToken(address(this));
                }
            }
        }
        emit orderWithdrawn(msg.sender, orderId);
    }

    /*This view function allows the caller to see all the order ids associated to an address. Maybe usefull on the front end
    owner = the address of the orders owner
    */
    function getAddressToIds(address owner) external view returns(uint[] memory){
        uint length = EnumerableSet.length(addressToIds[owner]);
        uint[] memory ids = new uint[](length);
        for(uint i = 0; i < length; ++i){
            ids[i] = EnumerableSet.at(addressToIds[owner], i);
        }
        return ids;
    }
    /*
    This view function allows the caller the have a list of the last buy orders created. Maybe usefull on the front end
    orderToShow = the number of the order to display
    */
    function getLastBuysOrders(uint ordersToShow) external view returns(uint[] memory){
        uint[] memory ids;
        uint length = EnumerableSet.length(buyIds);
        if(ordersToShow > length){
            ids = new uint[](length);
            for(uint i = 0; i < length; ++i){
                ids[i] = EnumerableSet.at(buyIds, length - i);
            }
        } else{
            ids = new uint[](ordersToShow);
            for(uint i = 0; i < ordersToShow; ++i){
                ids[i] = EnumerableSet.at(buyIds, length - i);
            }
        }
        return ids;
    }
    /*
    This view function allows the caller the have a list of the last sell orders created. Maybe usefull on the front end
    orderToShow = the number of the order to display
    */
    function getLastSellOrders(uint ordersToShow) external view returns(uint[] memory){
        uint[] memory ids;
        uint length = EnumerableSet.length(sellIds);
        if(ordersToShow > length){
            ids = new uint[](length);
            for(uint i = 0; i < length; ++i){
                ids[i] = EnumerableSet.at(sellIds, length - i);
            }
        } else{
            ids = new uint[](ordersToShow);
            for(uint i = 0; i < ordersToShow; ++i){
                ids[i] = EnumerableSet.at(sellIds, length - 1);
            }
        }
        return ids;
    }
    /*
    this function allows the owner of the sc to add new ekoStables in the accepted ones
    */
    function addEkoStable(address _ekoStableAddress) external onlyOwner{
        acceptedEkoStables[_ekoStableAddress] = true;
        emit newEkoStableAccepted(_ekoStableAddress);
    }
    /*
    this function allows the owner of the sc to remove an ekoStable from the accepets ones
    */
    function removeEkoStabl(address _ekoStableAddress) external onlyOwner{
        acceptedEkoStables[_ekoStableAddress] = false;
        emit ekoStableNoMoreAccepted(_ekoStableAddress);
    }
    
    /*
    this function allows the owner of the sc to modify the scoreToken address
    */
    function setScoreTokenAddress(address newScoreTokenAddress) external onlyOwner{
        scoreTokenAddress = newScoreTokenAddress;
    }

}
