const hre = require("hardhat");
const IconsABI = require("../artifacts/contracts/Icons.sol/Icons.json");
const fs = require("fs");

async function main() {
    // Initialize the contract
    const signer = hre.ethers.provider.getSigner();
    const FILENAME = "address.txt";
    const iconsAddress = fs.readFileSync(FILENAME, "utf8");
    const icons = new hre.ethers.Contract(iconsAddress, IconsABI.abi, signer);
    console.log("Initialized Icons contract from " + FILENAME);

    // View the minted NFTs
    console.log("Minted NFT's:\n=============");
    const logs = await hre.ethers.provider.getLogs();
    console.log(logs);
    // icons.on("Transfer", (from, to, tokenId) => {
    //     console.log(from, to, tokenId);

    //     // **** Also log the metadata of the tokens
    // });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
