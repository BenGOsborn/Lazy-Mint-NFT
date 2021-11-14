// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract Icons is Ownable, ERC1155, ChainlinkClient {
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

        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);

        // Update the new current token id
        tokenId += _amount;
    }
    
    function fulfill(bytes32 _requestId, string[] memory _uri) external recordChainlinkFulfillment(_requestId) {
        // 
    }

    function withdraw() external onlyOwner {

    }

    function withdrawLink() external onlyOwner {
        
    }
}