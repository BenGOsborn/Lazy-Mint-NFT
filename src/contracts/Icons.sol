// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract Icons is Ownable, ERC721, ChainlinkClient {
    using SafeMath for uint256;
    using Chainlink for Chainlink.Request;

    // Chainlink data
    address private oracle;
    bytes32 private jobId;
    uint256 linkFee;
    string private apiUrl;
    address private linkAddress;

    // Token data
    uint256 private immutable MAX_TOKENS; 
    uint256 private immutable MINT_FEE; 
    uint256 private tokenId;

    // Store token mint requests
    mapping(address => bool) private earlyMinters;
    uint256 private earlyMintEnd;

    struct MintRequest { // **** This system here is pretty broken with the first one not being updated - fix it
        uint256 tokenId;
        address minter;
        bytes32 uri1;
        bytes32 uri2;
        bool fulfilled1;
        bool fulfilled2; // **** Is this one really necessary ?
    }
    mapping(bytes32 => MintRequest) private mintRequests;

    constructor(string memory name_, string memory symbol_, uint256 maxTokens_, uint256 mintFee_, uint256 earlyMintEnd_,
                address oracle_, bytes32 jobId_, uint256 linkFee_, string memory apiUrl_, address linkAddress_) ERC721(name_, symbol_) {
        // Initialize data
        MAX_TOKENS = maxTokens_; 
        MINT_FEE = mintFee_;
        earlyMintEnd = earlyMintEnd_;

        // Initialize Chainlink data
        setChainlinkToken(linkAddress_);
        oracle = oracle_;
        jobId = jobId_;
        linkFee = linkFee_;
        apiUrl = apiUrl_;
        linkAddress = linkAddress_;
    }

    // Verify the tokens may be minted
    modifier mintable() {
        require(tokenId + 1 < MAX_TOKENS, "Icons: Max number of tokens has already been reached");
        require(msg.value >= MINT_FEE || _msgSender() == owner(), "Icons: Not enough funds to mint token");
        _;
    }

    // Return the mint fee
    function getMintFee() external view returns (uint256) {
        return MINT_FEE;
    }

    // Authorize a user to early mint
    function addEarlyMinter(address _address) external onlyOwner {
        earlyMinters[_address] = true;
    }

    // Mint the token if the user is approved and it is still in the early mint phase
    function earlyMint() external payable mintable {
        require(block.timestamp < earlyMintEnd, "Icons: Early minting phase is over, please use 'mint' instead");
        require(earlyMinters[_msgSender()] == true || _msgSender() == owner(), "Icons: You are not authorized to mint a token");
        earlyMinters[_msgSender()] = false;
        _mintIcon();
    }

    // Mint the token if it is after the early minting phase
    function mint() external payable mintable {
        require(block.timestamp >= earlyMintEnd, "Icons: Contract is still in early minting phase, please use 'earlyMint' instead");
        _mintIcon();
    }

    // Mint a new Icon
    function _mintIcon() internal {
        // Initialize the request
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill1.selector);
        request.add("get", string(abi.encodePacked(apiUrl, "?tokenId=", tokenId)));
        request.add("path", "chunks.0");

        // Update the new current token id
        bytes32 requestId = sendChainlinkRequestTo(oracle, request, linkFee);
        mintRequests[requestId] = MintRequest({
            tokenId: tokenId,
            minter: _msgSender(),
            uri1: "",
            uri2: "",
            fulfilled1: false,
            fulfilled2: false
        });
    }

    function fulfill1(bytes32 _requestId, bytes32 _response) public recordChainlinkFulfillment(_requestId) {
        // Make sure that the request has not already been fulfilled
        require(!mintRequests[_requestId].fulfilled1, "Icons: Request has already been fulfilled");

        // Initialize the request
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill2.selector);
        request.add("get", string(abi.encodePacked(apiUrl, "?tokenId=", tokenId)));
        request.add("path", "chunks.1");
        bytes32 requestId = sendChainlinkRequestTo(oracle, request, linkFee);

        // Update the mint request
        mintRequests[_requestId].uri1 = _response;
        mintRequests[_requestId].fulfilled1 = true;
        mintRequests[requestId] = mintRequests[_requestId];
    }

    function fulfill2(bytes32 _requestId, bytes32 _response) public recordChainlinkFulfillment(_requestId) {
        // Make sure that the request has not already been fulfilled
        require(!mintRequests[_requestId].fulfilled2, "Icons: Request has already been fulfilled"); // **** This is worthless anyway because we make a copy where the original isnt updated - what if we dont need to make a copy ?

        // Update the mint request
        mintRequests[_requestId].uri2 = _response;
        mintRequests[_requestId].fulfilled2 = true;

        // Mint the new token
        MintRequest memory mintRequest = mintRequests[_requestId];
        _mint(mintRequest.minter, mintRequest.tokenId);
    }

    // Withdraw the coins to the sender
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(_msgSender()).transfer(balance);
    }

    // Withdraw the LINK to the sender
    function withdrawLink() external onlyOwner {
        uint256 balance = IERC20(linkAddress).balanceOf(address(this));
        IERC20(linkAddress).transfer(_msgSender(), balance);
    }
}