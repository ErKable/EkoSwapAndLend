const { ethers } = require("hardhat");
const { expect, assert } = require("chai");
const { ParamType } = require("ethers/lib/utils");

let ownerExchange;
let ownerExAddress;
let ownerEuro;
let ownerEuroAddress;
let ownerTok;
let ownerTokenAddress;
let exchangeP2P;
let exchangeAddress;
let euro;
let euroAddress;
let token;
let tokenAddress;
let userOne;
let userOneAddress;
let userTwo;
let userTwoAddress;

async function initScripts(){
    ownerExchange = ethers.provider.getSigner(0)
    ownerExAddress = await ownerExchange.getAddress()
    ownerEuro = ethers.provider.getSigner(1)
    ownerEuroAddress = await ownerEuro.getAddress()
    ownerTok = ethers.provider.getSigner(2)
    ownerTokenAddress = await ownerTok.getAddress()    
    console.log(`Exchange owner address: ${ownerExAddress}\nEURO owner: ${ownerEuroAddress}\nOwnerToken: ${ownerTokenAddress}`);
}

async function deploy(){
    exchangeP2P = await(await ethers.getContractFactory("simpleExchange", ownerExchange)).deploy()
    exchangeAddress = exchangeP2P.address
    euro = await(await ethers.getContractFactory("eur", ownerEuro)).deploy();
    euroAddress = euro.address
    token = await(await ethers.getContractFactory("tok", ownerTok)).deploy();
    tokenAddress = token.address

    console.log(`Exchange address: ${exchangeAddress},\nEuro address: ${euroAddress},\nTokenAddress: ${tokenAddress}`);        

}

async function fundingUsers(){
  userOne = ethers.provider.getSigner(3)
  userOneAddress = await userOne.getAddress()
  userTwo = ethers.provider.getSigner(4)
  userTwoAddress = await userTwo.getAddress()

  await euro.transfer(userOneAddress, "1000000")
  await token.transfer(userOneAddress, "1000000000000")
  console.log(`User one EUR balance ${await euro.balanceOf(userOneAddress)}, token balance ${await token.balanceOf(userOneAddress)}`);
  await euro.transfer(userTwoAddress, "1000000")
  await token.transfer(userTwoAddress, "1000000000000")
  console.log(`User two EUR ${await euro.balanceOf(userTwoAddress)}, token balance: ${await token.balanceOf(userOneAddress)}`);
}

async function buyOrderWithUserOne(){
  let eurBal = "100"
  let tokBal = "1000000"
  console.log(`User one (${userOneAddress}) wants to buy ${tokBal} tokens for ${eurBal} euros`);
  console.log(`User one balances before creating a buy order => EUR: ${await euro.balanceOf(userOneAddress)}, Token: ${await token.balanceOf(userOneAddress)}`);
  console.log(`Exchange EUR balance before user one creates buy order ${await euro.balanceOf(exchangeAddress)}`);

  let app = await euro.connect(userOne).approve(exchangeAddress, eurBal);
  await app.wait()
  let buy = await exchangeP2P.connect(userOne).createBuyOrder(euroAddress, eurBal, tokenAddress, tokBal);
  await buy.wait()
  console.log(`User one balances after creating a buy order => EUR: ${await euro.balanceOf(userOneAddress)}, Token: ${await token.balanceOf(userOneAddress)}`);
  console.log(`Exchange EUR balance after user one creates buy order ${await euro.balanceOf(exchangeAddress)}`);      
    
}

async function sellToUserOne(){
  let tokBal = "1000000"
        console.log(`User one balances before user two sell to his order => EUR:${await euro.balanceOf(userOneAddress)}, token ${await token.balanceOf(userOneAddress)}`);        
        console.log(`User two balances before selling to buy order => EUR: ${await euro.balanceOf(userTwoAddress)}, token: ${await token.balanceOf(userTwoAddress)}`);
        console.log(`Contract eur balance before user two sells: ${await euro.balanceOf(exchangeAddress)}`);
        
        var app = await token.connect(userTwo).approve(exchangeAddress, tokBal);
        await app.wait()
        let sell = await exchangeP2P.connect(userTwo).sellToBuyOrder(await userOne.getAddress(), 0);
        await sell.wait()

        console.log(`User one balances after user two sell to his order => EUR:${await euro.balanceOf(userOneAddress)}, token ${await token.balanceOf(userOneAddress)}`);        
        console.log(`User two balances after selling to buy order => EUR: ${await euro.balanceOf(userTwoAddress)}, token: ${await token.balanceOf(userTwoAddress)}`);
        console.log(`Contract eur balance after user two sells: ${await euro.balanceOf(exchangeAddress)}`);
    
}

async function sellOrderWithUserOne(){
  let eurBal = "100"
  let tokBal = "1000000"
  console.log(`User one ${userOneAddress} wants to sell ${tokBal} tokens for ${eurBal} euros`);
  console.log(`User one balances before creating the sell order => EUR: ${await euro.balanceOf(userOneAddress)}, token: ${await token.balanceOf(userOneAddress)}`);
  console.log(`Contract token balance before creating the sell order ${await token.balanceOf(exchangeAddress)}`);
                
  var app = await token.connect(userOne).approve(exchangeAddress, tokBal)
  await app.wait()
  let sell = await exchangeP2P.connect(userOne).createSellOrder(tokenAddress, tokBal, euroAddress, eurBal)
  await sell.wait()
  console.log(`User one balances after creating the sell order => EUR: ${await euro.balanceOf(userOneAddress)}, token: ${await token.balanceOf(userOneAddress)}`);
  console.log(`Contract token balance after creating the sell order ${await token.balanceOf(exchangeAddress)}`);
        
    
}

async function buyingFromSellOrder(){
  let eurBal = "100"
  console.log(`User one balance before user two buy his tokens => EUR: ${await euro.balanceOf(userOneAddress)}, token: ${await token.balanceOf(userOneAddress)}`);
  console.log(`User two balances before buying from sell order => EUR: ${await euro.balanceOf(userTwoAddress)}, token: ${await token.balanceOf(userTwoAddress)}`);
  console.log(`Contract token balance before user two buys the token: ${await token.balanceOf(exchangeAddress)}`);

  var app = await euro.connect(userTwo).approve(exchangeAddress, eurBal);
  await app.wait()
  let buy = await exchangeP2P.connect(userTwo).buyFromSellOrder(userOneAddress, 1)
  await buy.wait()

  console.log(`User one balance after user two buy his tokens => EUR: ${await euro.balanceOf(userOneAddress)}, token: ${await token.balanceOf(userOneAddress)}`);
  console.log(`User two balances after buying from sell order => EUR: ${await euro.balanceOf(userTwoAddress)}, token: ${await token.balanceOf(userTwoAddress)}`);
  console.log(`Contract token balance after user two buys the token: ${await token.balanceOf(exchangeAddress)}`);
    
}

async function fiveBuyUserOne(){
  console.log(`User one balances before creating buy orders => EUR ${await euro.balanceOf(userOneAddress)}, token: ${await token.balanceOf(userOneAddress)}`);
        
  var eurBal = "100"
  var tokBal = "1000000"
  var app = await euro.connect(userOne).approve(exchangeAddress, eurBal)
  await app.wait()
  var buy = await exchangeP2P.connect(userOne).createBuyOrder(euroAddress, eurBal, tokenAddress, tokBal)
  await buy.wait()
  console.log(`Created a buy EUR ${eurBal}, token ${tokBal}`);
        
  eurBal = "150"
  tokBal = "1500000"
  app = await euro.connect(userOne).approve(exchangeAddress, eurBal)
  await app.wait()
  buy = await exchangeP2P.connect(userOne).createBuyOrder(euroAddress, eurBal, tokenAddress, tokBal)
  await buy.wait()
  console.log(`Created a buy EUR ${eurBal}, token ${tokBal}`);
        
  eurBal = "200"
  tokBal = "2000000"
  app = await euro.connect(userOne).approve(exchangeAddress, eurBal)
  await app.wait()
  buy = await exchangeP2P.connect(userOne).createBuyOrder(euroAddress, eurBal, tokenAddress, tokBal)
  await buy.wait()
  console.log(`Created a buy EUR ${eurBal}, token ${tokBal}`);

  eurBal = "250"
  tokBal = "2500000"
  app = await euro.connect(userOne).approve(exchangeAddress, eurBal)
  await app.wait()
  buy = await exchangeP2P.connect(userOne).createBuyOrder(euroAddress, eurBal, tokenAddress, tokBal)
  await buy.wait()
  console.log(`Created a buy EUR ${eurBal}, token ${tokBal}`);

  eurBal = "300"
  tokBal = "3000000"
  app = await euro.connect(userOne).approve(exchangeAddress, eurBal)
  await app.wait()
  buy = await exchangeP2P.connect(userOne).createBuyOrder(euroAddress, eurBal, tokenAddress, tokBal)
  await buy.wait()
  console.log(`Created a buy EUR ${eurBal}, token ${tokBal}`);

  console.log(`User one balances after creating buy orders => EUR ${await euro.balanceOf(userOneAddress)}, token: ${await token.balanceOf(userOneAddress)}`);
        
    
}

async function fiveSellOrderUserOne(){
  console.log(`User one token balance before creating the sell orders ${await token.balanceOf(userOneAddress)}`);

  var tokBal = "1000000"
  var eurBal = "100"
  var app = await token.connect(userOne).approve(exchangeAddress, tokBal);
  await app.wait()
  var sell = await exchangeP2P.connect(userOne).createSellOrder(tokenAddress, tokBal, euroAddress, eurBal);
  await sell.wait()
  console.log(`Creating a sell order of ${tokBal} tokens for ${eurBal} euros`);

  var tokBal = "1500000"
  var eurBal = "150"
  app = await token.connect(userOne).approve(exchangeAddress, tokBal);
  await app.wait()
  sell = await exchangeP2P.connect(userOne).createSellOrder(tokenAddress, tokBal, euroAddress, eurBal);
  await sell.wait()      
  console.log(`Creating a sell order of ${tokBal} tokens for ${eurBal} euros`);
        
  var tokBal = "2000000"
  var eurBal = "200"
  app = await token.connect(userOne).approve(exchangeAddress, tokBal);
  await app.wait()
  sell = await exchangeP2P.connect(userOne).createSellOrder(tokenAddress, tokBal, euroAddress, eurBal);
  await sell.wait()      
  console.log(`Creating a sell order of ${tokBal} tokens for ${eurBal} euros`);

  var tokBal = "2500000"
  var eurBal = "250"
  app = await token.connect(userOne).approve(exchangeAddress, tokBal);
  await app.wait()
  sell = await exchangeP2P.connect(userOne).createSellOrder(tokenAddress, tokBal, euroAddress, eurBal);
  await sell.wait()      
  console.log(`Creating a sell order of ${tokBal} tokens for ${eurBal} euros`);

  var tokBal = "3000000"
  var eurBal = "300"
  app = await token.connect(userOne).approve(exchangeAddress, tokBal);
  await app.wait()
  sell = await exchangeP2P.connect(userOne).createSellOrder(tokenAddress, tokBal, euroAddress, eurBal);
  await sell.wait()      
  console.log(`Creating a sell order of ${tokBal} tokens for ${eurBal} euros`);

  console.log(`User one token balance after creating the sell orders ${await token.balanceOf(userOneAddress)}`);
    
}

async function fiveBuyOrderUserTwo(){
  console.log(`User two balances before creating buy orders => EUR ${await euro.balanceOf(userTwoAddress)}, token: ${await token.balanceOf(userTwoAddress)}`);
        
  var eurBal = "100"
  var tokBal = "1000000"
  var app = await euro.connect(userTwo).approve(exchangeAddress, eurBal)
  await app.wait()
  var buy = await exchangeP2P.connect(userTwo).createBuyOrder(euroAddress, eurBal, tokenAddress, tokBal)
  await buy.wait()      
  console.log(`Created a buy EUR ${eurBal}, token ${tokBal}`);
        
  eurBal = "150"
  tokBal = "1500000"
  app = await euro.connect(userTwo).approve(exchangeAddress, eurBal)
  await app.wait()
  buy = await exchangeP2P.connect(userTwo).createBuyOrder(euroAddress, eurBal, tokenAddress, tokBal)
  await buy.wait()      
  console.log(`Created a buy EUR ${eurBal}, token ${tokBal}`);
        
  eurBal = "200"
  tokBal = "2000000"
  app = await euro.connect(userTwo).approve(exchangeAddress, eurBal)
  await app.wait()
  buy = await exchangeP2P.connect(userTwo).createBuyOrder(euroAddress, eurBal, tokenAddress, tokBal)
  await buy.wait()      
  console.log(`Created a buy EUR ${eurBal}, token ${tokBal}`);

  eurBal = "250"
  tokBal = "2500000"
  app = await euro.connect(userTwo).approve(exchangeAddress, eurBal)
  await app.wait()
  buy = await exchangeP2P.connect(userTwo).createBuyOrder(euroAddress, eurBal, tokenAddress, tokBal)
  await buy.wait()      
  console.log(`Created a buy EUR ${eurBal}, token ${tokBal}`);

  eurBal = "300"
  tokBal = "3000000"
  app = await euro.connect(userTwo).approve(exchangeAddress, eurBal)
  await app.wait()
  buy = await exchangeP2P.connect(userTwo).createBuyOrder(euroAddress, eurBal, tokenAddress, tokBal)
  await buy.wait()      
  console.log(`Created a buy EUR ${eurBal}, token ${tokBal}`);

  console.log(`User two balances after creating buy orders => EUR ${await euro.balanceOf(userTwoAddress)}, token: ${await token.balanceOf(userTwoAddress)}`);
}

async function fiveSellOrderUserTwo(){
  console.log(`User two token balance before creating the sell orders ${await token.balanceOf(userTwoAddress)}`);

  var tokBal = "1000000"
  var eurBal = "100"
  var app = await token.connect(userTwo).approve(exchangeAddress, tokBal);
  await app.wait()
  var sell = await exchangeP2P.connect(userTwo).createSellOrder(tokenAddress, tokBal, euroAddress, eurBal);
  await sell.wait()      
  console.log(`Creating a sell order of ${tokBal} tokens for ${eurBal} euros`);

  var tokBal = "1500000"
  var eurBal = "150"
  app = await token.connect(userTwo).approve(exchangeAddress, tokBal);
  await app.wait()
  sell = await exchangeP2P.connect(userTwo).createSellOrder(tokenAddress, tokBal, euroAddress, eurBal);
  await sell.wait()      
  console.log(`Creating a sell order of ${tokBal} tokens for ${eurBal} euros`);
        
  var tokBal = "2000000"
  var eurBal = "200"
  app = await token.connect(userTwo).approve(exchangeAddress, tokBal);
  await app.wait()
  sell = await exchangeP2P.connect(userTwo).createSellOrder(tokenAddress, tokBal, euroAddress, eurBal);
  await sell.wait()      
  console.log(`Creating a sell order of ${tokBal} tokens for ${eurBal} euros`);

  var tokBal = "2500000"
  var eurBal = "250"
  app = await token.connect(userTwo).approve(exchangeAddress, tokBal);
  await app.wait()
  sell = await exchangeP2P.connect(userTwo).createSellOrder(tokenAddress, tokBal, euroAddress, eurBal);
  await sell.wait()      
  console.log(`Creating a sell order of ${tokBal} tokens for ${eurBal} euros`);

  var tokBal = "3000000"
  var eurBal = "300"
  app = await token.connect(userTwo).approve(exchangeAddress, tokBal);
  await app.wait()
  sell = await exchangeP2P.connect(userTwo).createSellOrder(tokenAddress, tokBal, euroAddress, eurBal);
  await sell.wait()      
  console.log(`Creating a sell order of ${tokBal} tokens for ${eurBal} euros`);

  console.log(`User two token balance after creating the sell orders ${await token.balanceOf(userTwoAddress)}`);
    
}


async function runAction(steps) {
    switch (steps) {
      case 1:
        await deploy() 
        await fundingUsers()   
        await buyOrderWithUserOne()  
        await sellToUserOne() 
        await sellOrderWithUserOne()
        await fiveBuyUserOne()
        await fiveSellOrderUserOne()
        await fiveBuyOrderUserTwo()
        await fiveSellOrderUserTwo()
        break;
    }
  }

  async function run() {
    await initScripts(); // always active pls
    //prepare workspace
    const stepsToExecute = [1];
    for (let i = 0; i < stepsToExecute.length; i++) {
      currentStep = stepsToExecute[i];
      await runAction(currentStep);
    }
    console.log("all done");
  }
  
  run();