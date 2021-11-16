// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "./lib/Strings.sol";

contract IconsTest is Ownable, ERC1155, ChainlinkClient {
    using SafeMath for uint256;
    using Chainlink for Chainlink.Request;
    using Strings for string;

    // Chainlink data
    address private oracle;
    bytes32 private jobId;
    uint256 linkFee;
    string private apiUrl;
    address private linkAddress;

    // Token data
    uint256 private immutable MAX_TOKENS; 
    uint256 private mintFeePerToken; 
    uint256 private tokenId;

    // Store token mint requests
    mapping(address => uint256) private earlyMinters;
    uint256 private earlyMintEnd;

    struct MintRequest {
        uint256 initialTokenId;
        uint256 amount;
        address minter;
        bool fulfilled;
    }
    mapping(bytes32 => MintRequest) private mintRequests;

    constructor (uint256 mintFeePerToken_, uint256 maxTokens_, string memory uri_, uint256 earlyMintEnd_, address linkAddress_) ERC1155(uri_) {
    // constructor (uint256 mintFeePerToken_, uint256 maxTokens_, string memory uri_, uint256 earlyMintEnd_, address oracle_, bytes32 jobId_, uint256 linkFee_, string memory apiUrl_, address linkAddress_) ERC1155(uri_) {
        // Initialize contract data
        MAX_TOKENS = maxTokens_;
        mintFeePerToken = mintFeePerToken_; 
        earlyMintEnd = earlyMintEnd_;
        tokenId = 0;

        // Initialize chainlink data
        setChainlinkToken(linkAddress_);
        // oracle = oracle_;
        // jobId = jobId_;
        // linkFee = linkFee_;
        // apiUrl = apiUrl_;
        oracle = 0x3A56aE4a2831C3d3514b5D7Af5578E45eBDb7a40;
        jobId = "187bb80e5ee74a139734cac7475f3c6e";
        linkFee = 1e16;
        apiUrl = "https://lazy-nft.herokuapp.com/generate";

        linkAddress = linkAddress_;
    }

    modifier mintable(uint256 _amount) {
        // Verify the tokens may be minted
        require(tokenId + _amount < MAX_TOKENS, "Icons: Tokens to mint exceeds max number of tokens");
        require(msg.value >= _amount.mul(mintFeePerToken) || _msgSender() == owner(), "Icons: Not enough funds to mint contract");
        _;
    }

    // Update the API url
    function setAPIUrl(string memory _url) external onlyOwner {
        apiUrl = _url;
    }

    // Get the mint fee
    function mintFee() external view returns (uint256) {
        return mintFeePerToken;
    }

    // Set the mint fee for each token
    function setMintFeePerToken(uint256 fee_) external onlyOwner {
        mintFeePerToken = fee_;
    }

    // Set the users early mint limit
    function earlyMintList(address _address, uint256 _amount) external onlyOwner {
        earlyMinters[_address] = _amount;
    }

    function earlyMint(uint256 _amount) external payable mintable(_amount) {
        // Mint the token if the user is approved and it is still in the early mint phase
        require(block.timestamp < earlyMintEnd, "Icons: Early minting phase is over, please use 'mint' instead");
        require(earlyMinters[_msgSender()] >= _amount, "Icons: You are not authorized to mint this amount of tokens");
        _mintIcon(_amount);
    }

    function mint(uint256 _amount) external payable mintable(_amount) {
        // Mint the token if it is after the early minting phase
        require(block.timestamp >= earlyMintEnd, "Icons: Contract is still in early minting phase, please use 'earlyMint' instead");
        _mintIcon(_amount);
    }

    function _mintIcon(uint256 _amount) internal {
        // Verify the amount of tokens to mint is greater than 0
        require(_amount > 0, "Icons: Amount of tokens must be greater then 0");

        // Initialize the request
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        request.add("get", string(abi.encodePacked(apiUrl, "?tokenId=", tokenId, "&amount=", _amount)));
        request.add("path", "uris");

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
    
    function fulfill(bytes32 _requestId, bytes32 _uri) public recordChainlinkFulfillment(_requestId) {
        // Require that the request has not already been fulfilled
        MintRequest memory request = mintRequests[_requestId];
        require(!request.fulfilled, "Icons: This request has already been fulfilled");

        // Split the string and add the items to the minters account
        // string[] memory split = string(abi.encodePacked(_uri)).split(" ");
        for (uint i = 0; i < request.amount; i++) {
            // _mint(request.minter, request.initialTokenId + i, 1, bytes(split[i]));
            _mint(request.minter, request.initialTokenId + i, 1, "");
        }

        // Update the fulfiled state
        mintRequests[_requestId].fulfilled = true;
    }

    function withdraw() external onlyOwner {
        // Withdraw the coins to the sender
        uint256 balance = address(this).balance;
        payable(_msgSender()).transfer(balance);
    }

    function withdrawLink() external onlyOwner {
        // Withdraw the balance of LINK to the sender
        uint256 balance = IERC20(linkAddress).balanceOf(address(this));
        IERC20(linkAddress).transfer(_msgSender(), balance);
    }
}