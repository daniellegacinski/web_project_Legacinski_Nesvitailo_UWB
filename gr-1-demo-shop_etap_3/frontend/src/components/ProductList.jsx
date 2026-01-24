import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export function ProductsPage() {
    const { addToCart } = useShop();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [searchName, setSearchName] = useState("");
    const [priceSort, setPriceSort] = useState("");

    const queryString = useMemo(() => {
        const params = new URLSearchParams();
        if (priceSort) params.set("price_sort", priceSort);
        if (searchName.trim()) params.set("name", searchName.trim());
        const qs = params.toString();
        return qs ? `?${qs}` : "";
    }, [priceSort, searchName]);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const r = await fetch(`${API_BASE}/products${queryString}`);
            if (!r.ok) throw new Error(`GET /products failed (${r.status})`);
            const data = await r.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(String(e?.message ?? e));
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [queryString]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <div style={{ padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <h2 style={{ margin: 0 }}>Products</h2>
                <button onClick={fetchProducts} disabled={loading}>
                    {loading ? "Loading..." : "Refresh"}
                </button>
            </div>

            <div
                style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    padding: 12,
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    marginBottom: 16,
                    flexWrap: "wrap"
                }}
            >
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    style={{ width: 260 }}
                />

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ opacity: 0.75 }}>Sort by price:</span>

                    <button onClick={() => setPriceSort("asc")} disabled={priceSort === "asc"}>
                        Asc
                    </button>

                    <button onClick={() => setPriceSort("desc")} disabled={priceSort === "desc"}>
                        Desc
                    </button>

                    <button
                        onClick={() => {
                            setSearchName("");
                            setPriceSort("");
                        }}
                    >
                        Clear
                    </button>
                </div>
            </div>

            {error ? <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div> : null}

            {loading ? (
                <div>Loading...</div>
            ) : products.length === 0 ? (
                <div>No products</div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
                    {products.map((p) => (
                        <div key={p.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 12 }}>
                            <div style={{ display: "flex", gap: 12 }}>
                                <div style={{ width: 72, height: 72 }} dangerouslySetInnerHTML={{ __html: p.image || "" }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700 }}>
                                        <Link to={`/products/${p.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                                            {p.name}
                                        </Link>
                                    </div>
                                    <div style={{ opacity: 0.75, fontSize: 13 }}>{p.description}</div>
                                    <div style={{ marginTop: 8, fontWeight: 700 }}>${Number(p.price).toFixed(2)}</div>
                                </div>
                            </div>

                            <div style={{ marginTop: 10 }}>
                                <button onClick={() => addToCart(p, 1)}>Add to cart</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
