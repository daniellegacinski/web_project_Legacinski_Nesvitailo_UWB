const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "db.json");

function readDb() {
    const raw = fs.readFileSync(dbPath, "utf-8");
    const db = JSON.parse(raw);

    if (!Array.isArray(db.products)) db.products = [];
    if (!Array.isArray(db.orders)) db.orders = [];

    return db;
}

function writeDb(db) {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 4), "utf-8");
}

function normalizeStr(v) {
    return String(v ?? "").trim();
}

function toNumberSafe(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
}

function makeId() {
    if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
    return crypto.randomBytes(16).toString("hex");
}

app.get("/", (req, res) => {
    res.send("API is running. Use /products, /orders");
});

app.get("/products", (req, res) => {
    const db = readDb();

    const priceSort = normalizeStr(req.query.price_sort).toLowerCase();
    const nameQuery = normalizeStr(req.query.name).toLowerCase();

    let items = [...db.products];

    if (nameQuery) {
        items = items.filter((p) => String(p.name ?? "").toLowerCase().includes(nameQuery));
    }

    if (priceSort === "asc" || priceSort === "desc") {
        const dir = priceSort === "asc" ? 1 : -1;
        items.sort((a, b) => (toNumberSafe(a.price) - toNumberSafe(b.price)) * dir);
    }

    res.json(items);
});

app.get("/orders", (req, res) => {
    const db = readDb();

    const result = db.orders.map((o) => ({
        id: o.id,
        date: o.date,
        products: (o.products || []).map((p) => {
            const product = db.products.find((x) => String(x.id) === String(p.id)) || null;
            return {
                id: p.id,
                qty: Number(p.qty),
                product
            };
        })
    }));

    res.json(result);
});

function normalizeOrderBody(body) {
    if (!Array.isArray(body)) return null;

    return body.map((x) => ({
        id: x.Id ?? x.id,
        qty: Number(x.Qty ?? x.qty)
    }));
}

function createOrder(req, res) {
    const items = normalizeOrderBody(req.body);
    if (!items) return res.status(400).json({ error: "Body must be an array: [{Id, Qty}] or [{id, qty}]" });
    if (items.length === 0) return res.status(400).json({ error: "Order is empty" });

    const db = readDb();

    for (const it of items) {
        if (it.id === undefined || it.id === null || it.id === "") {
            return res.status(400).json({ error: "Each item must have Id/id" });
        }
        if (!Number.isFinite(it.qty) || it.qty <= 0) {
            return res.status(400).json({ error: `Invalid qty for product id=${it.id}` });
        }

        const exists = db.products.some((p) => String(p.id) === String(it.id));
        if (!exists) return res.status(400).json({ error: `Product not found: ${it.id}` });
    }

    const orderId = makeId();

    db.orders.push({
        id: orderId,
        date: new Date().toISOString(),
        products: items.map((it) => ({ id: it.id, qty: it.qty }))
    });

    writeDb(db);

    res.json({ status: "OK", id: orderId });
}

app.post("/order", createOrder);
app.post("/orders", createOrder);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
