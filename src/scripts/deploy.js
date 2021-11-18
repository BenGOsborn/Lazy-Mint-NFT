const hre = require("hardhat");
const fs = require("fs");
const bs58 = require("bs58");
const ERC20ABI = require("@openzeppelin/contracts/build/contracts/ERC20.json");

async function main() {
    // Contract parameters (Polygon Mumbai Testnet)
    const NAME = "Icons";
    const SYMBOL = "ICON";
    const MAX_TOKENS = 1000;
    const MINT_FEE = 10;
    const EARLY_MINT_END = Math.floor((Date.now() + 3.6e6) / 1000);
    const ORACLE = "0xc8D925525CA8759812d0c299B90247917d4d4b7C";
    const JOB_ID = "0xa7330d0b4b964c05abc66a26307047c0";
    const LINK_FEE = (0.01e18).toString();
    const API_URL = "https://lazy-nft.herokuapp.com/generate";
    const LINK_ADDRESS = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";

    // Compile and deploy the contract
    await hre.run("compile");
    const Icons = await hre.ethers.getContractFactory("Icons");
    const icons = await Icons.deploy(NAME, SYMBOL, MAX_TOKENS, MINT_FEE, EARLY_MINT_END, ORACLE, JOB_ID, LINK_FEE, API_URL, LINK_ADDRESS);
    await icons.deployed();
    console.log(`Deployed contract https://mumbai.polygonscan.com/address/${icons.address}`);

    // Save the address to a file
    const FILENAME = "address.txt";
    fs.writeFileSync(FILENAME, icons.address);
    console.log("Saved address to " + FILENAME);

    // Fund the contract with LINK
    const signer = hre.ethers.provider.getSigner();
    const link = new hre.ethers.Contract(LINK_ADDRESS, ERC20ABI.abi, signer);
    await link.transfer(icons.address, (1e18).toString());
    console.log("Initialized LINK contract and sent LINK tokens");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
