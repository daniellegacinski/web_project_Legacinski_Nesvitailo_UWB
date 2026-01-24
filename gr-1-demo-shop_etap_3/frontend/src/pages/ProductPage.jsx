import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useShop } from "../context/ShopContext";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export function ProductPage() {
    const { id } = useParams();
    const { addToCart } = useShop();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        setError("");

        fetch(`${API_BASE}/products`)
            .then((r) => {
                if (!r.ok) throw new Error(`GET /products failed (${r.status})`);
                return r.json();
            })
            .then((data) => setProducts(Array.isArray(data) ? data : []))
            .catch((e) => {
                setError(String(e?.message ?? e));
                setProducts([]);
            })
            .finally(() => setLoading(false));
    }, [id]);

    const product = useMemo(() => {
        return products.find((p) => String(p.id) === String(id)) || null;
    }, [products, id]);

    if (loading) return <div style={{ padding: 16 }}>Loading...</div>;
    if (error) return <div style={{ padding: 16, color: "crimson" }}>{error}</div>;

    if (!product) {
        return (
            <div style={{ padding: 16 }}>
                <div style={{ marginBottom: 12 }}>
                    <Link to="/products">Back to products</Link>
                </div>
                <div>Product not found</div>
            </div>
        );
    }

    return (
        <div style={{ padding: 16, display: "grid", gap: 12 }}>
            <div>
                <Link to="/products">Back to products</Link>
            </div>

            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ width: 120, height: 120 }} dangerouslySetInnerHTML={{ __html: product.image || "" }} />
                <div style={{ display: "grid", gap: 6 }}>
                    <h2 style={{ margin: 0 }}>{product.name}</h2>
                    <div style={{ opacity: 0.75 }}>{product.description}</div>
                    <div style={{ fontWeight: 700 }}>${Number(product.price || 0).toFixed(2)}</div>
                    <div>
                        <button onClick={() => addToCart(product, 1)}>Add to cart</button>
                    </div>
                </div>
            </div>
        </div>
    );
}