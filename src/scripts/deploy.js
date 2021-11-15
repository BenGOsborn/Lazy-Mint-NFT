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
    uint256 mintFeePerToken_, uint256 maxTokens_, string memory uri_, uint256 earlyMintEnd_,
                address oracle_, bytes32 jobId_, uint256 linkFee_, bytes32 apiUrl_, address linkAddress_) ERC1155(uri_) {

    // Compile and deploy the contract
    await hre.run("compile");
    const Icons = await hre.ethers.getContractFactory("Icons");

    const icons = await Greeter.deploy("Hello, Hardhat!");
    await icons.deployed();

    console.log("Contract deployed to:", icons.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
