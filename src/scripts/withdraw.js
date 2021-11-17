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

    // Withdraw the MATIC and LINK from the contract
    await icons.withdraw();
    await icons.withdrawLink();
    console.log("Withdrew tokens from contract");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
