const app = require("express")();
const { createAvatar } = require("@dicebear/avatars");
const style = require("@dicebear/personas");
const fs = require("fs");

let svg = createAvatar(style, { seed: 1 });

app.get("/generate", (req, res) => {
    // Get the query params
    const { tokenId, amount } = req.query;

    // Validate the params
    if (typeof tokenId === "undefined" || typeof amount === "undefined") res.status(400).end();

    // Generate a new NFT
});

app.listen(5000 || process.env.PORT, () => {
    console.log("Started server...");
});
