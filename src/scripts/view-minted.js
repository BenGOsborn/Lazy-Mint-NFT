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
        topics: [hre.ethers.utils.id("Transfer(address, address, uint256)"), null, hre.ethers.utils.hexZeroPad(await signer.getAddress(), 32)],
    });
    console.log(logs);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
