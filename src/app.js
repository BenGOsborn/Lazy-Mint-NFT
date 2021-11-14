const app = require("express")();
const { createAvatar } = require("@dicebear/avatars");
const style = require("@dicebear/personas");

app.get("/generate", (req, res) => {
    // Get the query params
    const { tokenId, amount } = req.query;

    // Validate the params
    if (typeof tokenId === "undefined" || typeof amount === "undefined") return res.status(400).end();

    // Generate new's NFT
    for (let i = 0; i < amount; i++) {
        const svg = createAvatar(style, { seed: 1 });
        let buffer = Buffer.from(svg);
    }
});

app.listen(5000 || process.env.PORT, () => {
    console.log("Started server...");
});
