const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe.only(`Simple exchange test`, function(){
    let ownerExchange;
    let ownerExAddress;
    let ownerEuro;
    let ownerEuroAddress;
    let ownerTok;
    let ownerTokenAddress;
    let ownerNft;
    let ownerNFTAddress;
    let exchangeP2P;
    let exchangeAddress;
    let euro;
    let euroAddress;
    let token;
    let tokenAddress;
    let nft;
    let nftAddress;
    let userOne;
    let userOneAddress;
    let userTwo;
    let userTwoAddress;
    

    it(`Deploying`, async function(){
        ownerExchange = await ethers.provider.getSigner(0)
        ownerExAddress = await ownerExchange.getAddress()
        ownerEuro = await ethers.provider.getSigner(1)
        ownerEuroAddress = await ownerEuro.getAddress()
        ownerTok = await ethers.provider.getSigner(2)
        ownerTokenAddress = await ownerTok.getAddress()
        ownerNft = await ethers.provider.getSigner(3)
        ownerNFTAddress = await ownerNft.getAddress()

        console.log(`Owner exchange: ${ownerExAddress}\nOwner eur: ${ownerEuroAddress},\nOwner token: ${ownerTokenAddress},\nOwner Nft: ${ownerNFTAddress}`);
        
        exchangeP2P = await(await ethers.getContractFactory("simpleExchange", ownerExchange)).deploy()
        exchangeAddress = exchangeP2P.address
        euro = await(await ethers.getContractFactory("eur", ownerEuro)).deploy();
        euroAddress = euro.address
        token = await(await ethers.getContractFactory("tok", ownerTok)).deploy();
        tokenAddress = token.address
        nft = await(await ethers.getContractFactory("nft", ownerNft)).deploy()
        nftAddress = nft.address;

        console.log(`Exchange address: ${exchangeAddress},\nEuro address: ${euroAddress},\nTokenAddress: ${tokenAddress},\nNFT address: ${nftAddress}`);        
    })
    it(`Funding user one and two with EUR and Tokens`, async function(){
        userOne = await ethers.provider.getSigner(4)
        userOneAddress = await userOne.getAddress()
        userTwo = await ethers.provider.getSigner(5)
        userTwoAddress = await userTwo.getAddress()
        
        await euro.transfer(userOneAddress, "1000000")
        await token.transfer(userOneAddress, "1000000000000")
        console.log(`User one EUR balance ${await euro.balanceOf(userOneAddress)}, token balance ${await token.balanceOf(userOneAddress)}`);
        await euro.transfer(userTwoAddress, "1000000")
        await token.transfer(userTwoAddress, "1000000000000")
        console.log(`User two EUR balance ${await euro.balanceOf(userTwoAddress)}, token balance ${await token.balanceOf(userTwoAddress)}`);

        await nft.sendNft(userOneAddress)
        await nft.sendNft(userTwoAddress)

        console.log(`User one NFT balance ${await nft.balanceOf(userOneAddress)}`);
        console.log(`User two NFT balance ${await nft.balanceOf(userTwoAddress)}`);
        
        

        })

    it(`Creating a buy order with user one`, async function(){                
        let eurBal = "100"
        let tokBal = "1000000"
        console.log(`User one (${userOneAddress}) wants to buy ${tokBal} tokens for ${eurBal} euros`);
        console.log(`User one balances before creating a buy order => EUR: ${await euro.balanceOf(userOneAddress)}, Token: ${await token.balanceOf(userOneAddress)}`);
        console.log(`Exchange EUR balance before user one creates buy order ${await euro.balanceOf(exchangeAddress)}`);

        await euro.connect(userOne).approve(exchangeAddress, eurBal);
        await exchangeP2P.connect(userOne).createBuyOrder(euroAddress, eurBal, tokenAddress, tokBal);

        console.log(`User one balances after creating a buy order => EUR: ${await euro.balanceOf(userOneAddress)}, Token: ${await token.balanceOf(userOneAddress)}`);
        console.log(`Exchange EUR balance after user one creates buy order ${await euro.balanceOf(exchangeAddress)}`);        
    })
    it(`Testing views`, async function(){
        console.log(`\nBuyers list => ${await exchangeP2P.getBuyerList()}`);
        console.log(`\nOwner to orders of ${await userOne.getAddress()} => ${await exchangeP2P.getOrdersByOwner(await userOne.getAddress())}`);
        console.log(`\nBuy order created by owner => ${await exchangeP2P.getBuyOrderByOwner(await userOne.getAddress())}`); // 0x1eB8650091F81272Dc620d90DdA6904610C018e7,100,0xF87e3d1cb2447032f85FEC4342c863d2D12DDEdC,1000000,0,0,0
        console.log(`\nGet orders id by owner => ${await exchangeP2P.getOrdersIdByOwner(await userOne.getAddress())}`);//0       
    })
    it(`Selling token with user two to user one order`, async function(){
        let tokBal = "1000000"
        console.log(`User one balances before user two sell to his order => EUR:${await euro.balanceOf(userOneAddress)}, token ${await token.balanceOf(userOneAddress)}`);        
        console.log(`User two balances before selling to buy order => EUR: ${await euro.balanceOf(userTwoAddress)}, token: ${await token.balanceOf(userTwoAddress)}`);
        console.log(`Contract eur balance before user two sells: ${await euro.balanceOf(exchangeAddress)}`);
        
        await token.connect(userTwo).approve(exchangeAddress, tokBal);
        await exchangeP2P.connect(userTwo).sellToBuyOrder(await userOne.getAddress(), 0);

        console.log(`User one balances after user two sell to his order => EUR:${await euro.balanceOf(userOneAddress)}, token ${await token.balanceOf(userOneAddress)}`);        
        console.log(`User two balances after selling to buy order => EUR: ${await euro.balanceOf(userTwoAddress)}, token: ${await token.balanceOf(userTwoAddress)}`);
        console.log(`Contract eur balance after user two sells: ${await euro.balanceOf(exchangeAddress)}`);
    })
    it(`Creating a sell order with user one`, async function(){
        let eurBal = "100"
        let tokBal = "1000000"
        console.log(`User one ${userOneAddress} wants to sell ${tokBal} tokens for ${eurBal} euros`);
        console.log(`User one balances before creating the sell order => EUR: ${await euro.balanceOf(userOneAddress)}, token: ${await token.balanceOf(userOneAddress)}`);
        console.log(`Contract token balance before creating the sell order ${await token.balanceOf(exchangeAddress)}`);
                
        await token.connect(userOne).approve(exchangeAddress, tokBal)
        await exchangeP2P.connect(userOne).createSellOrder(tokenAddress, tokBal, euroAddress, eurBal)
        console.log(`User one balances after creating the sell order => EUR: ${await euro.balanceOf(userOneAddress)}, token: ${await token.balanceOf(userOneAddress)}`);
        console.log(`Contract token balance after creating the sell order ${await token.balanceOf(exchangeAddress)}`);
        
    })
    it(`Testing views`, async function(){
        console.log(`\nSellers list => ${await exchangeP2P.getSellersList()}`);
        console.log(`\nOwner to orders of ${await userOne.getAddress()} => ${await exchangeP2P.getOrdersByOwner(await userOne.getAddress())}`);
        console.log(`\nSell order created by owner => ${await exchangeP2P.getSellOrderByOwner(await userOne.getAddress())}`); // 0x1eB8650091F81272Dc620d90DdA6904610C018e7,100,0xF87e3d1cb2447032f85FEC4342c863d2D12DDEdC,1000000,0,0,0
        console.log(`\nGet orders id by owner => ${await exchangeP2P.getOrdersIdByOwner(await userOne.getAddress())}`);//0       
    })
    it(`Buying tokens with use two from user one sell order`, async function(){
        let eurBal = "100"
        console.log(`User one balance before user two buy his tokens => EUR: ${await euro.balanceOf(userOneAddress)}, token: ${await token.balanceOf(userOneAddress)}`);
        console.log(`User two balances before buying from sell order => EUR: ${await euro.balanceOf(userTwoAddress)}, token: ${await token.balanceOf(userTwoAddress)}`);
        console.log(`Contract token balance before user two buys the token: ${await token.balanceOf(exchangeAddress)}`);

        await euro.connect(userTwo).approve(exchangeAddress, eurBal);
        await exchangeP2P.connect(userTwo).buyFromSellOrder(userOneAddress, 1)
        console.log(`User one balance after user two buy his tokens => EUR: ${await euro.balanceOf(userOneAddress)}, token: ${await token.balanceOf(userOneAddress)}`);
        console.log(`User two balances after buying from sell order => EUR: ${await euro.balanceOf(userTwoAddress)}, token: ${await token.balanceOf(userTwoAddress)}`);
        console.log(`Contract token balance after user two buys the token: ${await token.balanceOf(exchangeAddress)}`);
    })
    it(`Testing views`, async function(){
        console.log(`\nSellers list => ${await exchangeP2P.getSellersList()}`);
        console.log(`\nOwner to orders of ${await userOne.getAddress()} => ${await exchangeP2P.getOrdersByOwner(await userOne.getAddress())}`);
        console.log(`\nSell order created by owner => ${await exchangeP2P.getSellOrderByOwner(await userOne.getAddress())}`); // 0x1eB8650091F81272Dc620d90DdA6904610C018e7,100,0xF87e3d1cb2447032f85FEC4342c863d2D12DDEdC,1000000,0,0,0
        console.log(`\nGet orders id by owner => ${await exchangeP2P.getOrdersIdByOwner(await userOne.getAddress())}`);//0       
    })
    it(`Creating five buy orders with user one`, async function(){
        console.log(`User one balances before creating buy orders => EUR ${await euro.balanceOf(userOneAddress)}, token: ${await token.balanceOf(userOneAddress)}`);
        
        var eurBal = "100"
        var tokBal = "1000000"
        await euro.connect(userOne).approve(exchangeAddress, eurBal)
        await exchangeP2P.connect(userOne).createBuyOrder(euroAddress, eurBal, tokenAddress, tokBal)
        console.log(`Created a buy EUR ${eurBal}, token ${tokBal}`);
        
        eurBal = "150"
        tokBal = "1500000"
        await euro.connect(userOne).approve(exchangeAddress, eurBal)
        await exchangeP2P.connect(userOne).createBuyOrder(euroAddress, eurBal, tokenAddress, tokBal)
        console.log(`Created a buy EUR ${eurBal}, token ${tokBal}`);
        
        eurBal = "200"
        tokBal = "2000000"
        await euro.connect(userOne).approve(exchangeAddress, eurBal)
        await exchangeP2P.connect(userOne).createBuyOrder(euroAddress, eurBal, tokenAddress, tokBal)
        console.log(`Created a buy EUR ${eurBal}, token ${tokBal}`);

        eurBal = "250"
        tokBal = "2500000"
        await euro.connect(userOne).approve(exchangeAddress, eurBal)
        await exchangeP2P.connect(userOne).createBuyOrder(euroAddress, eurBal, tokenAddress, tokBal)
        console.log(`Created a buy EUR ${eurBal}, token ${tokBal}`);

        eurBal = "300"
        tokBal = "3000000"
        await euro.connect(userOne).approve(exchangeAddress, eurBal)
        await exchangeP2P.connect(userOne).createBuyOrder(euroAddress, eurBal, tokenAddress, tokBal)
        console.log(`Created a buy EUR ${eurBal}, token ${tokBal}`);

        console.log(`User one balances after creating buy orders => EUR ${await euro.balanceOf(userOneAddress)}, token: ${await token.balanceOf(userOneAddress)}`);
        
    })
    it(`Testing views`, async function(){
        let buyerList = await exchangeP2P.getBuyerList()
        console.log(`\nBuyers list list => ${buyerList}`);
        let ownerToOrder = await exchangeP2P.getOrdersByOwner(await userOne.getAddress())
        console.log(`\nOwner to orders of ${await userOne.getAddress()} => ${ownerToOrder}`);
        let buyOrder = await exchangeP2P.getBuyOrderByOwner(await userOne.getAddress())
        console.log(`\nBuy order created by owner => ${buyOrder}`); // 0x1eB8650091F81272Dc620d90DdA6904610C018e7,100,0xF87e3d1cb2447032f85FEC4342c863d2D12DDEdC,1000000,0,0,0
        console.log(`\nGet orders id by owner => ${await exchangeP2P.getOrdersIdByOwner(await userOne.getAddress())}`);//0       
    })
    it(`Creating five sell orders with user one`, async function(){
        console.log(`User one token balance before creating the sell orders ${await token.balanceOf(userOneAddress)}`);

        var tokBal = "1000000"
        var eurBal = "100"
        await token.connect(userOne).approve(exchangeAddress, tokBal);
        await exchangeP2P.connect(userOne).createSellOrder(tokenAddress, tokBal, euroAddress, eurBal);
        console.log(`Creating a sell order of ${tokBal} tokens for ${eurBal} euros`);

        var tokBal = "1500000"
        var eurBal = "150"
        await token.connect(userOne).approve(exchangeAddress, tokBal);
        await exchangeP2P.connect(userOne).createSellOrder(tokenAddress, tokBal, euroAddress, eurBal);
        console.log(`Creating a sell order of ${tokBal} tokens for ${eurBal} euros`);
        
        var tokBal = "2000000"
        var eurBal = "200"
        await token.connect(userOne).approve(exchangeAddress, tokBal);
        await exchangeP2P.connect(userOne).createSellOrder(tokenAddress, tokBal, euroAddress, eurBal);
        console.log(`Creating a sell order of ${tokBal} tokens for ${eurBal} euros`);

        var tokBal = "2500000"
        var eurBal = "250"
        await token.connect(userOne).approve(exchangeAddress, tokBal);
        await exchangeP2P.connect(userOne).createSellOrder(tokenAddress, tokBal, euroAddress, eurBal);
        console.log(`Creating a sell order of ${tokBal} tokens for ${eurBal} euros`);

        var tokBal = "3000000"
        var eurBal = "300"
        await token.connect(userOne).approve(exchangeAddress, tokBal);
        await exchangeP2P.connect(userOne).createSellOrder(tokenAddress, tokBal, euroAddress, eurBal);
        console.log(`Creating a sell order of ${tokBal} tokens for ${eurBal} euros`);

        console.log(`User one token balance after creating the sell orders ${await token.balanceOf(userOneAddress)}`);
    })
    it(`Testing views`, async function(){
        let sellerList = await exchangeP2P.getSellersList()
        console.log(`\nSellers list => ${sellerList}`);
        let ownerToOrder = await exchangeP2P.getOrdersByOwner(await userOne.getAddress())
        console.log(`\nOwner to orders of ${await userOne.getAddress()} => ${ownerToOrder}`);
        let buyOrder = await exchangeP2P.getSellOrderByOwner(await userOne.getAddress())
        console.log(`\nSell order created by owner => ${buyOrder}`); // 0x1eB8650091F81272Dc620d90DdA6904610C018e7,100,0xF87e3d1cb2447032f85FEC4342c863d2D12DDEdC,1000000,0,0,0
        console.log(`\nGet orders id by owner => ${await exchangeP2P.getOrdersIdByOwner(await userOne.getAddress())}`);//0       
    })
    it(`Creating five buy orders with user two`, async function(){
        console.log(`User two balances before creating buy orders => EUR ${await euro.balanceOf(userTwoAddress)}, token: ${await token.balanceOf(userTwoAddress)}`);
        
        var eurBal = "100"
        var tokBal = "1000000"
        await euro.connect(userTwo).approve(exchangeAddress, eurBal)
        await exchangeP2P.connect(userTwo).createBuyOrder(euroAddress, eurBal, tokenAddress, tokBal)
        console.log(`Created a buy EUR ${eurBal}, token ${tokBal}`);
        
        eurBal = "150"
        tokBal = "1500000"
        await euro.connect(userTwo).approve(exchangeAddress, eurBal)
        await exchangeP2P.connect(userTwo).createBuyOrder(euroAddress, eurBal, tokenAddress, tokBal)
        console.log(`Created a buy EUR ${eurBal}, token ${tokBal}`);
        
        eurBal = "200"
        tokBal = "2000000"
        await euro.connect(userTwo).approve(exchangeAddress, eurBal)
        await exchangeP2P.connect(userTwo).createBuyOrder(euroAddress, eurBal, tokenAddress, tokBal)
        console.log(`Created a buy EUR ${eurBal}, token ${tokBal}`);

        eurBal = "250"
        tokBal = "2500000"
        await euro.connect(userTwo).approve(exchangeAddress, eurBal)
        await exchangeP2P.connect(userTwo).createBuyOrder(euroAddress, eurBal, tokenAddress, tokBal)
        console.log(`Created a buy EUR ${eurBal}, token ${tokBal}`);

        eurBal = "300"
        tokBal = "3000000"
        await euro.connect(userTwo).approve(exchangeAddress, eurBal)
        await exchangeP2P.connect(userTwo).createBuyOrder(euroAddress, eurBal, tokenAddress, tokBal)
        console.log(`Created a buy EUR ${eurBal}, token ${tokBal}`);

        console.log(`User two balances after creating buy orders => EUR ${await euro.balanceOf(userTwoAddress)}, token: ${await token.balanceOf(userTwoAddress)}`);
        
    })
    it(`Testing views`, async function(){
        let buyerList = await exchangeP2P.getBuyerList()
        console.log(`\nBuyers list list => ${buyerList}`);
        let ownerToOrder = await exchangeP2P.getOrdersByOwner(userTwoAddress)
        console.log(`\nOwner to orders of ${await userTwo.getAddress()} => ${ownerToOrder}`);
        let buyOrder = await exchangeP2P.getBuyOrderByOwner(await userTwo.getAddress())
        console.log(`\nBuy order created by owner => ${buyOrder}`); // 0x1eB8650091F81272Dc620d90DdA6904610C018e7,100,0xF87e3d1cb2447032f85FEC4342c863d2D12DDEdC,1000000,0,0,0
        console.log(`\nGet orders id by owner => ${await exchangeP2P.getOrdersIdByOwner(await userTwo.getAddress())}`);//0       
    })
    it(`Creating five sell orders with user two`, async function(){
        console.log(`User two token balance before creating the sell orders ${await token.balanceOf(userTwoAddress)}`);

        var tokBal = "1000000"
        var eurBal = "100"
        await token.connect(userTwo).approve(exchangeAddress, tokBal);
        await exchangeP2P.connect(userTwo).createSellOrder(tokenAddress, tokBal, euroAddress, eurBal);
        console.log(`Creating a sell order of ${tokBal} tokens for ${eurBal} euros`);

        var tokBal = "1500000"
        var eurBal = "150"
        await token.connect(userTwo).approve(exchangeAddress, tokBal);
        await exchangeP2P.connect(userTwo).createSellOrder(tokenAddress, tokBal, euroAddress, eurBal);
        console.log(`Creating a sell order of ${tokBal} tokens for ${eurBal} euros`);
        
        var tokBal = "2000000"
        var eurBal = "200"
        await token.connect(userTwo).approve(exchangeAddress, tokBal);
        await exchangeP2P.connect(userTwo).createSellOrder(tokenAddress, tokBal, euroAddress, eurBal);
        console.log(`Creating a sell order of ${tokBal} tokens for ${eurBal} euros`);

        var tokBal = "2500000"
        var eurBal = "250"
        await token.connect(userTwo).approve(exchangeAddress, tokBal);
        await exchangeP2P.connect(userTwo).createSellOrder(tokenAddress, tokBal, euroAddress, eurBal);
        console.log(`Creating a sell order of ${tokBal} tokens for ${eurBal} euros`);

        var tokBal = "3000000"
        var eurBal = "300"
        await token.connect(userTwo).approve(exchangeAddress, tokBal);
        await exchangeP2P.connect(userTwo).createSellOrder(tokenAddress, tokBal, euroAddress, eurBal);
        console.log(`Creating a sell order of ${tokBal} tokens for ${eurBal} euros`);

        console.log(`User two token balance after creating the sell orders ${await token.balanceOf(userTwoAddress)}`);
    })
    it(`Testing views`, async function(){
        let sellerList = await exchangeP2P.getSellersList()
        console.log(`\nSellers list => ${sellerList}`);
        let ownerToOrder = await exchangeP2P.getOrdersByOwner(await userTwo.getAddress())
        console.log(`\nOwner to orders of ${await userTwo.getAddress()} => ${ownerToOrder}`);
        let sellOrder = await exchangeP2P.getSellOrderByOwner(await userTwo.getAddress())
        console.log(`\nSell order created by owner => ${sellOrder}`); // 0x1eB8650091F81272Dc620d90DdA6904610C018e7,100,0xF87e3d1cb2447032f85FEC4342c863d2D12DDEdC,1000000,0,0,0
        console.log(`\nGet orders id by owner => ${await exchangeP2P.getOrdersIdByOwner(await userTwo.getAddress())}`);//0       
    })
    it(`Trying to buy from a closed order`, async function(){
        let tokBal = "1000000"
        await token.connect(userTwo).approve(exchangeAddress, tokBal);
        await expect (exchangeP2P.connect(userTwo).sellToBuyOrder(await userOne.getAddress(), 0)).to.be.revertedWith("Exchange: Trying to buy from a closed buy order");
    })
    it(`Deleting pending order`, async function(){
        var order = await exchangeP2P.ownerToOrder(userTwoAddress, 16)
        console.log(order)
        await exchangeP2P.connect(userTwo).deletePendingOrder(16)
        order = await exchangeP2P.ownerToOrder(userTwoAddress, 16)
        console.log(order)
    })

    it(`Creating an NFT trade with user one`, async function(){
        console.log(`user one balances before creating the NFT sell order => nft balance: ${await nft.balanceOf(userOneAddress)}, EUR: ${await euro.balanceOf(userOneAddress)}`);
        console.log(`Exchange nft balance before creating the trade ${await nft.balanceOf(exchangeAddress)}`);

        await nft.connect(userOne).approve(exchangeAddress, 1)
        await exchangeP2P.connect(userOne).createSellNFTOrder(nftAddress, 1, euroAddress, "1000")
        console.log(`user one balances after creating the NFT sell order => nft balance: ${await nft.balanceOf(userOneAddress)}, EUR: ${await euro.balanceOf(userOneAddress)}`);
        console.log(`Exchange nft balance after creating the trade ${await nft.balanceOf(exchangeAddress)}`);
    })

    it(`Buying NFT from user one order with user two`, async function(){
        let id = (await exchangeP2P.getOrdersIdByOwner(userOneAddress))[12]
        console.log(`${await exchangeP2P.ownerToOrder(userOneAddress, id)}`);
        
        //console.log(`${id}`);
        console.log(`User one balances befor user two buys the NFT => EUR: ${await euro.balanceOf(userOneAddress)}`);
        console.log(`Excahnge NFT balance befor user two buys the NFT => NFT: ${await nft.balanceOf(exchangeAddress)}`);
        console.log(`User two balances before he buys the NFT => EUR: ${await euro.balanceOf(userTwoAddress)}, NFT: ${await nft.balanceOf(userTwoAddress)}`);

        await euro.connect(userTwo).approve(exchangeAddress, "1000")
        await exchangeP2P.connect(userTwo).buyNFT(userOneAddress, id);
        
        console.log(`User one balances after user two buys the NFT => EUR: ${await euro.balanceOf(userOneAddress)}`);
        console.log(`Excahnge NFT balance after user two buys the NFT => NFT: ${await nft.balanceOf(exchangeAddress)}`);
        console.log(`User two balances after he buys the NFT => EUR: ${await euro.balanceOf(userTwoAddress)}, NFT: ${await nft.balanceOf(userTwoAddress)}`);

    })

})  