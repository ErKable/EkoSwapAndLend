/*
A simple P2P exchange allows two or more persons who do not know themselves to make a transaction.

Typically in these exchanges, there are two order books. A buying order book and a selling order book.

The selling book contains a list of sellers, the type and amount of tokens they want to sell, and the price in the currency that they want to sell these tokens for.
The Sellers of these tokens, deposit the tokens into the smart contract waiting for a buyer at the defined rate

The Buyer can view a list of all the sellers and then pay for the tokens of choice at the preferred rate.
Once the buyer pays the seller of choice the smart contract transfers the tokens to be purchased automatically to the buyer and pays the seller.
The seller can cancel or update the order while no buyer is interacting with it.

The Buying Order book does the same but the opposite thing. It contains a list of people ready to buy a token and the rate at which they want to buy.
These Buyers have deposited their funds to the smart contract. The seller can view a list of all the buyers and sellers to anyone of choice.

           
Task

Create a currency of your choice, NGN, USD, EUR, INR e.t.c on the blockchain

Create another token. Let sellers or buyers populate other books to sell or buy the other token at a rate of the currency created

 Provide the smart contract function that allows anyone to get the order books and buy or sell from/to the order book
 */

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
contract simpleExchange is ReentrancyGuard{

    enum orderStatus {
        Open,
        Close,
        Cancelled
    }

    enum orderType{
        Buy,
        Sell
    }

    enum tokenType{
        nft,
        token
    }

    struct order{
        address givingToken;
        uint256 givingAmount;
        address requestingToken;
        uint256 requestingAmount;
        uint256 orderId;
        tokenType tokenType;
        orderType orderType;
        orderStatus status;
    }

    uint256 private actualId;
    address[] public sellersBook;
    address[] public buyersBook;
    address[] public traderBook;
    uint256[] public buyIdBook;
    uint256[] public sellIdBook;
    uint256[] public tradeIdBook;

    mapping(address => order[]) public ownerToOrders; 
    mapping(address => uint256[]) public ownerToIds;
    mapping(address => mapping(uint256 => order)) public ownerToOrder; //address => id => order 

    mapping(uint256 => order) public buyOrderBook; //id => buyOrder
    mapping(uint256 => order) public sellOrderBook; //id => sellOrder

    event sellOrderCreated(address indexed sellOwner, address indexed givingToken, uint256 givingAmount, address indexed requestingToken, uint256 requestingAmount, uint256 sellOrderId);
    event sellOrderClosed(address indexed buyer, address indexed sellOwner, uint256 sellId);
    event buyOrderCreated(address indexed sellOwner, address indexed givingToken, uint256 givingAmount, address indexed requestingToken, uint256 requestingAmount, uint256 sellOrderId);
    event buyOrderClosed(address indexed seller, address indexed buyOwner, uint256 buyId);
    event sellNFTOrderCreated(address indexed tradeOwner, address indexed givingNFT, uint256 givingId, address indexed requestingToken, uint256 requestingAmountm, uint256 orderId);
    /*Used by a seller to create an order
    _givingToken: address of token you want to sell
    _givingAmount: the amount of _givingToken you want to sell
    _requestingToken: address of the token you want to buy
    _requestingAmount: the amount of _requestingToken you want
    */
    function createSellOrder(address _givingToken, uint256 _givingAmount, address _requestingToken, uint256 _requestingAmount) external nonReentrant returns(uint256 buyId) {
        //Checks whether the sell owner has enought balance to create the order
        require(IERC20(_givingToken).balanceOf(msg.sender) >= _givingAmount, "Exchange: not enought balance");
        //checking whether the creator has already created an order, it avoids to have same instances of the same address in the list
        if(!isAlreadyInList(msg.sender, false)){
            sellersBook.push(msg.sender);
        }
        uint256 tempId = actualId;
        //adding the sellOrderId to the book of the sell id
        sellIdBook.push(tempId);
        ownerToIds[msg.sender].push(tempId);
        //assosiating an order struct to its owner
        ownerToOrders[msg.sender].push(order(_givingToken, _givingAmount, 
                                            _requestingToken, _requestingAmount, 
                                            tempId, tokenType.token ,orderType.Sell, orderStatus.Open));
        //assosiating an order to its ID and owner
        ownerToOrder[msg.sender][tempId] = order(_givingToken, _givingAmount, 
                                            _requestingToken, _requestingAmount, 
                                            tempId,tokenType.token, orderType.Sell, orderStatus.Open);
        //assosiating an order directly to its id
        sellOrderBook[tempId] =  order(_givingToken, _givingAmount,
                                        _requestingToken, _requestingAmount, 
                                        tempId, tokenType.token, orderType.Sell, orderStatus.Open);
        //retrieving the amount to sell from the sell owner and transferring it to the contract
        bool success = IERC20(_givingToken).transferFrom(msg.sender, address(this), _givingAmount);
        //requiring the success of the previos trnasferFrom
        require(success, "Exchange: something went wrong while creating your sell order");
        //event emit
        emit sellOrderCreated(msg.sender, _givingToken, _givingAmount, _requestingToken, _requestingAmount, tempId);
        //incrementing the actual id for the next order
        ++actualId;
        //returning to id of the order
        return tempId;
    }
    /*Used by a buyer to buy from a sell order*/
    function buyFromSellOrder(address sellOrderOwner, uint256 sellId) external nonReentrant {
        //checking if exists an order at the two indexs provided
        require(ownerToOrder[sellOrderOwner][sellId].givingAmount != 0, "Exchange: wrong order id");
        //retrieving the tempOrder 
        order memory tempOrder = ownerToOrder[sellOrderOwner][sellId];
        require(tempOrder.status == orderStatus.Open, "Exchange: Trying to buy from a closed sell order");
        require(IERC20(tempOrder.requestingToken).balanceOf(msg.sender) >= tempOrder.requestingAmount, "Exchange: not enought balance");
        //transfer from the contract to the buyer
        bool success = IERC20(tempOrder.givingToken).transfer(msg.sender, tempOrder.givingAmount);
        require(success, "Exchange: something went wrong while receiving your tokens");
        //transfer from the buyer to the buy owner
        success = IERC20(tempOrder.requestingToken).transferFrom(msg.sender, sellOrderOwner, tempOrder.requestingAmount);
        require(success, "Exchange: something went wrong while transferring your tokens");
        //closing the order
        uint256 tempIdx = getOrderIndex(sellOrderOwner, sellId);
        ownerToOrders[sellOrderOwner][tempIdx].status = orderStatus.Close;
        ownerToOrder[sellOrderOwner][sellId].status = orderStatus.Close;
        sellOrderBook[sellId].status = orderStatus.Close;
        //emit
        emit sellOrderClosed(msg.sender, sellOrderOwner, sellId);
    }

    /*Used by a buyer to create an order 
    _givingToken: address of token you want to sell
    _givingAmount: the amount of _givingToken you want to sell
    _requestingToken: address of the token you want to buy
    _requestingAmount: the amount of _requestingToken you want
    */
    function createBuyOrder(address _givingToken, uint256 _givingAmount, address _requestingToken, uint256 _requestingAmount) external nonReentrant returns(uint256 selId){
        //Checking if the caller has enought balance
        require(IERC20(_givingToken).balanceOf(msg.sender)>= _givingAmount, "Exchange: not enought balance");
        //checking if the caller has already created a buy order on the exchange, to avoid same instances multiple times
        if(!isAlreadyInList(msg.sender, true)){
            buyersBook.push(msg.sender);
        }
        uint256 tempId = actualId;
        buyIdBook.push(tempId);    
        ownerToIds[msg.sender].push(tempId);
        ownerToOrders[msg.sender].push(order(_givingToken, _givingAmount,  
                                                    _requestingToken, _requestingAmount, 
                                                    tempId, tokenType.token, orderType.Buy, orderStatus.Open));

        ownerToOrder[msg.sender][tempId] = order(_givingToken, _givingAmount, 
                                                    _requestingToken, _requestingAmount,
                                                    tempId, tokenType.token, orderType.Buy, orderStatus.Open);
        
        buyOrderBook[tempId] =  order(_givingToken, _givingAmount,  
                                                    _requestingToken, _requestingAmount,
                                                    tempId, tokenType.token, orderType.Buy, orderStatus.Open);
        //retrieving the amount from the caller and transferring it to the smart contract
        bool success = IERC20(_givingToken).transferFrom(msg.sender, address(this), _givingAmount);
        require(success, "Exchange: something went wrong while creating your buy order");
        emit buyOrderCreated(msg.sender, _givingToken, _givingAmount, _requestingToken, _requestingAmount, tempId);
        actualId ++;
        return tempId;
    }

    function sellToBuyOrder(address buyOrderOwner, uint256 buyId) external nonReentrant {
         //checking if exists an order at the two indexs provided
        require(ownerToOrder[buyOrderOwner][buyId].requestingAmount != 0, "Exchange: wrong order id");
        order memory tempOrder = ownerToOrder[buyOrderOwner][buyId];
        require(tempOrder.status == orderStatus.Open, "Exchange: Trying to buy from a closed buy order");
        require(IERC20(tempOrder.requestingToken).balanceOf(msg.sender) >= tempOrder.requestingAmount, "Exchange: not enought balance");
        //transferring funds from the exchange to the seller
        bool success = IERC20(tempOrder.givingToken).transfer(msg.sender, tempOrder.givingAmount);
        require(success, "Exchange: something went wrong while receiving your tokens");
        //transferring funds from the seller to the buyer
        success = IERC20(tempOrder.requestingToken).transferFrom(msg.sender, buyOrderOwner, tempOrder.requestingAmount);
        require(success, "Exchange: something went wrong while transferring your tokens");
        uint256 tempIdx = getOrderIndex(buyOrderOwner, buyId);
        ownerToOrders[buyOrderOwner][tempIdx].status = orderStatus.Close;
        ownerToOrder[buyOrderOwner][buyId].status = orderStatus.Close;
        buyOrderBook[buyId].status = orderStatus.Close;

        emit buyOrderClosed(msg.sender, buyOrderOwner, buyId);
    }

    function createSellNFTOrder(address givingNFT, uint256 givingID, address requestingToken, uint256 requestingAmount) external nonReentrant returns(uint256){
        //checking if the trade creator is the owner of the NFT he wants to trade
        require(ERC721(givingNFT).ownerOf(givingID) == msg.sender, "Exchange: you are not the owner of the NFT");
        if(!isAlreadyInList(msg.sender, false)){
            sellersBook.push(msg.sender);
        }

        uint256 tempId = actualId;
        //adding the sellOrderId to the book of the sell id
        sellIdBook.push(tempId);
        ownerToIds[msg.sender].push(tempId);
        //assosiating an order struct to its owner
        ownerToOrders[msg.sender].push(order(givingNFT, givingID, 
                                            requestingToken, requestingAmount, 
                                            tempId, tokenType.nft ,orderType.Sell, orderStatus.Open));
        //assosiating an order to its ID and owner
        ownerToOrder[msg.sender][tempId] = order(givingNFT, givingID, 
                                            requestingToken, requestingAmount, 
                                            tempId,tokenType.nft, orderType.Sell, orderStatus.Open);
        //assosiating an order directly to its id
        sellOrderBook[tempId] =  order(givingNFT, givingID,
                                        requestingToken, requestingAmount, 
                                        tempId, tokenType.nft, orderType.Sell, orderStatus.Open);
        IERC721(givingNFT).transferFrom(msg.sender, address(this), givingID);
        
        emit sellNFTOrderCreated(msg.sender, givingNFT, givingID, requestingToken, requestingAmount, tempId);

        ++actualId;
        return tempId;
    }

    function buyNFT(address nftSellOrderOwner, uint256 orderId) external nonReentrant{
        require(ownerToOrder[nftSellOrderOwner][orderId].givingAmount != 0, "Exchange: the order does not exist");
        order memory tempOrder  = ownerToOrder[nftSellOrderOwner][orderId];
        require(tempOrder.status == orderStatus.Open, "Exchange: Trying to buy from a closed sell order");
        require(IERC20(tempOrder.requestingToken).balanceOf(msg.sender) >= tempOrder.requestingAmount, "Exchange: not enought balance");

        IERC721(tempOrder.givingToken).transferFrom(address(this), msg.sender, tempOrder.givingAmount);
        
        bool success = IERC20(tempOrder.requestingToken).transferFrom(msg.sender, nftSellOrderOwner, tempOrder.requestingAmount);
        require(success, "Exchange: something went wrong while transferring your tokens");
        //closing the order
        uint256 tempIdx = getOrderIndex(nftSellOrderOwner, orderId);
        ownerToOrders[nftSellOrderOwner][tempIdx].status = orderStatus.Close;
        ownerToOrder[nftSellOrderOwner][orderId].status = orderStatus.Close;
        sellOrderBook[orderId].status = orderStatus.Close;
        //emit
        emit sellOrderClosed(msg.sender, nftSellOrderOwner, orderId);
    }

    /*
    Internal function to check if the target address has already created a buy or sell order in the exchange. 
    buyerOrSeller == true => checks if the target address is a buyer
    buyerOrSeller == false => checks if the target address is a seller
     */
    function isAlreadyInList(address target, bool buyerOrSeller)/* true = buyer, false = seller */ internal view returns(bool){
        if(buyerOrSeller){
            address[] memory tempList = buyersBook;
            for(uint256 i = 0; i < tempList.length; ++i){
                if(tempList[i] == target){
                    return true;                    
                }
            }
            return false;
        } else{
            address[] memory tempList = sellersBook;
            for(uint256 i = 0; i < tempList.length; ++i){
                if(tempList[i] == target){
                    return true;
                }
            }
            return false;
        }
    }

    function getOrderIndex(address target, uint256 ordId)private view returns(uint256){
        uint256 length = ownerToOrders[target].length;
        uint256 idx;
        for(uint256 i = 0; i < length; ++i){
            if(ownerToOrders[target][i].orderId == ordId){
                idx = i;
            }
        }
        return idx;
    }

    function getSellersList() external view returns(address[] memory){
        address[] memory tempSellers = sellersBook;
        return tempSellers;
    }

    function getBuyerList() external view returns(address[] memory){
        address[] memory tempBuyers = buyersBook;
        return tempBuyers;
    }

    

    function getOrdersByOwner(address target) external view returns(order[] memory){
        uint256 length = ownerToOrders[target].length;
        order[] memory tempOrderList = new order[](length);
        for(uint256 i = 0; i < length; ++i){
            tempOrderList[i] = ownerToOrders[target][i];
        }
        return tempOrderList;
    }

    function getBuyOrderByOwner(address target) external view returns(order[] memory){
        uint256 tempLength = ownerToOrders[target].length;
        order[] memory ordersOfOwner = ownerToOrders[target];
        uint256 defLength = 0;
        order[] memory tempOrderList = new order[](tempLength);
        for(uint256 i=0; i<tempLength; i++){
            if(ordersOfOwner[i].orderType == orderType.Buy){
                tempOrderList[i] = ordersOfOwner[i];
                ++defLength;
            } else{
                tempOrderList[i] = order(address(0), 0, address(0), 0, 0, tokenType.token ,orderType.Sell, orderStatus.Close);
            }
        }
        order[] memory buyOrders = new order[](defLength);
        uint256 idx = 0;
        for(uint256 i=0; i<tempLength; ++i){
            if(tempOrderList[i].givingToken != address(0)){
                buyOrders[idx] = tempOrderList[i];
                ++idx; 
            }
        }
        return buyOrders;
    }

    function getSellOrderByOwner(address target) external view returns(order[] memory){
        uint256 tempLength = ownerToOrders[target].length;
        order[] memory ordersOfOwner = ownerToOrders[target];
        uint256 defLength = 0;
        order[] memory tempOrderList = new order[](tempLength);
        for(uint256 i = 0; i < tempLength; ++i){
            if(ordersOfOwner[i].orderType == orderType.Sell){
                tempOrderList[i] = ordersOfOwner[i];
                ++defLength;
            } else{
                tempOrderList[i] = order(address(0), 0, address(0), 0, 0, tokenType.token, orderType.Buy, orderStatus.Close);
            }        
        }
        order[] memory sellOrders = new order[](defLength);
        uint256 idx = 0;
        for(uint256 i =0; i < tempLength; ++i){
            if(tempOrderList[i].requestingToken != address(0)){
                sellOrders[idx] = tempOrderList[i];
                ++idx;
            }
        }
        return sellOrders;
    }

    function getOrdersIdByOwner(address target) external view returns(uint[] memory){
        uint256 length = ownerToIds[target].length;
        uint256 [] memory idList = new uint256[](length);
        for(uint256 i = 0; i < length; i++){
            idList[i] = ownerToIds[target][i];
        }
        return(idList);
    }

    function deletePendingOrder(uint256 orderId) external { //send back money to the owner
        //checking wheter it exists and if it is open
        order memory tempOrder = ownerToOrder[msg.sender][orderId];
        require(tempOrder.status == orderStatus.Open, "Exchange:  cannot close an already cancelled/closed order");
        bool success = IERC20(tempOrder.givingToken).transfer(msg.sender, tempOrder.givingAmount);
        require(success, "Exchange: something went wrong while retrieving you money");
        tempOrder.status = orderStatus.Cancelled;
        if(buyOrderBook[orderId].orderType == orderType.Buy){
            buyOrderBook[orderId].status = orderStatus.Cancelled;
        } else{
            sellOrderBook[orderId].status = orderStatus.Cancelled;
        }
    }

    
}