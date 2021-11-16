// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./lib/verifyIPFS.sol";

contract Test {
    function storeData(bytes32 _data) external returns (string memory ipfsHash) {
        bytes memory encoded = verifyIPFS.toBase58(abi.encodePacked(_data));
        ipfsHash = string(abi.encodePacked("Qm", encoded));
    }
}