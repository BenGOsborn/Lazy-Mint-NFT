const hre = require("hardhat");
const IconsABI = require("../artifacts/contracts/Icons.sol/Icons.json");
const fs = require("fs");
const Web3 = require("web3");

// **** Try and reimplement this using Ethers

async function main() {
    // Initialize the contract
    // const signer = hre.ethers.provider.getSigner();
    // const FILENAME = "address.txt";
    // const iconsAddress = fs.readFileSync(FILENAME, "utf8");
    // const icons = new hre.ethers.Contract(iconsAddress, IconsABI.abi, signer);
    // console.log("Initialized Icons contract from " + FILENAME);

    // Connect to web3
    const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc-mumbai.maticvigil.com/"));

    // View the minted NFTs
    console.log("Minted NFT's:\n=============");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
