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
    const logs = await hre.ethers.provider.getLogs({
        address: iconsAddress,
        fromBlock: 0,
        toBlock: 1e8,
        topics: [icons.interface.events.Transfer],
    });
    console.log(logs);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
