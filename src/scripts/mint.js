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

    // Contract parameters
    const LINK_ADDRESS = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";

    // Fund the contract with LINK
    const link = new hre.ethers.Contract(LINK_ADDRESS, ERC20ABI.abi, hre.ethers.provider);
    await link.transfer(icons.address, 4e18);

    // Initialize the contract
    const iconsAddress = fs.readFileSync("address.txt", "utf8");
    const icons = new hre.ethers.Contract(iconsAddress, IconsABI.abi, hre.ethers.provider);

    // Mint a token
    const fee = await icons.mintFee();
    await icons.earlyMint(1, { value: fee });

    // View the minted NFT events
    icons.on("TransferSingle", (operator, from, to, id, value) => {
        console.log(operator, from, to, id, value);
    });

    // Withdraw the MATIC and LINK from the contract
    await icons.withdraw();
    await icons.withdrawLink();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
