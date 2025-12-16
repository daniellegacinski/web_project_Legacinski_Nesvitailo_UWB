const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "db.json");

function readDb() {
    const raw = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(raw);
}

app.get("/", (req, res) => {
    res.send("API is running. Use /products");
});

app.get("/products", (req, res) => {
    const db = readDb();
    res.json(db.products || []);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`));
