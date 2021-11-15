// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const ERC20Abi = require("@openzeppelin/contracts/build/contracts/ERC20.json");

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
    const link = new hre.ethers.Contract(LINK_ADDRESS, ERC20Abi, hre.ethers.provider);
    await link.transfer(icons.address, 4e18);

    // Mint a token
    // **** Code goes here

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
