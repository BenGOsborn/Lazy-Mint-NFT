// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "./lib/strings.sol";

contract Icons is Ownable, ERC1155, ChainlinkClient {
    using SafeMath for uint256;

    // Chainlink data
    address private oracle;
    bytes32 private jobId;
    uint256 linkFee;
    bytes32 private apiUrl;

    // Token data
    uint256 private immutable MINT_FEE_PER_TOKEN; 
    uint256 private immutable MAX_TOKENS; 
    uint256 private tokenId;

    // Store token mint requests
    struct MintRequest {
        uint256 initialTokenId;
        uint256 amount;
        address minter;
        bool fulfilled;
    }
    mapping(bytes32 => MintRequest) private mintRequests;

    constructor (uint256 mintFeePerToken_, uint256 maxTokens_, string memory uri_,
                address oracle_, bytes32 jobId_, uint256 linkFee_, bytes32 apiUrl_) ERC1155(uri_) {
        // Initialize contract data
        MINT_FEE_PER_TOKEN = mintFeePerToken_; 
        MAX_TOKENS = maxTokens_;
        tokenId = 0;

        // Initialize chainlink data
        oracle = oracle_;
        jobId = jobId_;
        linkFee = linkFee_;
        apiUrl = apiUrl_;
    }

    function mint(uint256 _amount) external payable {
        // Verify the tokens may be minted
        require(tokenId + _amount < MAX_TOKENS, "Icons: Tokens to mint exceeds max number of tokens");
        require(msg.value >= _amount.mul(MINT_FEE_PER_TOKEN), "Icons: Not enough funds to mint contract");

        // Initialize the request
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        request.add("post", apiUrl);
        request.add("queryParams", abi.encode("tokenId=", tokenId, "&amount=", _amount));
        request.add("path", "URIs");

        // Update the new current token id
        bytes32 requestId = sendChainlinkRequestTo(oracle, request, linkFee);
        mintRequests[requestId] = MintRequest({
            initialTokenId: tokenId,
            amount: _amount,
            minter: _msgSender(),
            fulfilled: false
        });
        tokenId += _amount;
    }
    
    function fulfill(bytes32 _requestId, string memory _uri) external recordChainlinkFulfillment(_requestId) {
        // Require that the request has not already been fulfilled
        require(!mintRequests[_requestId].fulfilled, "Icons: This request has already been fulfilled");

        // Split the string and add the items to the individuals account
        // **** Very confusing ???
        // strings.split(strings.toSlice(_uri), strings.toSlice(" "), token);

        strings.toString(self);

        // Update the fulfiled state
        mintRequests[_requestId].fulfilled = true;
    }

    function withdraw() external onlyOwner {

    }

    function withdrawLink() external onlyOwner {

    }
}