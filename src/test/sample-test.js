const { expect } = require("chai");
const { ethers } = require("hardhat");
const bs58 = require("bs58");

describe("Test", function () {
    let Contract;
    let signer;
    let contract;

    const uri = "QmcPYGnhRrumj8WGSRMm9j1yaH8p2n1rYgTJeu4hyxBADA";

    beforeEach(async () => {
        // Deploy the contract
        Contract = await ethers.getContractFactory("Test");
        signer = await ethers.getSigner();
        contract = await Contract.deploy();
        await contract.deployed();
    });

    it("Should decode and encode properly", async function () {
        // Decode the data
        const decoded = bs58.decode(uri);
        const digest = `0x${decoded.slice(2).toString("hex")}`;
        const prefix = `0x${decoded.slice(0, 2).toString("hex")}`;

        // Reencode it
        let data = await contract.encodeData(digest, prefix);
        console.log(data);

        // **** All I really have to do is store those bytes, and then add them on
        // **** How do I convert hex to a string manually ?

        // const Greeter = await ethers.getContractFactory("Greeter");
        // const greeter = await Greeter.deploy("Hello, world!");
        // await greeter.deployed();
        // expect(await greeter.greet()).to.equal("Hello, world!");
        // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");
        // // wait until the transaction is mined
        // await setGreetingTx.wait();
        // expect(await greeter.greet()).to.equal("Hola, mundo!");
    });
});
