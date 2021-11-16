const hre = require("hardhat");
const IconsABI = require("../artifacts/contracts/APIConsumer.sol/APIConsumer.json");
const fs = require("fs");

async function main() {
    // Initialize the signer
    const signer = hre.ethers.provider.getSigner();

    // Initialize the contract
    const FILENAME = "address.txt";
    const iconsAddress = fs.readFileSync(FILENAME, "utf8");
    const icons = new hre.ethers.Contract(iconsAddress, IconsABI.abi, signer);
    console.log("Initialized Icons contract from " + FILENAME);

    // Request volume data
    // await icons.requestData();

    // https://ethereum.stackexchange.com/questions/17094/how-to-store-ipfs-hash-using-bytes32
    // https://github.com/saurfang/ipfs-multihash-on-solidity/blob/master/contracts/IPFSStorage.sol
    // https://github.com/MrChico/verifyIPFS/blob/master/contracts/verifyIPFS.sol#L28

    // View the volume data
    const dataRaw = await icons.getData();
    const dataString = await icons.getDataString();
    console.log(dataRaw);
    console.log(dataString);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
