// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract LockBox is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _boxIds;
    
    mapping(uint256 => bool) public locked;
    mapping(uint256 => ERC721) public contents;

    event StoredToken(address storedTokenContract, uint256 tokenId, uint256 boxId, address boxOwner);

    constructor() ERC721("LockBox", "ITM") {}

    ERC721 erc;

    function createBox(address owner)
        public
        returns (uint256)
    {
        _boxIds.increment();

        uint256 newBoxId = _boxIds.current();
        _mint(owner, newBoxId);

        return newBoxId;
    }

    function storeToken(address tokenContract, uint256 tokenId, uint256 boxId) 
        public
    {
        // TODO:
        // - make sure contract is an erc721
        erc = ERC721(tokenContract);
        address ownerOfToken = erc.ownerOf(tokenId);
        require(ownerOfToken == msg.sender, "Caller does not own stored token");

        address ownerOfBox = ownerOf(boxId);
        require(ownerOfBox == msg.sender, "Caller does not own lock box");

        contents[boxId] = erc;

        delete erc;

        emit StoredToken(tokenContract, tokenId, boxId, msg.sender);
    }
}