import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

let whitelist: string[] = [];

if (fs.existsSync("whitelist.json")) {
    whitelist = JSON.parse(fs.readFileSync("whitelist.json", "utf8"));
}

app.post("/webhook", (req, res) => {
    const { action, robloxId } = req.body;
    if (!robloxId) return res.sendStatus(400);

    if (action === "whitelist" && !whitelist.includes(robloxId)) {
        whitelist.push(robloxId);
    }

    if (action === "unwhitelist") {
        whitelist = whitelist.filter(id => id !== robloxId);
    }

    fs.writeFileSync("whitelist.json", JSON.stringify(whitelist, null, 2));
    res.sendStatus(200);
});

app.get("/webhook/list", (_, res) => {
    res.json(whitelist);
});

app.listen(3000, () => console.log("Webhook running on 3000"));
