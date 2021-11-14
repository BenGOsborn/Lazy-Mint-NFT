const app = require("express")();
const { createAvatar } = require("@dicebear/avatars");
const style = require("@dicebear/personas");
const ipfsAPI = require("ipfs-api");

// Initialize IPFS
const ipfs = ipfsAPI("ipfs.infura.io", "5001", { protocol: "https" });

app.get("/generate", async (req, res) => {
    // Get the query params
    const { tokenId, amount } = req.query;

    // Validate the params
    if (typeof tokenId === "undefined" || typeof amount === "undefined") return res.status(400).end();

    // Generate new's NFT
    const svgArr = [];
    for (let i = 0; i < amount; i++) {
        const svg = createAvatar(style, { seed: tokenId + i });
        svgArr.push(Buffer.from(svg));
    }

    // Add the files to IPFS and record their paths
    let uri = "";
    const { err, files } = await ipfs.files.add(svgArr);
    if (err) return res.status(400).end(err);
    for (const file of files) {
        uri += `https://ipfs.io/ipfs/${file.path} `;
    }

    // Return the uri
    return res.send(uri);
});

app.listen(5000 || process.env.PORT, () => {
    console.log("Started server...");
});
