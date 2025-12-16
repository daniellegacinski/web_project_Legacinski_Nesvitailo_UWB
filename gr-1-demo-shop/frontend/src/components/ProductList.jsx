
import { useEffect, useMemo, useState } from "react";
import "../App.css";

const API_URL = "http://localhost:5000";

export function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [q, setQ] = useState("");
    const [cart, setCart] = useState({});

    useEffect(() => {
        fetch(`${API_URL}/products`)
            .then((r) => r.json())
            .then((data) => setProducts(Array.isArray(data) ? data : []))
            .catch(() => setProducts([]));
    }, []);

    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return products;
        return products.filter((p) => (p.name || "").toLowerCase().includes(s));
    }, [products, q]);

    const cartItems = useMemo(() => {
        return Object.entries(cart)
            .map(([id, count]) => {
                const p = products.find((x) => String(x.id) === String(id));
                return p ? { ...p, count } : null;
            })
            .filter(Boolean);
    }, [cart, products]);

    const total = useMemo(() => {
        return cartItems.reduce((sum, x) => sum + Number(x.price || 0) * x.count, 0);
    }, [cartItems]);

    const add = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));

    const remove = (id) =>
        setCart((c) => {
            const next = { ...c };
            const v = (next[id] || 0) - 1;
            if (v <= 0) delete next[id];
            else next[id] = v;
            return next;
        });

    return (
        <div className="page">
            <div className="header">
                <div>
                    <div className="title">Pharmacy Demo</div>
                    <div className="subtitle">Demo catalog. Not medical advice.</div>
                </div>

                <input
                    className="search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search..."
                />

                <div className="total">{total.toFixed(2)}</div>
            </div>

            <div className="layout">
                <div className="list">
                    {filtered.map((p) => (
                        <div key={p.id} className="card">
                            <div className="img" dangerouslySetInnerHTML={{ __html: p.image || "" }} />
                            <div className="name">{p.name}</div>
                            <div className="desc">{p.description}</div>
                            <div className="row">
                                <div className="price">{Number(p.price || 0).toFixed(2)}</div>
                                <button className="btn" onClick={() => add(p.id)}>
                                    Add
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart">
                    <div className="cartTitle">Cart</div>

                    {cartItems.length === 0 ? (
                        <div className="muted">Empty</div>
                    ) : (
                        <div className="cartList">
                            {cartItems.map((x) => (
                                <div key={x.id} className="cartRow">
                                    <div>
                                        <div className="cartName">{x.name}</div>
                                        <div className="muted">
                                            {Number(x.price || 0).toFixed(2)} x {x.count}
                                        </div>
                                    </div>
                                    <div className="qty">
                                        <button className="btn2" onClick={() => remove(x.id)}>
                                            -
                                        </button>
                                        <div className="n">{x.count}</div>
                                        <button className="btn2" onClick={() => add(x.id)}>
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button className="btnCheckout" onClick={() => alert("Demo checkout")}>
                                Checkout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
