require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
    solidity: "0.8.4",
    networks: {
        hardhat: {},
        maticMumbai: {
            url: "https://rpc-mumbai.maticvigil.com/",
            accounts: [PRIVATE_KEY],
        },
    },
    solidity: {
        compilers: [{ version: "0.8.7", settings: { optimizer: { enabled: true, runs: 200 } } }],
    },
};
