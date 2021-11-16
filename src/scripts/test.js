// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const IconsABI = require("../artifacts/contracts/APIConsumer.sol/APIConsumer.json");
const fs = require("fs");

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');

    // Initialize the signer
    const signer = hre.ethers.provider.getSigner();

    // Initialize the contract
    const FILENAME = "address.txt";
    const iconsAddress = fs.readFileSync(FILENAME, "utf8");
    const icons = new hre.ethers.Contract(iconsAddress, IconsABI.abi, signer);
    console.log("Initialized Icons contract from " + FILENAME);

    // Request volume data
    await icons.requestData();

    // https://ethereum.stackexchange.com/questions/17094/how-to-store-ipfs-hash-using-bytes32
    // https://github.com/saurfang/ipfs-multihash-on-solidity/blob/master/contracts/IPFSStorage.sol
    // https://github.com/MrChico/verifyIPFS/blob/master/contracts/verifyIPFS.sol#L28

    // **** The first 2 bytes are NOT necessary to store !

    // View the volume data
    // const data = await icons.getData();
    // const data = await icons.getParsedData();
    const data = await icons.getDataString();
    console.log(data);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
