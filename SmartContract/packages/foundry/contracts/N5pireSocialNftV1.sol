// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract N5pireSocialNFT is ERC721URIStorage, Ownable {
    uint256 public mintPrice = 0.001 ether;
    uint256 private _tokenIds;

    event BlogMinted(address indexed minter, uint256 tokenId, address indexed writer, string tokenURI);

    constructor() ERC721("BlogEntryNFT", "BENT") {}

    // Function to mint a blog entry NFT
    function mintBlog(address writer, string memory tokenURI) external payable returns (uint256) {
        require(msg.value == mintPrice, "Incorrect mint price");

        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _safeMint(msg.sender, newTokenId); // Mint NFT to the caller
        _setTokenURI(newTokenId, tokenURI); // Set the metadata URI for the NFT

        emit BlogMinted(msg.sender, newTokenId, writer, tokenURI);

        return newTokenId;
    }

    // Function to withdraw funds
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}