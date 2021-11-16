const app = require("express")();
const { createAvatar } = require("@dicebear/avatars");
const style = require("@dicebear/personas");
const ipfsAPI = require("ipfs-api");

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

    // Break the URI up into different parts
    const chunks = [];
    const CHUNK_SIZE = 32;
    for (let i = 0; i < Math.floor((uri.length - 1) / CHUNK_SIZE) + 1; i++) {
        chunks.push(uri.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE));
    }

    // Return the URI chunks
    return res.json({ chunks, uri });
});

// Start the server
app.listen(process.env.PORT || 5000, () => {
    console.log("Started server...");
});
