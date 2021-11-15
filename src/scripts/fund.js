// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const ERC20ABI = require("@openzeppelin/contracts/build/contracts/ERC20.json");
const IconsABI = require("../artifacts/contracts/Icons.sol/Icons.json");
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

    // Fund the contract with LINK
    const LINK_ADDRESS = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
    const link = new hre.ethers.Contract(LINK_ADDRESS, ERC20ABI.abi, signer);
    await link.transfer(icons.address, (2e18).toString());
    console.log("Initialized LINK contract and sent LINK tokens");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
