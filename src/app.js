const app = require("express")();
const { createAvatar } = require("@dicebear/avatars");
const style = require("@dicebear/personas");
const ipfsAPI = require("ipfs-api");
const bs58 = require("bs58");
const ethers = require("ethers");

// Initialize IPFS
const ipfs = ipfsAPI("ipfs.infura.io", "5001", { protocol: "https" });

app.get("/generate", async (req, res) => {
    // Get the query params
    const { tokenId } = req.query;

    // Validate the params
    if (typeof tokenId === "undefined") return res.status(400).end();

    // Generate new's NFT
    const svg = createAvatar(style, { seed: tokenId });

    // Add the files to IPFS and record their paths
    let uri = "";
    try {
        const files = await ipfs.files.add(Buffer.from(svg));
        uri = files[0].path.toString();
    } catch (err) {
        return res.status(400).end(err);
    }

    // Encode the URI
    const decoded = bs58.decode(uri);
    // const digest = `0x${decoded.slice(2).toString("hex")}`;
    const digest = decoded.slice(2).toString("hex");

    // Return the uri
    // return res.json({ uri: ethers.utils.hexZeroPad(digest, 32) });
    return res.json({ uri: digest });
});

// Start the server
app.listen(process.env.PORT || 5000, () => {
    console.log("Started server...");
});
