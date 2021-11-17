const hre = require("hardhat");
const IconsABI = require("../artifacts/contracts/Icons.sol/Icons.json");
const fs = require("fs");

async function main() {
    // Initialize the signer
    const signer = hre.ethers.provider.getSigner();

    // Initialize the contract
    const FILENAME = "address.txt";
    const iconsAddress = fs.readFileSync(FILENAME, "utf8");
    const icons = new hre.ethers.Contract(iconsAddress, IconsABI.abi, signer);
    console.log("Initialized Icons contract from " + FILENAME);

    // Mint a token
    const minter = await signer.getAddress();
    await icons.addEarlyMinter(minter);
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

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
