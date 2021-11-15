// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');

    // Contract parameters
    const MINT_FEE_PER_TOKEN = 10;
    const MAX_TOKENS = 1000;
    const URI = "";
    const EARLY_MINT_END = Math.floor((Date.now() + 3.6e6) / 1000);
    const ORACLE = "";
    const JOB_ID = "";
    const LINK_FEE = "";
    const API_URL = "";
    const LINK_ADDRESS = "";

    // Compile and deploy the contract
    await hre.run("compile");
    const Icons = await hre.ethers.getContractFactory("Icons");

    const icons = await Greeter.deploy("Hello, Hardhat!");
    await icons.deployed();

    console.log("Contract deployed to:", icons.address);

    // Fund the contract with LINK
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
