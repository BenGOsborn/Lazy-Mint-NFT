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
    const svgArr = [];
    for (let i = 0; i < amount; i++) {
        console.log(tokenId + i);
        const svg = createAvatar(style, { seed: tokenId + i });
        svgArr.push(Buffer.from(svg));
    }

    // Add the files to IPFS
    let uri = "";
    ipfs.files.add(svgArr, (err, files) => {
        if (err) {
            return res.status(400).send(err);
        }
        for (const file of files) {
            const temp = `https://ipfs.io/ipfs/${file.path} `;
            uri += temp;
            console.log(temp);
        }
    });

    // Return the uri
    return res.send(uri);
});

app.listen(5000 || process.env.PORT, () => {
    console.log("Started server...");
});
