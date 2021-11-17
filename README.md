# [Lazy Mint NFT](https://mumbai.polygonscan.com/address/0xfFcd0Af040fed0fB118356facAE520Dde4D94A82)

## A lazy minting script that is able to mint new NFT's and upload them to IPFS at the time of the function call using Chainlink.

### Description

Typically when minting an NFT, you are required to mint all of the NFT's yourself, which can be extremely expensive in gas fees. An alternative to this solution is making a 'lazy mint' where the user mints the NFT from the contract, however you still need some way of attaching the URI to that NFT, and typically this requires non-decentralized data storage or provides the ability for your users to upload their own URI's to the contract which you may not want.

This repository provides a 'lazy minting' solution where the user mints the NFT and thus pays for the gas fee, but the URI is created on chain in addition to your own private API. This way, you are in FULL control of the URI's that get uploaded to your contract, as well as avoiding the expensive and time consuming upfront minting. Simply fund the contract with LINK and away you go.

### Requirements

-   Node==v10.19.0
-   NPM=6.14.4

### Instructions

1. Make a new `.env` file in `src` and inside of it specify your Private Key `PRIVATE_KEY=`
2. Fund your wallet with test [LINK](https://faucets.chain.link/mumbai) and test [MATIC](https://faucet.polygon.technology/) for the Polygon Matic Mumbai network
3. Run `npm install`
4. To deploy the contract and fund it with LINK run `npm run deploy`, to mint a new NFT run `npm run mint`, to view the minted NFT run `npm run view-minted`, and to withdraw LINK and MATIC from the contract run `npm run withdraw`
