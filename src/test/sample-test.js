const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Test", function () {
    let Contract;
    let signer;
    let contract;

    beforeEach(async () => {
        // Deploy the contract
        Contract = await ethers.getContractFactory("Test");
        signer = await ethers.getSigner();
        contract = await Contract.deploy();
    });

    it("Should decode and encode properly", async function () {
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
