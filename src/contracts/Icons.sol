// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Icons is Ownable, ERC1155 {
    using SafeMath for uint256;

    uint256 private immutable MINT_FEE_PER_TOKEN; 
    uint256 private immutable MAX_TOKENS; 

    uint256 private tokenId;

    struct MintRequest {
        
    }

    constructor (uint256 mintFeePerToken_, uint256 maxTokens_, string memory uri_) ERC1155(uri_) {
        MINT_FEE_PER_TOKEN = mintFeePerToken_; 
        MAX_TOKENS = maxTokens_;

        tokenId = 0;
    }

    function mint(uint256 _amount) external payable {
        // Verify the tokens may be minted
        require(tokenId + _amount < MAX_TOKENS, "Icons: Tokens to mint exceeds max number of tokens");
        require(msg.value >= _amount.mul(MINT_FEE_PER_TOKEN), "Icons: Not enough funds to mint contract");

        // Mint the NFT's for the address
        for (uint i = 0; i < _amount; i++) {
            // _mint(_msgSender(), tokenId, 1, data);
            tokenId++;
        }
    }
    
    function fullfillRandomoness() external {
        // Go through and mint the NFT here with the received data
    }
}