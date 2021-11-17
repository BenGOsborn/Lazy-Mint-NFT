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

    // Add the minter to the early mint list (NOT STRICTLY NECESSARY IF THE OWNER OR THE EARLY MINT PERIOD HAS ENDED)
    const minter = await signer.getAddress();
    await icons.addEarlyMinter(minter);
    console.log("Added " + minter + " to early mint list");

    // Mint a token
    const fee = await icons.getMintFee();
    // await icons.earlyMint({ value: fee }); // If early mint period has ended, comment this line and uncomment the next line
    await icons.requestData(); // If early mint period has ended, comment this line and uncomment the next line
    // await icons.mint(NUM_TOKENS, { value: fee.mul(NUM_TOKENS) });
    console.log("Minted token");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
