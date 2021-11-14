const { expect } = require("chai");
const { ethers } = require("hardhat");

// Constructor data

describe("Icons", function () {
    it("Should deploy the contract", async function () {
        // Initialize the contract
        const Icons = await ethers.getContractFactory("Icons");
        const icons = await Greeter.deploy("");
        await icons.deployed();

        expect(await greeter.greet()).to.equal("Hello, world!");

        const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

        // wait until the transaction is mined
        await setGreetingTx.wait();

        expect(await greeter.greet()).to.equal("Hola, mundo!");
    });
});
