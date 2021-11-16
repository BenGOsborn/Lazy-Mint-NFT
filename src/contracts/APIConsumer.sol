// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./lib/verifyIPFS.sol";

contract APIConsumer is ChainlinkClient {
    using Chainlink for Chainlink.Request;
  
    // uint256 public volume;
    bytes32 private response1;
    bytes32 private response2;
    bytes32 private prefix;
    
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    address private linkAddress;
    
    constructor(bytes32 prefix_) {
        prefix = prefix_;

        linkAddress = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
        setChainlinkToken(linkAddress);
        oracle = 0xc8D925525CA8759812d0c299B90247917d4d4b7C;
        jobId = "a7330d0b4b964c05abc66a26307047c0";
        fee = 0.01 * 10 ** 18; // (Varies by network and job)
    }
    
    function requestData() public returns (bytes32 requestId) 
    {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        
        request.add("get", "https://lazy-nft.herokuapp.com/generate?tokenId=3");
        request.add("path", "chunks.0");
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    function fulfill(bytes32 _requestId, bytes32 _response) public recordChainlinkFulfillment(_requestId) returns (bytes32 requestId)
    {
        response1 = _response;
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.end.selector);
        request.add("get", "https://lazy-nft.herokuapp.com/generate?tokenId=3");
        request.add("path", "chunks.1");
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    function end(bytes32 _requestId, bytes32 _response) public recordChainlinkFulfillment(_requestId) {
        response2 = _response;
    }

    // function withdrawLink() external {} - Implement a withdraw function to avoid locking your LINK in the contract
    function withdrawLink() external {
        // Withdraw the balance of LINK to the sender
        uint256 balance = IERC20(linkAddress).balanceOf(address(this));
        IERC20(linkAddress).transfer(msg.sender, balance);
    }

    function getData() external view returns (bytes32, bytes32) {
        return (response1, response2);
    }

    function getDataString() external view returns (string memory) {
        return string(abi.encodePacked(response1, response2));
    }
}