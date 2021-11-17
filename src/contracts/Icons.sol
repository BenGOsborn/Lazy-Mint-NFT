// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract Icons is Ownable, ERC721, ChainlinkClient {
    using Chainlink for Chainlink.Request;
    using Strings for uint256;

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
    mapping(uint256 => string) private tokenUris;

    // Store token mint requests
    mapping(address => bool) private earlyMinters;
    uint256 private earlyMintEnd;

    struct MintRequest {
        uint256 tokenId;
        address minter;
        bytes32 tempUri;
        bool fulfilled;
    }
    struct MintRequestPtr {
        bytes32 mintRequestPtr;
        bool fulfilled;
    }
    mapping(bytes32 => MintRequest) private mintRequests;
    mapping(bytes32 => MintRequestPtr) private mintRequestPtrs;

    constructor(string memory name_, string memory symbol_, uint256 maxTokens_, uint256 mintFee_, uint256 earlyMintEnd_,
                address oracle_, bytes32 jobId_, uint256 linkFee_, string memory apiUrl_, address linkAddress_) ERC721(name_, symbol_) {
        // Initialize data
        MAX_TOKENS = maxTokens_; 
        MINT_FEE = mintFee_;
        earlyMintEnd = earlyMintEnd_;

        // Initialize Chainlink data
        // oracle = oracle_;
        // jobId = jobId_;
        // linkFee = linkFee_;
        // apiUrl = apiUrl_;
        // linkAddress = linkAddress_;

        linkAddress = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
        setChainlinkToken(linkAddress);
        oracle = 0xc8D925525CA8759812d0c299B90247917d4d4b7C;
        jobId = "a7330d0b4b964c05abc66a26307047c0";
        apiUrl = "https://lazy-nft.herokuapp.com/generate";
        linkFee = 0.01 * 10 ** 18; // (Varies by network and job)

        setChainlinkToken(linkAddress);
    }

    // Base URI for the metadata
    function _baseURI() internal pure override returns (string memory) {
        return "https://ipfs.io/ipfs/";
    }

    // Get the URI for a token
    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        require(_exists(_tokenId), "ERC721Metadata: URI query for nonexistent token");
        return string(abi.encodePacked(_baseURI(), tokenUris[_tokenId]));
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

    function requestData() external {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill1.selector);
        request.add("get", string(abi.encodePacked(apiUrl, "?tokenId=", tokenId.toString())));
        request.add("path", "chunks.0");
        sendChainlinkRequestTo(oracle, request, linkFee);
    }

    // Mint a new Icon
    function _mintIcon() internal {
        // Initialize the request
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill1.selector);
        // request.add("get", string(abi.encodePacked(apiUrl, "?tokenId=", tokenId)));
        request.add("get", "https://lazy-nft.herokuapp.com/generate?tokenId=3");
        request.add("path", "chunks.0");
        sendChainlinkRequestTo(oracle, request, linkFee);

        // Update the new current token id
        // bytes32 requestId = sendChainlinkRequestTo(oracle, request, linkFee);
        // mintRequests[requestId] = MintRequest({
        //     tokenId: tokenId,
        //     minter: _msgSender(),
        //     tempUri: "",
        //     fulfilled: false
        // });
    }

    function fulfill1(bytes32 _requestId, bytes32 _response) public recordChainlinkFulfillment(_requestId) {
        // Make sure that the request has not already been fulfilled
        // require(!mintRequests[_requestId].fulfilled, "Icons: Request has already been fulfilled");

        // Initialize the request
        // Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill2.selector);
        // request.add("get", string(abi.encodePacked(apiUrl, "?tokenId=", mintRequests[_requestId].tokenId))); // **** Maybe this needs to be 'toString' ?
        // request.add("path", "chunks.1");
        // bytes32 requestId = sendChainlinkRequestTo(oracle, request, linkFee);

        // Update the mint request
        // mintRequests[_requestId].tempUri = _response;
        // mintRequests[_requestId].fulfilled = true;
        // mintRequestPtrs[requestId] = MintRequestPtr({
        //     mintRequestPtr: _requestId,
        //     fulfilled: false
        // });
    }

    function fulfill2(bytes32 _requestId, bytes32 _response) public recordChainlinkFulfillment(_requestId) {
        // Make sure that the request has not already been fulfilled
        // require(!mintRequestPtrs[_requestId].fulfilled, "Icons: Request has already been fulfilled");

        // Mint the new token
        // bytes32 mintRequestPtr = mintRequestPtrs[_requestId].mintRequestPtr;
        // MintRequest memory mintRequest = mintRequests[mintRequestPtr];

        // bytes memory tokenUri = abi.encodePacked(mintRequest.tempUri, _response);
        // _safeMint(mintRequest.minter, mintRequest.tokenId, tokenUri);
        // tokenUris[mintRequest.tokenId] = string(tokenUri);
        // tokenId++;

        // Update the mint request
        // mintRequestPtrs[_requestId].fulfilled = true;
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