const { ethers } = require("hardhat");
const { expect, assert } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

let eurName = "eur";
let tokName = "tok";

describe(`Simple P2P exchange`, function(){

    async function deploy(){
        let ownerExchange = await ethers.provider.getSigner(0);
        let ownerEur = await ethers.provider.getSigner(1)
        let ownerTok = await ethers.provider.getSigner(2)

        let exchangeP2P = await(await ethers.getContractFactory("simpleExchange", ownerExchange)).deploy()
        let euro = await(await ethers.getContractFactory("eur", ownerEur)).deploy();
        let token = await(await ethers.getContractFactory("tok", ownerTok)).deploy();

        let userOne = await ethers.provider.getSigner(3)
        let userOneAddress = await userOne.getAddress()
        let userTwo = await ethers.provider.getSigner(4)
        let userTwoAddress = await userTwo.getAddress()

        await euro.transfer(userOneAddress, "1000000")
        await token.transfer(userOneAddress, "1000000000000")
        await euro.transfer(userTwoAddress, "1000000")
        await token.transfer(userTwoAddress, "1000000000000")

        console.log(`User 1 balance of => euro: ${await euro.balanceOf(userOneAddress)}, token: ${await token.balanceOf(userOneAddress)}`);
        console.log(`User 2 balance of => euro: ${await euro.balanceOf(userTwoAddress)}, token: ${await token.balanceOf(userTwoAddress)}`);
        
        

        return{ownerExchange, ownerEur, ownerTok, exchangeP2P, euro, token, userOne, userOneAddress, userTwo, userTwoAddress};
    }

    it(`Creating a buy order with user one`, async function(){
        let {ownerExchange, ownerEur, ownerTok, exchangeP2P, euro, token, userOne, userOneAddress, userTwo, userTwoAddress} = await loadFixture(deploy)
        let eurAmount = 100;
        let tokenAmount = 1000000;
        //approving the exchange to move funds
        await euro.connect(userOne).approve(exchangeP2P.address, eurAmount)
        //creating buy order
        await exchangeP2P.connect(userOne).createBuyOrder(euro.address, eurAmount, token.address, tokenAmount);
        
        console.log(`User one eur balance after creating buy order ${await euro.balanceOf(userOneAddress)}`); // 999900
        console.log(`Contract eur balance after creating buy order ${await euro.balanceOf(exchangeP2P.address)}`); // 100
        
        console.log(`buyer list ${await exchangeP2P.getBuyerList()}`); // 0x90F79bf6EB2c4f870365E785982E1f101E93b906
        console.log(`Owner to orders of ${await userOne.getAddress()} => ${await exchangeP2P.getOrdersByOwner(await userOne.getAddress())}`);  // 0x1eB8650091F81272Dc620d90DdA6904610C018e7,100,0xF87e3d1cb2447032f85FEC4342c863d2D12DDEdC,1000000,0,0,0
        console.log(`Buy order created by owner => ${await exchangeP2P.getBuyOrderByOwner(await userOne.getAddress())}`); // 0x1eB8650091F81272Dc620d90DdA6904610C018e7,100,0xF87e3d1cb2447032f85FEC4342c863d2D12DDEdC,1000000,0,0,0
        console.log(`Get orders id by owner => ${await exchangeP2P.getOrdersIdByOwner(await userOne.getAddress())}`);//0
        
        console.log(`\n\nSelling with user two to buy order of user one\n\n`);
        console.log(`User two eur balance: ${await euro.balanceOf(await userTwo.getAddress())}, tokenBalance: ${await token.balanceOf(await userTwo.getAddress())}`); //User two eur balance: 1000000, tokenBalance: 1000000000000
        console.log(`User one token balance before user two sells his tokens: ${await token.balanceOf(await userOne.getAddress())}`); //1000000000000

        await token.connect(userTwo).approve(exchangeP2P.address, tokenAmount) 
        await exchangeP2P.connect(userTwo).sellToBuyOrder(await userOne.getAddress(), 0);
        console.log(`User one token balance after user two has sold his token ${await token.balanceOf(await userOne.getAddress())}`);
        console.log(`Contact eur balance after user two has sold his tokens ${await euro.balanceOf(exchangeP2P.address)}`);
        console.log(`User two eur balance after having sold his tokens ${await euro.balanceOf(await userTwo.getAddress())}`);      
        })
    
        

    

})