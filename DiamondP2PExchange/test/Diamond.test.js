const { expect, assert } = require('chai')
const { ethers } = require("hardhat");
// HELPER: get function selectors from a contract
function getSelectors (contract) {
  // get the function signatures from the ABI of the contract:
  const signatures = Object.keys(contract.interface.functions)
  // convert from signature to selector:
  const selectors = signatures.reduce((acc, val) => {
    acc.push(contract.interface.getSighash(val))
    return acc
  }, [])
  return selectors
}

describe(`Simple Diamond Contract Test`, function(){

    let diamond;
    let diamondAddress;
    /* let libStorage;
    let libStorageAddress; */
   /*  let diamondCutLib;
    let diamondCutLibAddress;
    let diamondLoupeLib;
    let diamondLoupeLibAddress;
    let ownershipLib;
    let ownershipLibAddress;
    let exchangeAndEvent;
    let exchangeAndEventAddress;
    let buyLibrary;
    let buyLibraryAddress;
    let sellLibrary;
    let sellLibraryAddress;
    let withdrawLibrary;
    let withdrawLibraryAddress;    
    let ownerActionLibrary;
    let ownerActionLibraryAddress;
    let viewsLibrary;
    let viewsLibraryAddress; */
    let diamondCutFacet;
    let diamondCutFacetAddress;
    let diamondCutFacetSelectors;
    let diamondLoupeFacet;
    let diamondLoupeFacetAddress;
    let diamondLoupeFacetSelectors;
    let ownershipFacet;
    let ownershipFacetAddress;
    let ownershipFacetSelectors;    
    let buyFacet;
    let buyFacetAddreess;
    let buyFacetSelectors;
    let sellFacet;
    let sellFacetAddress;
    let sellFacetSelectors;
    let withdrawFacet;
    let withdrawFacetAddress;
    let withdrawFacetSelectors;
    let ownerActionFacet;
    let ownerActionFacetAddress;
    let ownerActionFacetSelectors;
    let viewsFacet;
    let viewsFacetAddress;
    let viewsFacetSelectors;
    let token
    let tokenAddress
    let ekoStable
    let ekoStableAddress
    let owner;
    let ownerAddress;
    let userOne;
    let userOneAddress;
    let userTwo;
    let userTwoAddress;

    let contractA;
    let contractAAddress;
    let contractASelectors;

    let contractB;
    let contractBAddress;
    let contractBSelectors;

    it(`Should add the owner`, async function(){
        owner = ethers.provider.getSigner(0)
        ownerAddress = await owner.getAddress();
        console.log(`Owner address: ${ownerAddress}`)
    })

  /*   it(`Should deploy storage library`, async function(){
        libStorage = await(await ethers.getContractFactory('DiamondStorage', owner)).deploy()
        await libStorage.deployed()
        libStorageAddress = libStorage.address 
        console.log(`Storage Library deployed to address: ${libStorageAddress}`)
    }) */
    it(`Should deploy ownership library and facet`, async function(){
        /* ownershipLib = await(await ethers.getContractFactory('OwnershipLib', owner,{
            libraries: {
                DiamondStorage: libStorageAddress,
            }
        })).deploy()
        await ownershipLib.deployed()
        ownershipLibAddress = ownershipLib.address
        console.log(`Ownership library deployed to: ${ownershipLibAddress}`) */

        ownershipFacet = await(await ethers.getContractFactory('OwnershipFacet', owner/* {
            libraries:{
                OwnershipLib: ownershipLibAddress, 
            }
        } */)).deploy()      
        ownershipFacetAddress = ownershipFacet.address
        console.log(`Ownership facet deployed to: ${ownershipFacetAddress}`)

        ownershipFacetSelectors = getSelectors(ownershipFacet)
        console.log(`Ownership facet selectors: `,ownershipFacetSelectors)
    })
    it(`Should deploy diamond cut library and facet`, async function(){
        /* diamondCutLib = await(await ethers.getContractFactory('DiamondCutLib', owner, {
            libraries: {
                DiamondStorage: libStorageAddress,
            }
        })).deploy()
        await diamondCutLib.deployed()
        diamondCutLibAddress = diamondCutLib.address
        console.log(`Diamon cut library deployed to: ${diamondCutLibAddress}`) */

        diamondCutFacet = await(await ethers.getContractFactory('DiamondCutFacet', owner/* , {
            libraries:{
                DiamondCutLib: diamondCutLibAddress,
                OwnershipLib: ownershipLibAddress,
            }
        } */)).deploy()
        diamondCutFacetAddress = diamondCutFacet.address 
        console.log(`Diamond cut facet deployed to: ${diamondCutFacetAddress}`)

        diamondCutFacetSelectors = getSelectors(diamondCutFacet)
        console.log(`Diamond cut facet selectors: ${[diamondCutFacetSelectors]}`)
    })
    it(`Should deploy diamond loupe library and facet`, async function(){
        /* diamondLoupeLib = await(await ethers.getContractFactory(`DiamondLoupeLib`, owner, {
            libraries: {
                DiamondStorage: libStorageAddress,
            }
        })).deploy()
        await diamondLoupeLib.deployed()
        diamondLoupeLibAddress = diamondLoupeLib.address
        console.log(`Diamond loupe lib deployed to: ${diamondLoupeLibAddress}`) */

        diamondLoupeFacet = await(await ethers.getContractFactory(`DiamondLoupe`, owner/* , {
            libraries: {
                DiamondLoupeLib: diamondLoupeLibAddress,
            }
        } */)).deploy()
        diamondLoupeFacetAddress = diamondLoupeFacet.address
        console.log(`Diamond loupe facet deployed to address: ${diamondLoupeFacetAddress}`)

        diamondLoupeFacetSelectors = getSelectors(diamondLoupeFacet)
        console.log(`Diamond loupe facet selectos: ${diamondLoupeFacetSelectors}`)
    })
    it(`Should deploy the diamond contract`, async function(){
        let diamondCutFacetStruct = {
            facetAddress: diamondCutFacetAddress,
            functionSelectors: diamondCutFacetSelectors,
            action: 0,
        }

        let diamonLoupeFacetStruct = {
            facetAddress: diamondLoupeFacetAddress,
            functionSelectors: diamondLoupeFacetSelectors,
            action: 0,
        }

        let diamondOwnershipFacetStruct = {
            facetAddress: ownershipFacetAddress,
            functionSelectors: ownershipFacetSelectors,
            action: 0,
        }

        diamond = await(await ethers.getContractFactory('DiamondExchange', owner/* , {
            libraries: {
                DiamondStorage: libStorageAddress,
                DiamondCutLib: diamondCutFacetAddress,
                DiamondLoupeLib: diamondLoupeFacetAddress,
                OwnershipLib: ownershipFacetAddress,
            }
        } */)).deploy([diamondCutFacetStruct, diamonLoupeFacetStruct, diamondOwnershipFacetStruct])
        await diamond.deployed()
        diamondAddress = diamond.address
        console.log(`Diamond deployed to: ${diamondAddress}`)
    })
    //Testing the ownership facet
    it(`Should call the owner() function`, async function(){
        const ownFac = await ethers.getContractAt('OwnershipFacet', diamondAddress)
        let retrievedOwner = await ownFac.owner()
        console.log(`Retrieved owner: ${retrievedOwner}`)
        console.log(`Owner: ${ownerAddress}`)
        expect(retrievedOwner).to.equal(ownerAddress)
    })
    it(`Should transfer the ownership`, async function(){
        const ownFac = await ethers.getContractAt('OwnershipFacet', diamondAddress)
        let oldOwner = await ownFac.owner()
        console.log(`Actual owner: ${oldOwner}`)

        let newOwner = ethers.provider.getSigner(1)
        let newOwnerAddress = await newOwner.getAddress()
        console.log(`Future owner address: ${newOwnerAddress}`)

        await ownFac.transferOwnership(newOwnerAddress)
        console.log(`Ownership transferred`)

        let retrievedOwner = await ownFac.owner()
        console.log(`Retrieved owner: ${retrievedOwner}`)
        expect(oldOwner).to.not.equal(retrievedOwner)

        await expect(ownFac.connect(owner).transferOwnership(ownerAddress)).to.reverted/* With('NotTheOwner()') */
        console.log(`Operation reverted successfully!`)

        await ownFac.connect(newOwner).transferOwnership(ownerAddress)
        let lastOwner = await ownFac.owner()
        console.log(`Ownership transferred again to: ${lastOwner}`)
        expect(lastOwner).to.equal(ownerAddress)
    })
    //testing diamond loupe facet
    it(`Should call getFacetAddress() from the DiamondLoupe`, async function(){
        const diamLoupe = await ethers.getContractAt('DiamondLoupe', diamondAddress);
        let facetAddress = await diamLoupe.getFacetAddress(0x8da5cb5b)
        console.log(`Function "0x8da5cb5b" is from ${facetAddress}`)
        expect(facetAddress).to.equal(ownershipFacetAddress)
    })
    it(`Should call getFacetsAddresses() from the DiamondLoupe`, async function(){
        const diamLoupe = await ethers.getContractAt('DiamondLoupe', diamondAddress);
        
        let ownerShipselectors = await diamLoupe.getFunctionSelectors(ownershipFacetAddress)
        console.log(`Ownership selectors: ${ownerShipselectors}`)        
        assert.sameMembers(ownerShipselectors, ownershipFacetSelectors)

        let diamondLoupeSelectors = await diamLoupe.getFunctionSelectors(diamondLoupeFacetAddress)
        console.log(`Diamond Loupe selectors: ${diamondLoupeSelectors}`)
        assert.sameMembers(diamondLoupeSelectors, diamondLoupeFacetSelectors)

        let diamondCutSelectors = await diamLoupe.getFunctionSelectors(diamondCutFacetAddress)
        console.log(`Diamond Cut selectors ${diamondCutSelectors}`)
        assert.sameMembers(diamondCutSelectors, diamondCutFacetSelectors)
    })
    it(`Should call the getFacets() from the DiamondLoupe`, async function(){
        const diamLoupe = await ethers.getContractAt('DiamondLoupe', diamondAddress);
        let facets = await diamLoupe.getFacets()
        console.log(facets)
    })
    /* it(`Should deploy the Error and Event library`, async function(){
        exchangeAndEvent = await(await ethers.getContractFactory('ErrorsAndEvents', owner)).deploy()
        await exchangeAndEvent.deployed()
        exchangeAndEventAddress = exchangeAndEvent.address
        console.log(`Error and event library deployed to ${exchangeAndEventAddress}`)        
    }) */
    it(`Should deploy the buy library and facet`, async function(){
        /* buyLibrary = await(await ethers.getContractFactory('BuyScoreTokensLibrary', owner,{
            libraries:{
                DiamondStorage: libStorageAddress,
                ErrorsAndEvents: exchangeAndEventAddress,
            }
        })).deploy()
        await buyLibrary.deployed()
        buyLibraryAddress = buyLibrary.address
        console.log(`Buy library deployed to: ${buyLibraryAddress}`) */

        buyFacet = await(await ethers.getContractFactory('BuyScoreTokenFacet', owner/* , {
            libraries:{
                BuyScoreTokensLibrary: buyLibraryAddress,
            }
        } */)).deploy()
        buyFacetAddreess = buyFacet.address
        console.log(`Buy facet deployed to: ${buyFacetAddreess}`)
        buyFacetSelectors = getSelectors(buyFacet)
        console.log(`Buy Facet selectors ${buyFacetSelectors}`)
    })
    it(`should deploy the sell library and facet`, async function(){
        /* sellLibrary = await(await ethers.getContractFactory('SellScoreTokenLibrary', owner,{
            libraries:{
                DiamondStorage: libStorageAddress,
                ErrorsAndEvents: exchangeAndEventAddress,
            }
        })).deploy()
        await sellLibrary.deployed()
        sellLibraryAddress = sellLibrary.address
        console.log(`Sell library deployed to ${sellLibraryAddress}`) */

        sellFacet = await(await ethers.getContractFactory('SellScoreTokenFacet', owner/* , {
            libraries:{
                SellScoreTokenLibrary: sellLibraryAddress,
            }
        } */)).deploy()
        sellFacetAddress = sellFacet.address
        console.log(`Sell facet deployed to address: ${sellFacetAddress}`)
        sellFacetSelectors = getSelectors(sellFacet)
        console.log(`Sell facet selectors: ${sellFacetSelectors}`)
    })
    it(`Should deploy the withdraw library and facet`, async function(){
        /* withdrawLibrary = await(await ethers.getContractFactory('WithdrawLibrary', owner, {
            libraries:{
                DiamondStorage: libStorageAddress,
                ErrorsAndEvents: exchangeAndEventAddress,
            }
        })).deploy()
        await withdrawLibrary.deployed()
        withdrawLibraryAddress = withdrawLibrary.address
        console.log(`Withdraw library deployed to ${withdrawLibraryAddress}`) */

        withdrawFacet = await(await ethers.getContractFactory('WithdrawFacet', owner, /* {
            libraries: {
                WithdrawLibrary: withdrawLibraryAddress,
                DiamondStorage: libStorageAddress,
            }
        } */)).deploy()
        withdrawFacetAddress = withdrawFacet.address
        console.log(`withdraw facet deployed to ${withdrawFacetAddress}`)

        withdrawFacetSelectors = getSelectors(withdrawFacet)
        console.log(`Withdraw facet selectors: ${withdrawFacetSelectors}`)
    })
    it(`Should deploy the owner action library and facet`, async function(){
        /* ownerActionLibrary = await(await ethers.getContractFactory('OwnerActionsLibrary', owner, {
            libraries: {
                OwnershipLib: ownershipLibAddress,
                DiamondStorage: libStorageAddress,
                ErrorsAndEvents: exchangeAndEventAddress,
            }
        })).deploy()
        await ownerActionLibrary.deployed()
        ownerActionLibraryAddress = ownerActionLibrary.address
        console.log(`Onwer actions library deployed to ${ownerActionLibraryAddress}`) */

        ownerActionFacet = await(await ethers.getContractFactory('OwnerActionFacet', owner/* , {
            libraries:{
                OwnerActionsLibrary: ownerActionLibraryAddress,
            }
        } */)).deploy()
        ownerActionFacetAddress = ownerActionFacet.address
        console.log(`Owner action facet deployed to ${ownerActionFacetAddress}`)

        ownerActionFacetSelectors = getSelectors(ownerActionFacet)
        console.log(`Owner actions facet selectors: ${ownerActionFacetSelectors}`)
    })
    it(`Should deploy the views library and facet`, async function(){
        /* viewsLibrary = await(await ethers.getContractFactory('ViewsLibrary', owner, {
            libraries:{
                DiamondStorage: libStorageAddress,
            }
        })).deploy()
        await viewsLibrary.deployed()
        viewsLibraryAddress = viewsLibrary.address
        console.log(`Views library deployed to ${viewsLibraryAddress}`) */

        viewsFacet = await(await ethers.getContractFactory('ViewsFacet', owner/* , {
            libraries:{
                ViewsLibrary: viewsLibraryAddress,
            }
        } */)).deploy()
        viewsFacetAddress = viewsFacet.address
        console.log(`Views facet deployed to ${viewsFacetAddress}`)

        viewsFacetSelectors = getSelectors(viewsFacet)
        console.log(`View facet selectors: ${viewsFacetSelectors}`)
    })
    it(`Should cut the new facets`, async function(){
        let buyFacetStruct = {
            facetAddress: buyFacetAddreess,
            functionSelectors: buyFacetSelectors,
            action: 0,
        }
        let sellFacetStruct = {
            facetAddress: sellFacetAddress,
            functionSelectors: sellFacetSelectors,
            action: 0,
        }
        let ownerActionStruct = {
            facetAddress: ownerActionFacetAddress,
            functionSelectors: ownerActionFacetSelectors,
            action: 0,
        }
        let viewsFacetStruct = {
            facetAddress: viewsFacetAddress,
            functionSelectors: viewsFacetSelectors,
            action: 0,
        }
        let withdrawFacetStruct = {
            facetAddress: withdrawFacetAddress,
            functionSelectors: withdrawFacetSelectors,
            action: 0,
        }

     /*    let structs = []
        structs.push(buyFacetStruct)
        structs.push(sellFacetStruct)
        structs.push(ownerActionStruct)
        structs.push(viewsFacetStruct)
        structs.push(withdrawFacetStruct)
        console.log(structs, typeof structs) */

        const diamCut = await ethers.getContractAt('DiamondCutFacet', diamondAddress)
        await diamCut.diamondCut([buyFacetStruct, sellFacetStruct, ownerActionStruct, viewsFacetStruct, withdrawFacetStruct])

    })
    it(`Should get the newest facets`, async function(){
        const diamLoupe = await ethers.getContractAt('DiamondLoupe', diamondAddress)
        let facets = await diamLoupe.getFacets()
        console.log(`Diamond facets ${facets}`)
    })
    it(`Should deploy the ekoStable and the scoreToken`, async function(){
        token = await( await ethers.getContractFactory('scoreToken', owner)).deploy()
        await token.deployed()
        tokenAddress = token.address
        console.log(`Token deployed to ${tokenAddress}`)

        ekoStable = await(await ethers.getContractFactory('ekoUSDT', owner)).deploy()
        await ekoStable.deployed()
        ekoStableAddress = ekoStable.address
        console.log(`ekoUSDT deployed to ${ekoStableAddress}`)
    })
    it(`Should create two user`, async function(){
        userOne = ethers.provider.getSigner(1)
        userOneAddress = await userOne.getAddress()
        console.log(`User one address ${userOneAddress}`)

        userTwo = ethers.provider.getSigner(2)
        userTwoAddress = await userTwo.getAddress()
        console.log(`User two address ${userTwoAddress}`)
    })
    it(`Should found user one and user two with both scoretokens and ekoUSDT`, async function(){
        await token.connect(owner).transfer(userOneAddress, '100000000000')
        await ekoStable.connect(owner).transfer(userOneAddress, '1000000000')
        console.log(`User one scoreToken balance: ${await token.balanceOf(userOneAddress)}, ekoUSDT balance: ${await ekoStable.balanceOf(userOneAddress)}`)
        
        await token.connect(owner).transfer(userTwoAddress, '100000000000')
        await ekoStable.connect(owner).transfer(userTwoAddress, '1000000000')
        console.log(`User two scoreToken balance: ${await token.balanceOf(userTwoAddress)}, ekoUSDT balance: ${await ekoStable.balanceOf(userTwoAddress)}`)    
    })
    it(`Should add the ekoUSDT to the accepted ekoStable`, async function(){
        const ownerActionFacet = await ethers.getContractAt('OwnerActionFacet', diamondAddress, owner)
        await ownerActionFacet.addEkostable(ekoStableAddress)

        const viewFacet = await ethers.getContractAt('ViewsFacet', diamondAddress, owner)
        let isAccepted = await viewFacet.getAcceptedEkoStable(ekoStableAddress)
        assert.equal(isAccepted, true)
    })
    it(`Should set the scoreToken address`, async function(){
        const ownerActionFacet = await ethers.getContractAt('OwnerActionFacet', diamondAddress, owner)
        await ownerActionFacet.setScoreTokenAddress(tokenAddress)

        const viewFacet = await ethers.getContractAt('ViewsFacet', diamondAddress, owner)
        let stAddress = await viewFacet.getScoreTokenAddress()
        assert.equal(tokenAddress, stAddress)        
    })
    it(`Should create a buy order with userOne`, async function(){
        let scoreAmount = '1000'
        let ekoStableAmount = '10' 

        let userOneEkoStableAmountBef = await ekoStable.balanceOf(userOneAddress)
        let contractEkoAmountBef = await ekoStable.balanceOf(diamondAddress)
       
        console.log(`UserOne ekostable balance before: ${userOneEkoStableAmountBef}, Contract balance ${contractEkoAmountBef}`)

        await ekoStable.connect(userOne).approve(diamondAddress, ekoStableAmount)
        const buyFacet = await ethers.getContractAt('BuyScoreTokenFacet', diamondAddress, userOne)
        
        /* let buyId = await buyFacet.callStatic.createBuyScoreTokensOrder(ekoStableAddress, ekoStableAmount, scoreAmount)
        console.log(buyId) */
        await buyFacet.createBuyScoreTokensOrder(ekoStableAddress, ekoStableAmount, scoreAmount)
       
        let userOneEkoStableAmountAf = await ekoStable.balanceOf(userOneAddress)
        let contractEkoAmountAf = await ekoStable.balanceOf(diamondAddress)
       
        console.log(`UserOne ekostable balance before: ${userOneEkoStableAmountAf}, Contract balance ${contractEkoAmountAf}`)
        
        expect(Number(userOneEkoStableAmountBef)).to.be.greaterThan(Number(userOneEkoStableAmountAf))
        expect(Number(contractEkoAmountBef)).to.be.below(Number(contractEkoAmountAf))
    })
    it(`Should sell scoreToken to userOne buyOrder with userTwo`, async function(){
        let scoreAmount = '1000'
        let ekoStableAmount = '10' 

        let userOneSTbalBef = await token.balanceOf(userOneAddress)
        let userOneESbalBef = await ekoStable.balanceOf(userOneAddress)
        console.log(`User one balances before ST: ${userOneSTbalBef}, ES: ${userOneESbalBef}`)
        
        let userTwoSTbalBef = await token.balanceOf(userTwoAddress)
        let userTwoESbalBef = await ekoStable.balanceOf(userTwoAddress)
        console.log(`User two balances before, ST: ${userTwoSTbalBef}, ES: ${userTwoESbalBef}`)

        let contractESbalbef = await ekoStable.balanceOf(diamondAddress)
        console.log(`Contract ekoUSDT bal bef: ${contractESbalbef}`)

        await token.connect(userTwo).approve(diamondAddress, scoreAmount)

        const buyFacet = await ethers.getContractAt('BuyScoreTokenFacet', diamondAddress, userTwo)
        await buyFacet.sellScoreTokenToABuyOrder(0)


        let userOneSTbalAf = await token.balanceOf(userOneAddress)
        let userOneESbalAf = await ekoStable.balanceOf(userOneAddress)
        console.log(`User one balances before ST: ${userOneSTbalAf}, ES: ${userOneESbalAf}`)
        
        let userTwoSTbalAf = await token.balanceOf(userTwoAddress)
        let userTwoESbalAf = await ekoStable.balanceOf(userTwoAddress)
        console.log(`User two balances before, ST: ${userTwoSTbalAf}, ES: ${userTwoESbalAf}`)

        let contractESbalAf = await ekoStable.balanceOf(diamondAddress)
        console.log(`Contract ekoUSDT bal bef: ${contractESbalAf}`)

        await expect(buyFacet.sellScoreTokenToABuyOrder(0)).to.reverted/* With('UnexistingOrder') */
    })
    it(`Should create a sell score token order with user one`, async function(){
        let scoreAmount = '1000'
        let ekoStableAmount = '10' 

        let userSTAmBef = await token.balanceOf(userOneAddress)
        console.log(`User one st amount before: ${userSTAmBef}`)

        let contractSTAmbef = await token.balanceOf(diamondAddress)
        console.log(`contract ST amount before: ${contractSTAmbef}`)

        await token.connect(userOne).approve(diamondAddress, scoreAmount)

        const sellFacet = await ethers.getContractAt('SellScoreTokenFacet', diamondAddress, userOne)
        await sellFacet.createSellScoreTokenOrder(scoreAmount, ekoStableAddress, ekoStableAmount)

        let userSTAmAf = await token.balanceOf(userOneAddress)
        console.log(`User one ST balance after: ${userSTAmAf}`)

        let contractSTAmAf = await token.balanceOf(diamondAddress)
        console.log(`contract ST balance after: ${contractSTAmAf}`)
        expect(Number(userSTAmBef)).to.be.greaterThan(Number(userSTAmAf))
        expect(Number(contractSTAmbef)).to.be.below(Number(contractSTAmAf))
    })
    it(`Should buy the scoreToken with user two from userOne order`, async function(){
        let scoreAmount = '1000'
        let ekoStableAmount = '10' 

        let userOneSTbalBef = await token.balanceOf(userOneAddress)
        let userOneESbalBef = await ekoStable.balanceOf(userOneAddress)
        console.log(`User one balances before, ST: ${userOneSTbalBef}, ES: ${userOneESbalBef}`)

        let userTwoSTbalBed = await token.balanceOf(userTwoAddress)
        let userTwoESbalBef = await ekoStable.balanceOf(userTwoAddress)
        console.log(`User two balances before, ST: ${userTwoSTbalBed}, ES: ${userTwoESbalBef}`)

        let contractSTbalBef = await token.balanceOf(diamondAddress)
        console.log(`Contract balance before, ST: ${contractSTbalBef}`)

        await ekoStable.connect(userTwo).approve(diamondAddress, ekoStableAmount)

        const sellFacet = await ethers.getContractAt('SellScoreTokenFacet', diamondAddress, userTwo)
        await sellFacet.buyScoreTokensFromSellOrder(1)

        let userOneSTbalAf = await token.balanceOf(userOneAddress)
        let userOneESbalAf = await ekoStable.balanceOf(userOneAddress)
        console.log(`User one balances after, ST: ${userOneSTbalAf}, ES: ${userOneESbalAf}`)

        let userTwoSTbalAf = await token.balanceOf(userTwoAddress)
        let userTwoESbalAf = await ekoStable.balanceOf(userTwoAddress)
        console.log(`User two balances after, ST: ${userTwoSTbalAf}, ES: ${userTwoESbalAf}`)

        let contractSTbalAf = await token.balanceOf(diamondAddress)
        console.log(`Contract balance after, ST: ${contractSTbalAf}`)

        expect(Number(userOneESbalBef)).to.be.below(Number(userOneESbalAf))

        expect(Number(userTwoSTbalBed)).to.be.below(Number(userTwoSTbalAf))
        expect(Number(userTwoESbalBef)).to.be.greaterThan(Number(userOneESbalAf))

        expect(Number(contractSTbalBef)).to.be.greaterThan(Number(contractSTbalAf))

        await expect(sellFacet.buyScoreTokensFromSellOrder(1)).to.reverted/* With('UnexistingOrder') */
    })
    it(`Should create a buy order with user two`, async function(){
        let scoreAmount = '1000'
        let ekoStableAmount = '10' 

        let userTwoEkoStableAmountBef = await ekoStable.balanceOf(userTwoAddress)
        let contractEkoAmountBef = await ekoStable.balanceOf(diamondAddress)
       
        console.log(`User two ekostable balance before: ${userTwoEkoStableAmountBef}, Contract balance ${contractEkoAmountBef}`)

        await ekoStable.connect(userTwo).approve(diamondAddress, ekoStableAmount)
        const buyFacet = await ethers.getContractAt('BuyScoreTokenFacet', diamondAddress, userTwo)
        
        /* let buyId = await buyFacet.callStatic.createBuyScoreTokensOrder(ekoStableAddress, ekoStableAmount, scoreAmount)
        console.log(buyId) */
        await buyFacet.createBuyScoreTokensOrder(ekoStableAddress, ekoStableAmount, scoreAmount)
       
        let userTwoEkoStableAmountAf = await ekoStable.balanceOf(userTwoAddress)
        let contractEkoAmountAf = await ekoStable.balanceOf(diamondAddress)
       
        console.log(`UserTwo ekostable balance before: ${userTwoEkoStableAmountAf}, Contract balance ${contractEkoAmountAf}`)
        
        expect(Number(userTwoEkoStableAmountBef)).to.be.greaterThan(Number(userTwoEkoStableAmountAf))
        expect(Number(contractEkoAmountBef)).to.be.below(Number(contractEkoAmountAf))
    })
    it(`Should sell scoreToken to userTwo buyOrder with userOne`, async function(){
        let scoreAmount = '1000'
        let ekoStableAmount = '10' 

        let userOneSTbalBef = await token.balanceOf(userOneAddress)
        let userOneESbalBef = await ekoStable.balanceOf(userOneAddress)
        console.log(`User one balances before ST: ${userOneSTbalBef}, ES: ${userOneESbalBef}`)
        
        let userTwoSTbalBef = await token.balanceOf(userTwoAddress)
        let userTwoESbalBef = await ekoStable.balanceOf(userTwoAddress)
        console.log(`User two balances before, ST: ${userTwoSTbalBef}, ES: ${userTwoESbalBef}`)

        let contractESbalbef = await ekoStable.balanceOf(diamondAddress)
        console.log(`Contract ekoUSDT bal bef: ${contractESbalbef}`)

        await token.connect(userOne).approve(diamondAddress, scoreAmount)

        const buyFacet = await ethers.getContractAt('BuyScoreTokenFacet', diamondAddress, userOne)
        await buyFacet.sellScoreTokenToABuyOrder(2)


        let userOneSTbalAf = await token.balanceOf(userOneAddress)
        let userOneESbalAf = await ekoStable.balanceOf(userOneAddress)
        console.log(`User one balances after ST: ${userOneSTbalAf}, ES: ${userOneESbalAf}`)
        
        let userTwoSTbalAf = await token.balanceOf(userTwoAddress)
        let userTwoESbalAf = await ekoStable.balanceOf(userTwoAddress)
        console.log(`User two balances after, ST: ${userTwoSTbalAf}, ES: ${userTwoESbalAf}`)

        let contractESbalAf = await ekoStable.balanceOf(diamondAddress)
        console.log(`Contract ekoUSDT bal after: ${contractESbalAf}`)

        expect(Number(userOneSTbalBef)).to.be.greaterThan(Number(userOneSTbalAf))
        expect(Number(userOneESbalBef)).to.be.below(Number(userOneESbalAf))

        expect(Number(userTwoSTbalBef)).to.be.below(Number(userTwoSTbalAf))

        expect(Number(contractESbalbef)).to.be.greaterThan(Number(contractESbalAf))

        await expect(buyFacet.sellScoreTokenToABuyOrder(2)).to.reverted/* With('UnexistingOrder') */
    })
    it(`Should create a sell score token order with user two`, async function(){
        let scoreAmount = '1000'
        let ekoStableAmount = '10' 

        let userSTAmBef = await token.balanceOf(userTwoAddress)
        console.log(`User one st amount before: ${userSTAmBef}`)

        let contractSTAmbef = await token.balanceOf(diamondAddress)
        console.log(`contract ST amount before: ${contractSTAmbef}`)

        await token.connect(userTwo).approve(diamondAddress, scoreAmount)

        const sellFacet = await ethers.getContractAt('SellScoreTokenFacet', diamondAddress, userTwo)
        await sellFacet.createSellScoreTokenOrder(scoreAmount, ekoStableAddress, ekoStableAmount)

        let userSTAmAf = await token.balanceOf(userTwoAddress)
        console.log(`User one ST balance after: ${userSTAmAf}`)

        let contractSTAmAf = await token.balanceOf(diamondAddress)
        console.log(`contract ST balance after: ${contractSTAmAf}`)
        expect(Number(userSTAmBef)).to.be.greaterThan(Number(userSTAmAf))
        expect(Number(contractSTAmbef)).to.be.below(Number(contractSTAmAf))
    })
    it(`Should buy the scoreToken with user one from userTwo order`, async function(){
        let scoreAmount = '1000'
        let ekoStableAmount = '10' 

        let userOneSTbalBef = await token.balanceOf(userOneAddress)
        let userOneESbalBef = await ekoStable.balanceOf(userOneAddress)
        console.log(`User one balances before, ST: ${userOneSTbalBef}, ES: ${userOneESbalBef}`)

        let userTwoSTbalBed = await token.balanceOf(userTwoAddress)
        let userTwoESbalBef = await ekoStable.balanceOf(userTwoAddress)
        console.log(`User two balances before, ST: ${userTwoSTbalBed}, ES: ${userTwoESbalBef}`)

        let contractSTbalBef = await token.balanceOf(diamondAddress)
        console.log(`Contract balance before, ST: ${contractSTbalBef}`)

        await ekoStable.connect(userOne).approve(diamondAddress, ekoStableAmount)

        const sellFacet = await ethers.getContractAt('SellScoreTokenFacet', diamondAddress, userOne)
        await sellFacet.buyScoreTokensFromSellOrder(3)

        let userOneSTbalAf = await token.balanceOf(userOneAddress)
        let userOneESbalAf = await ekoStable.balanceOf(userOneAddress)
        console.log(`User one balances after, ST: ${userOneSTbalAf}, ES: ${userOneESbalAf}`)

        let userTwoSTbalAf = await token.balanceOf(userTwoAddress)
        let userTwoESbalAf = await ekoStable.balanceOf(userTwoAddress)
        console.log(`User two balances after, ST: ${userTwoSTbalAf}, ES: ${userTwoESbalAf}`)

        let contractSTbalAf = await token.balanceOf(diamondAddress)
        console.log(`Contract balance after, ST: ${contractSTbalAf}`)

        expect(Number(userOneESbalBef)).to.be.greaterThan(Number(userOneESbalAf))
        expect(Number(userOneSTbalBef)).to.be.below(Number(userOneSTbalAf))

        expect(Number(userOneESbalAf)).to.be.greaterThan(Number(userTwoESbalBef))

        expect(Number(contractSTbalBef)).to.be.greaterThan(Number(contractSTbalAf))

        await expect(sellFacet.buyScoreTokensFromSellOrder(1)).to.reverted/* With('UnexistingOrder') */
    })
    it(`Should create 5 buy orders with userOne`, async function(){
        var scoreAmount = '1000'
        var ekoStableAmount = '10'

        await ekoStable.connect(userOne).approve(diamondAddress, ekoStableAmount)

        const buyFacet = await ethers.getContractAt('BuyScoreTokenFacet', diamondAddress, userOne)
        await buyFacet.createBuyScoreTokensOrder(ekoStableAddress, ekoStableAmount, scoreAmount)

        console.log(`buy order created: requesting ST: ${scoreAmount} giving ES: ${ekoStableAmount}`)

        scoreAmount = '1500'
        ekoStableAmount = '10'

        await ekoStable.connect(userOne).approve(diamondAddress, ekoStableAmount)      
        await buyFacet.createBuyScoreTokensOrder(ekoStableAddress, ekoStableAmount, scoreAmount)

        console.log(`buy order created: requesting ST: ${scoreAmount} giving ES: ${ekoStableAmount}`)

        scoreAmount = '2000'
        ekoStableAmount = '20'

        await ekoStable.connect(userOne).approve(diamondAddress, ekoStableAmount)       
        await buyFacet.createBuyScoreTokensOrder(ekoStableAddress, ekoStableAmount, scoreAmount)

        console.log(`buy order created: requesting ST: ${scoreAmount} giving ES: ${ekoStableAmount}`)

        scoreAmount = '2500'
        ekoStableAmount = '25'

        await ekoStable.connect(userOne).approve(diamondAddress, ekoStableAmount)        
        await buyFacet.createBuyScoreTokensOrder(ekoStableAddress, ekoStableAmount, scoreAmount)

        console.log(`buy order created: requesting ST: ${scoreAmount} giving ES: ${ekoStableAmount}`)

        scoreAmount = '3000'
        ekoStableAmount = '30'

        await ekoStable.connect(userOne).approve(diamondAddress, ekoStableAmount)        
        await buyFacet.createBuyScoreTokensOrder(ekoStableAddress, ekoStableAmount, scoreAmount)

        console.log(`buy order created: requesting ST: ${scoreAmount} giving ES: ${ekoStableAmount}`)
    })
    it(`Should create 5 sell orders with userOne`, async function(){
        var scoreAmount = '1000'
        var ekoStableAmount = '10' 
       
        await token.connect(userOne).approve(diamondAddress, scoreAmount)

        const sellFacet = await ethers.getContractAt('SellScoreTokenFacet', diamondAddress, userOne)
        await sellFacet.createSellScoreTokenOrder(scoreAmount, ekoStableAddress, ekoStableAmount)
        console.log(`Sell order created: giving ST: ${scoreAmount} requesting ES: ${ekoStableAmount}`)

        scoreAmount = '1500'
        ekoStableAmount = '15' 
       
        await token.connect(userOne).approve(diamondAddress, scoreAmount)
        
        await sellFacet.createSellScoreTokenOrder(scoreAmount, ekoStableAddress, ekoStableAmount)
        console.log(`Sell order created: giving ST: ${scoreAmount} requesting ES: ${ekoStableAmount}`)
        
        scoreAmount = '2000'
        ekoStableAmount = '20' 
       
        await token.connect(userOne).approve(diamondAddress, scoreAmount)
        
        await sellFacet.createSellScoreTokenOrder(scoreAmount, ekoStableAddress, ekoStableAmount)
        console.log(`Sell order created: giving ST: ${scoreAmount} requesting ES: ${ekoStableAmount}`)

        scoreAmount = '2500'
        ekoStableAmount = '25' 
       
        await token.connect(userOne).approve(diamondAddress, scoreAmount)
        
        await sellFacet.createSellScoreTokenOrder(scoreAmount, ekoStableAddress, ekoStableAmount)
        console.log(`Sell order created: giving ST: ${scoreAmount} requesting ES: ${ekoStableAmount}`)

        scoreAmount = '3000'
        ekoStableAmount = '30' 
       
        await token.connect(userOne).approve(diamondAddress, scoreAmount)
        
        await sellFacet.createSellScoreTokenOrder(scoreAmount, ekoStableAddress, ekoStableAmount)
        console.log(`Sell order created: giving ST: ${scoreAmount} requesting ES: ${ekoStableAmount}`)
    })
    it(`Should create 5 buy orders with userTwo`, async function(){
        var scoreAmount = '1000'
        var ekoStableAmount = '10'

        await ekoStable.connect(userTwo).approve(diamondAddress, ekoStableAmount)

        const buyFacet = await ethers.getContractAt('BuyScoreTokenFacet', diamondAddress, userTwo)
        await buyFacet.createBuyScoreTokensOrder(ekoStableAddress, ekoStableAmount, scoreAmount)

        console.log(`buy order created: requesting ST: ${scoreAmount} giving ES: ${ekoStableAmount}`)

        scoreAmount = '1500'
        ekoStableAmount = '10'

        await ekoStable.connect(userTwo).approve(diamondAddress, ekoStableAmount)      
        await buyFacet.createBuyScoreTokensOrder(ekoStableAddress, ekoStableAmount, scoreAmount)

        console.log(`buy order created: requesting ST: ${scoreAmount} giving ES: ${ekoStableAmount}`)

        scoreAmount = '2000'
        ekoStableAmount = '20'

        await ekoStable.connect(userTwo).approve(diamondAddress, ekoStableAmount)       
        await buyFacet.createBuyScoreTokensOrder(ekoStableAddress, ekoStableAmount, scoreAmount)

        console.log(`buy order created: requesting ST: ${scoreAmount} giving ES: ${ekoStableAmount}`)

        scoreAmount = '2500'
        ekoStableAmount = '25'

        await ekoStable.connect(userTwo).approve(diamondAddress, ekoStableAmount)        
        await buyFacet.createBuyScoreTokensOrder(ekoStableAddress, ekoStableAmount, scoreAmount)

        console.log(`buy order created: requesting ST: ${scoreAmount} giving ES: ${ekoStableAmount}`)

        scoreAmount = '3000'
        ekoStableAmount = '30'

        await ekoStable.connect(userTwo).approve(diamondAddress, ekoStableAmount)        
        await buyFacet.createBuyScoreTokensOrder(ekoStableAddress, ekoStableAmount, scoreAmount)

        console.log(`buy order created: requesting ST: ${scoreAmount} giving ES: ${ekoStableAmount}`)  
    })
    it(`Should create 5 sell orders with userTwo`, async function(){
        var scoreAmount = '1000'
        var ekoStableAmount = '10' 
       
        await token.connect(userTwo).approve(diamondAddress, scoreAmount)

        const sellFacet = await ethers.getContractAt('SellScoreTokenFacet', diamondAddress, userTwo)
        await sellFacet.createSellScoreTokenOrder(scoreAmount, ekoStableAddress, ekoStableAmount)
        console.log(`Sell order created: giving ST: ${scoreAmount} requesting ES: ${ekoStableAmount}`)

        scoreAmount = '1500'
        ekoStableAmount = '15' 
       
        await token.connect(userTwo).approve(diamondAddress, scoreAmount)
        
        await sellFacet.createSellScoreTokenOrder(scoreAmount, ekoStableAddress, ekoStableAmount)
        console.log(`Sell order created: giving ST: ${scoreAmount} requesting ES: ${ekoStableAmount}`)
        
        scoreAmount = '2000'
        ekoStableAmount = '20' 
       
        await token.connect(userTwo).approve(diamondAddress, scoreAmount)
        
        await sellFacet.createSellScoreTokenOrder(scoreAmount, ekoStableAddress, ekoStableAmount)
        console.log(`Sell order created: giving ST: ${scoreAmount} requesting ES: ${ekoStableAmount}`)

        scoreAmount = '2500'
        ekoStableAmount = '25' 
       
        await token.connect(userTwo).approve(diamondAddress, scoreAmount)
        
        await sellFacet.createSellScoreTokenOrder(scoreAmount, ekoStableAddress, ekoStableAmount)
        console.log(`Sell order created: giving ST: ${scoreAmount} requesting ES: ${ekoStableAmount}`)

        scoreAmount = '3000'
        ekoStableAmount = '30' 
       
        await token.connect(userTwo).approve(diamondAddress, scoreAmount)
        
        await sellFacet.createSellScoreTokenOrder(scoreAmount, ekoStableAddress, ekoStableAmount)
        console.log(`Sell order created: giving ST: ${scoreAmount} requesting ES: ${ekoStableAmount}`)
    })
    it(`Should test the view functions`, async function(){
        const viewFacet = await ethers.getContractAt('ViewsFacet', diamondAddress)

        let userOneOrders = await viewFacet.getOrdersIdByOwner(userOneAddress)
        console.log('user one orders', userOneOrders)
        
        let userTwoOrders = await viewFacet.getOrdersIdByOwner(userTwoAddress)
        console.log('User two orders', userTwoOrders)

        let latestBuyOrders = await viewFacet.getLatestBuyOrders('10')
        console.log('Latest buy orders', latestBuyOrders)

        let latestSellOrders = await viewFacet.getLatestSellOrders('10')
        console.log(`Latest sell orders ${latestSellOrders}`)

        for(let i = 0; i < latestBuyOrders.length; ++i){
            let tempBuyOrder = await viewFacet.getOrderByOrderId(latestBuyOrders[i])
            console.log(`Temp buy order ${i}: ${tempBuyOrder}`)
        }

        for(let i = 0; i < latestSellOrders.length; ++i){
            let tempSellOrder = await viewFacet.getOrderByOrderId(latestSellOrders[i])
            console.log(`Temp sell order ${i}: ${tempSellOrder}`)
        }

        let latestBuyOrderz = await viewFacet.getLatestBuyOrders('15')
        console.log('Latest buy orders', latestBuyOrderz)

        let latestSellOrderz = await viewFacet.getLatestSellOrders('15')
        console.log(`Latest sell orders ${latestSellOrderz}`)

        assert.sameDeepMembers(latestBuyOrders, latestBuyOrderz)
        assert.sameDeepMembers(latestSellOrders, latestSellOrderz)
    })
    it(`Should withdraw an order of userOne`, async function(){
        let userSTbalBef = await token.balanceOf(userOneAddress)
        let userESbalBef = await ekoStable.balanceOf(userOneAddress)
        console.log(`User balances before witrhdrawing, ST: ${userSTbalBef}, ES: ${userESbalBef}`)
        
        let contractSTbalBef = await token.balanceOf(diamondAddress)
        let contractESbalBef = await ekoStable.balanceOf(diamondAddress)
        console.log(`Contract balances before withdrawing, ST: ${contractSTbalBef}, ES: ${contractESbalBef}`)

        const withdrawFacet = await ethers.getContractAt('WithdrawFacet', diamondAddress, userOne)
        await withdrawFacet.withdrawOrder(4, 0)
        
        let userSTbalAf = await token.balanceOf(userOneAddress)
        let userESbalAf= await ekoStable.balanceOf(userOneAddress)
        console.log(`User balances after witrhdrawing, ST: ${userSTbalAf}, ES: ${userESbalAf}`)
        
        let contractSTbalAf = await token.balanceOf(diamondAddress)
        let contractESbalAf = await ekoStable.balanceOf(diamondAddress)
        console.log(`Contract balances after withdrawing, ST: ${contractSTbalAf}, ES: ${contractESbalAf}`)
    })
    it(`Deploying contract A and contract B`, async function(){
        contractA = await(await ethers.getContractFactory('ContractA', owner)).deploy()
        contractAAddress = contractA.address
        console.log(`ContractA deployed to: ${contractAAddress}`)
        contractASelectors = getSelectors(contractA)
        console.log(`ContractA selectors: ${contractASelectors}`)

        contractB = await(await ethers.getContractFactory('ContractB', owner)).deploy()
        contractBAddress = contractB.address
        console.log(`ContractB deployed to: ${contractBAddress}`)
        contractBSelectors = getSelectors(contractB)
        console.log(`ContractB selectors: ${contractBSelectors}`)
    })
    it(`Should add contractA facet to the diamond`, async function(){
        let contractAStruct = {
            facetAddress: contractAAddress,
            functionSelectors: contractASelectors,
            action: 0, //add
        }

        const diamCut = await ethers.getContractAt('DiamondCutFacet', diamondAddress)
        await diamCut.diamondCut([contractAStruct])

        const diamLoupe = await ethers.getContractAt('DiamondLoupe', diamondAddress)
        let address = await diamLoupe.getFacetAddress('0xce6d41de')
        console.log(`Selector '0xce6d41de' is from ${address}`)
        assert.equal(address, contractAAddress)
    })
    it(`Should call the getMessage from contractA facet`, async function(){
        const contA = await ethers.getContractAt('ContractA', diamondAddress)
        let message = await contA.getMessage()
        console.log(`${message}`)
    })
    it(`Should replace the getMessage function`, async function(){
        let contractBStruct = {
            facetAddress: contractBAddress,
            functionSelectors: contractBSelectors,
            action: 1,
        }

        const diamCut = await ethers.getContractAt('DiamondCutFacet', diamondAddress)
        await diamCut.diamondCut([contractBStruct])

        const diamLoupe = await ethers.getContractAt('DiamondLoupe', diamondAddress)
        let address = await diamLoupe.getFacetAddress('0xce6d41de')
        console.log(`Selector '0xce6d41de' is from ${address}`)
        assert.equal(address, contractBAddress)
    })
    it(`Should call the getMessage from contractB facet`, async function(){
        const contB = await ethers.getContractAt('ContractB', diamondAddress)
        let message = await contB.getMessage()
        console.log(`${message}`)
    })

})