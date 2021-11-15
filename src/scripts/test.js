// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
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

    // Mint a token
    const NUM_TOKENS = 1;
    const minter = await signer.getAddress();
    await icons.earlyMintList(minter, NUM_TOKENS);
    console.log("Added " + minter + " to early mint list");

    const fee = await icons.mintFee();
    await icons.earlyMint(NUM_TOKENS, { value: fee.mul(NUM_TOKENS) });
    // await icons.mint(NUM_TOKENS, { value: fee.mul(NUM_TOKENS) });
    console.log("Minted " + NUM_TOKENS + " tokens");

    // View the minted NFT events
    icons.on("TransferSingle", (operator, from, to, id, value) => {
        console.log(operator, from, to, id, value);
    });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
