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
    uint256 private immutable MINT_FEE_PER_TOKEN; 
    uint256 private tokenId;

    // Store token mint requests
    mapping(address => uint256) private earlyMinters;
    uint256 private earlyMintEnd;

    struct MintRequest {
        uint256 initialTokenId;
        uint256 amount;
        address minter;
        string uri1;
        string uri2;
        bool fulfilled;
    }
    mapping(bytes32 => MintRequest) private mintRequests;

    constructor(string memory name_, string memory symbol_, uint256 maxTokens_, uint256 mintFeePerToken_, uint256 earlyMintEnd_,
                address oracle_, bytes32 jobId_, uint256 linkFee_, string memory apiUrl_, address linkAddress_) ERC721(name_, symbol_) {
        // Initialize data
        MAX_TOKENS = maxTokens_; 
        MINT_FEE_PER_TOKEN = mintFeePerToken_;
        earlyMintEnd = earlyMintEnd_;

        // Initialize Chainlink data
        setChainlinkToken(linkAddress_);
        oracle = oracle_;
        jobId = jobId_;
        linkFee = linkFee_;
        apiUrl = apiUrl_;
        linkAddress = linkAddress_;
    }
}