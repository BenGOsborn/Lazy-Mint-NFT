// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./lib/verifyIPFS.sol";

contract Test {
    function encodeData(bytes32 _data, bytes32 _prefix) external view returns (string memory ipfsHash) {
        bytes memory encoded = verifyIPFS.toBase58(abi.encodePacked(_prefix, _data));
        ipfsHash = string(abi.encodePacked(encoded));
    }
}