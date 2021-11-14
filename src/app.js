const app = require("express")();
const { createAvatar } = require("@dicebear/avatars");
const style = require("@dicebear/personas");
const ipfsAPI = require("ipfs-api");

// Initialize IPFS
const ipfs = ipfsAPI("ipfs.infura.io", "5001", { protocol: "https" });

app.get("/generate", (req, res) => {
    // Get the query params
    const { tokenId, amount } = req.query;

    // Validate the params
    if (typeof tokenId === "undefined" || typeof amount === "undefined") return res.status(400).end();

    // Generate new's NFT
    let uri = "";
    for (let i = 0; i < amount; i++) {
        const svg = createAvatar(style, { seed: parseInt(tokenId) + i });
        let buffer = Buffer.from(svg);
        ipfs.files.add(buffer, (err, file) => {
            if (err) {
                return res.status(400).send(err);
            }
            uri += file + " ";
        });
    }

    // Return the uri
    return res.send(uri);
});

app.listen(5000 || process.env.PORT, () => {
    console.log("Started server...");
});
