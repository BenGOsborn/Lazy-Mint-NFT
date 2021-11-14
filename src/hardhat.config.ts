import { HardhatUserConfig } from "hardhat/types";

import "@nomiclabs/hardhat-waffle";
import "hardhat-typechain";

import dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY as string;

const config: HardhatUserConfig = {
    defaultNetwork: "matic",
    networks: {
        hardhat: {},
        matic: {
            url: "https://polygon-rpc.com/",
            accounts: [PRIVATE_KEY],
        },
        maticMumbai: {
            url: "https://rpc-mumbai.maticvigil.com/",
            accounts: [PRIVATE_KEY],
        },
    },
    solidity: {
        compilers: [{ version: "0.8.0", settings: { optimizer: { enabled: true, runs: 200 } } }],
    },
};
export default config;
