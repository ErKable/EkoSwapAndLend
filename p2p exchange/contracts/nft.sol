//SPDX-License-Identifier: MIT

pragma solidity 0.8.15;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract nft is ERC721{
    uint256 private id = 1;
    constructor() ERC721("NFTTest","NFTT") {}

    function sendNft(address receiver) external{        
        _mint(receiver, id);
        ++id;
    }
}