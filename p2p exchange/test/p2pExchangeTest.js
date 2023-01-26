const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe.only(`P2P exchange test`, function(){

    let owner;
    let ownerAddress;
    let exchange;
    let exchangeAddress;
    let scoreToken;
    let scoreTokenAddress;
    let ekoUSDT;
    let ekoUSDTAddress;
    let userOne;
    let userOneAddress;
    let userTwo;
    let userTwoAddress;


    it(`Should deploy the exchange and the tokens`, async function(){
        owner = ethers.provider.getSigner(0)
        ownerAddress = await owner.getAddress()

        exchange = await(await ethers.getContractFactory("peer2peerExchange", owner)).deploy()
        exchangeAddress = exchange.address 

        scoreToken = await(await ethers.getContractFactory("tok", owner)).deploy()
        scoreTokenAddress = scoreToken.address 

        ekoUSDT = await(await ethers.getContractFactory("eur", owner)).deploy()
        ekoUSDTAddress = ekoUSDT.address

        console.log(`Owner address: ${ownerAddress},\nexchangeAddress: ${exchangeAddress},\nscoreTokenAddress: ${scoreTokenAddress},\nekoUSDTAddress: ${ekoUSDTAddress}`)
    })

    it(`Should create two users`, async function(){
        userOne = await ethers.provider.getSigner(1)
        userOneAddress = await userOne.getAddress()

        userTwo = await ethers.provider.getSigner(2)
        userTwoAddress = await userTwo.getAddress()

        console.log(`User one address: ${userOneAddress},\nUser two address: ${userTwoAddress}`)
    })

    it(`Should send scoreTokens and ekoUSDT to the 2 users`, async function(){
        let tokBalance = await scoreToken.balanceOf(ownerAddress)
        let ekoSBalance = await ekoUSDT.balanceOf(ownerAddress)
        console.log(`Owner scoreToken balance: ${tokBalance} and ekoUSDT balance: ${ekoSBalance}`)

        let tokAmount = "1000000000000000000"
        let ekoSAmount = "1000000000000000000"

        console.log(`Transferring ${tokAmount} scoreToken and ${ekoSAmount} ekoUSDT to ${userOneAddress}`)
        await scoreToken.connect(owner).transfer(userOneAddress, tokAmount)
        await ekoUSDT.connect(owner).transfer(userOneAddress, ekoSAmount)
        console.log(`User one balances: ${await scoreToken.balanceOf(userOneAddress)} scoreToken and ${await ekoUSDT.balanceOf(userOneAddress)}`)

        console.log(`Transferring ${tokAmount} scoreToken and ${ekoSAmount} ekoUSDT to ${userTwoAddress}`)
        await scoreToken.transfer(userTwoAddress, tokAmount)
        await ekoUSDT.transfer(userTwoAddress, ekoSAmount)
        console.log(`User two balances: ${await scoreToken.balanceOf(userTwoAddress)} scoreToken and ${await ekoUSDT.balanceOf(userTwoAddress)} ekoUSDT`)
    })

    it(`Should revert the creation of the order because the ekoStable is not recognised`, async function(){
        let scoreAmount = "150000000000"
        let ekoUsdtAmount = "150000"

        let userBalbefore = await scoreToken.balanceOf(userOneAddress)
        let contractBalBefore = await scoreToken.balanceOf(exchangeAddress)
        console.log(`Before the creation of the order user one has ${userBalbefore} scoreTokens and the smart contract has ${contractBalBefore} scoreToken`)

        await scoreToken.connect(userOne).approve(exchangeAddress, scoreAmount)
        await expect(exchange.connect(userOne).createSellScoreTokensOrder(scoreAmount, ekoUSDTAddress, ekoUsdtAmount)).to.revertedWith("ekoStableUnaccepted")
    })

    it(`Should add ekoUSDT to the accepted ekoStable`, async function(){
        await exchange.addEkoStable(ekoUSDTAddress)
        console.log(`ekoUSDT added succesfully`)
        expect(await exchange.acceptedEkoStables(ekoUSDTAddress)).to.equal(true)
    })

    it(`Should add the address of the scoreToken`, async function(){
        await exchange.setScoreTokenAddress(scoreTokenAddress)
        console.log(`Score token address set succesfully`)
        expect(await exchange.scoreTokenAddress()).to.equal(scoreTokenAddress)
    })

    it(`Should create a sell score token order with user one`, async function(){
        let scoreAmount = "150000000000"
        let ekoUsdtAmount = "150000"
        let userBalbefore = await scoreToken.balanceOf(userOneAddress)
        let contractBalBefore = await scoreToken.balanceOf(exchangeAddress)
        console.log(`Before the creation of the order user one has ${userBalbefore} scoreTokens and the smart contract has ${contractBalBefore} scoreToken`)

        await scoreToken.connect(userOne).approve(exchangeAddress, scoreAmount)
        await exchange.connect(userOne).createSellScoreTokensOrder(scoreAmount, ekoUSDTAddress, ekoUsdtAmount) 
        console.log(`Order created successfully`)

        let userBalAfter = await scoreToken.balanceOf(userOneAddress)
        let contBalAfter = await scoreToken.balanceOf(exchangeAddress)
        console.log(`After the creation of the order user one has ${userBalAfter} scoreToken and the smart contract has ${contBalAfter} scoreToken`)
        expect(Number(userBalbefore)).to.be.greaterThan(Number(userBalAfter))
        expect(Number(contractBalBefore)).to.be.below(Number(contBalAfter))
    })

    it(`Should retrieve user one orders id`, async function(){
        let ids = await exchange.getAddressToIds(userOneAddress)
        console.log(`order ids: ${ids}`)
    })

    it(`Should buy user one order with user two`, async function(){
        let ekoUsdtAmount = "150000"
        let userTwoSTBalBefore = await scoreToken.balanceOf(userTwoAddress)
        let userTwoESBalBefore = await ekoUSDT.balanceOf(userTwoAddress)
        console.log(`User two balances before buying from the sell order:\nscoreToken = ${userTwoSTBalBefore},\nekoUSDT = ${userTwoESBalBefore}`)
        let userOneESbalBefore = await ekoUSDT.balanceOf(userOneAddress)
        console.log(`userOne ekoStable balance before user two buys his order, ekoUSDT bal = ${userOneESbalBefore}`)
        let contractSTbalBef = await scoreToken.balanceOf(exchangeAddress)
        console.log(`Exchange score token balance before user two buys the order, scoreTokne bal = ${contractSTbalBef}`)
       
        let ids = await exchange.getAddressToIds(userOneAddress)
        //console.log(ids, typeof(ids))
        //console.log(`${await exchange.idToOrder(ids[0])}`)
        await ekoUSDT.connect(userTwo).approve(exchangeAddress, ekoUsdtAmount)
        await exchange.connect(userTwo).buyScoreTokenFromSellOrder(Number(ids[0]))

        let userTwoSTBalAfter = await scoreToken.balanceOf(userTwoAddress)        
        let userTwoESBalAfter = await ekoUSDT.balanceOf(userTwoAddress)        
        console.log(`User two balances after buying from the sell order:\nscoreToken = ${userTwoSTBalAfter},\nekoUSDT = ${userTwoESBalAfter}`)
        expect(Number(userTwoSTBalBefore)).to.be.below(Number(userTwoSTBalAfter))
        expect(Number(userTwoESBalBefore)).to.be.greaterThan(Number(userTwoESBalAfter))
        let userOneESbalAfter = await ekoUSDT.balanceOf(userOneAddress)
        console.log(`userOne ekoStable balance after user two has bought his order, ekoUSDT bal = ${userOneESbalAfter}`)
        expect(Number(userOneESbalBefore)).to.be.below(Number(userOneESbalAfter))
        let contractSTbalAft = await scoreToken.balanceOf(exchangeAddress)
        console.log(`Exchange score token balance before user two has bought the order, scoreTokne bal = ${contractSTbalAft}`)
        expect(Number(contractSTbalBef)).to.be.greaterThan(Number(contractSTbalAft))
    })

    it(`Should create a buy score token order with user one`, async function(){
        let scoreAmount = "150000000000"
        let ekoUsdtAmount = "150000"
        let userBalbefore = await ekoUSDT.balanceOf(userOneAddress)
        let contractBalBefore = await ekoUSDT.balanceOf(exchangeAddress)
        console.log(`Before the creation of the order user one has ${userBalbefore} ekoUSDT and the smart contract has ${contractBalBefore} ekoUSDT`)

        await ekoUSDT.connect(userOne).approve(exchangeAddress, ekoUsdtAmount)
        await exchange.connect(userOne).createBuyScoreTokensOrder(ekoUSDTAddress, ekoUsdtAmount, scoreAmount)
        console.log(`Order created successfully`)

        let userBalAfter = await ekoUSDT.balanceOf(userOneAddress)
        let contBalAfter = await ekoUSDT.balanceOf(exchangeAddress)
        console.log(`After the creation of the order user one has ${userBalAfter} ekoUSDT and the smart contract has ${contBalAfter} ekoUSDT`)
        expect(Number(userBalbefore)).to.be.greaterThan(Number(userBalAfter))
        expect(Number(contractBalBefore)).to.be.below(Number(contBalAfter))
    })

    it(`Should sell scoreTokens to user one order with user two`, async function(){
        let scoreAmount = "150000000000"
        let userTwoSTBalBefore = await scoreToken.balanceOf(userTwoAddress)
        let userTwoESBalBefore = await ekoUSDT.balanceOf(userTwoAddress)
        console.log(`User two balances before buying from the sell order:\nscoreToken = ${userTwoSTBalBefore},\nekoUSDT = ${userTwoESBalBefore}`)
        let userOneSTbalBefore = await scoreToken.balanceOf(userOneAddress)
        console.log(`userOne scoreToken balance before user two buys his order, scoreToken bal = ${userOneSTbalBefore}`)
        let contractESbalBef = await ekoUSDT.balanceOf(exchangeAddress)
        console.log(`Exchange ekoUSDT balance before user two buys the order, ekoUSDT bal = ${contractESbalBef}`)

        let ids = await exchange.getAddressToIds(userOneAddress)
        await scoreToken.connect(userTwo).approve(exchangeAddress, scoreAmount)
        await exchange.connect(userTwo).sellScoreTokensToABuyOrder(Number(ids[0]))

        let userTwoSTBalAfter = await scoreToken.balanceOf(userTwoAddress)        
        let userTwoESBalAfter = await ekoUSDT.balanceOf(userTwoAddress)        
        console.log(`User two balances after buying from the sell order:\nscoreToken = ${userTwoSTBalAfter},\nekoUSDT = ${userTwoESBalAfter}`)
        expect(Number(userTwoSTBalBefore)).to.be.greaterThan(Number(userTwoSTBalAfter))
        expect(Number(userTwoESBalBefore)).to.be.below(Number(userTwoESBalAfter))

        let userOneSTbalAfter = await scoreToken.balanceOf(userOneAddress)
        console.log(`userOne scoreToken balance after user two has bought his order, scoreToken bal = ${userOneSTbalAfter}`)
        expect(Number(userOneSTbalBefore)).to.be.below(Number(userOneSTbalAfter))

        let contractESbalAft = await ekoUSDT.balanceOf(exchangeAddress)
        console.log(`Exchange ekoUSDT balance before user two buys the order, ekoUSDT bal = ${contractESbalAft}`)
        expect(Number(contractESbalBef)).to.be.greaterThan(Number(contractESbalAft))
    })

    it(`Should create a buy score token order with user two`, async function(){
        let scoreAmount = "150000000000"
        let ekoUsdtAmount = "150000"

        let userTwoESBalBef = await ekoUSDT.balanceOf(userTwoAddress)
        let userTwoSTBalBef = await scoreToken.balanceOf(userTwoAddress)
        console.log(`User two ekoUSDT balace: ${userTwoESBalBef}, scoreToken balance: ${userTwoSTBalBef}`)

        let contractESBalBef = await ekoUSDT.balanceOf(exchangeAddress)
        console.log(`Smart contract ekoUSDT balance before: ${contractESBalBef}`)

        await ekoUSDT.connect(userTwo).approve(exchangeAddress, ekoUsdtAmount)
        await exchange.connect(userTwo).createBuyScoreTokensOrder(ekoUSDTAddress, ekoUsdtAmount, scoreAmount)

        let userTwoESBalAft = await ekoUSDT.balanceOf(userTwoAddress)
        let userTwoSTBalAft = await scoreToken.balanceOf(userTwoAddress)
        console.log(`User two ekoUSDT balace: ${userTwoESBalAft}, scoreToken after: ${userTwoSTBalAft}`)
        expect(Number(userTwoESBalBef)).to.be.greaterThan(Number(userTwoESBalAft))

        let contractESBalAft = await ekoUSDT.balanceOf(exchangeAddress)
        console.log(`Smart contract ekoUSDT balance after: ${contractESBalAft}`)
        expect(Number(contractESBalBef)).to.be.below(Number(contractESBalAft))
    })

    it(`Should withdraw the buyOrder with user two`, async function(){
        let ids = await exchange.getAddressToIds(userTwoAddress)
        //console.log(ids) //2
        let userTwoESBalBef = await ekoUSDT.balanceOf(userTwoAddress)
        console.log(`user two ekosUDT balance: ${userTwoESBalBef}`)
        let contractESBalBef = await ekoUSDT.balanceOf(exchangeAddress)
        console.log(`smart contract ekoUSDT balance: ${contractESBalBef}`)

        await exchange.connect(userTwo).withdrawOrder(ids[0], 0)

        let userTwoESBalAft = await ekoUSDT.balanceOf(userTwoAddress)
        console.log(`user two ekosUDT balance: ${userTwoESBalAft}`)
        let contractESBalAft = await ekoUSDT.balanceOf(exchangeAddress)
        console.log(`smart contract ekoUSDT balance: ${contractESBalAft}`)
        expect(Number(userTwoESBalBef)).to.be.below(Number(userTwoESBalAft))
        expect(Number(contractESBalBef)).to.be.greaterThan(Number(contractESBalAft))
    })

    it(`Should revert the second time withdrawing the buyOrder with userTwo`, async function(){
        await expect(exchange.connect(userTwo).withdrawOrder(2, 0)).to.revertedWith("unexistingOrder")
    })
})
