// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RandoNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _randoNFTIds;
    
    mapping(uint => bool) public locked;
    mapping(uint => ERC721) public contents;

    constructor() ERC721("RandoNFT", "ITM") {}

    function createRandoNFT(address owner)
        public
        returns (uint256)
    {
        _randoNFTIds.increment();

        uint256 newRandoId = _randoNFTIds.current();
        _mint(owner, newRandoId);

        return newRandoId;
    }
}