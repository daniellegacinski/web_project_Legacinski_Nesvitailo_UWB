import React from "react";
import { useShop } from "../context/ShopContext";

export default function Cart() {
    const { cart, setCartQty, removeFromCart, createOrder, creatingOrder, error } = useShop();

    return (
        <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
            <h2 style={{ marginTop: 0 }}>Cart</h2>

            {cart.length === 0 ? (
                <div>Cart is empty. Add products from the list.</div>
            ) : (
                <>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {cart.map((p) => (
                            <div key={p.Id} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600 }}>{p.Name ?? `Product ${p.Id}`}</div>
                                    <div style={{ opacity: 0.7 }}>Id: {p.Id}</div>
                                </div>

                                <input
                                    type="number"
                                    min={1}
                                    value={p.Qty}
                                    onChange={(e) => setCartQty(p.Id, e.target.value)}
                                    style={{ width: 80 }}
                                />

                                <button onClick={() => removeFromCart(p.Id)}>Remove</button>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: 12 }}>
                        <button onClick={createOrder} disabled={creatingOrder}>
                            {creatingOrder ? "Creating..." : "Create order"}
                        </button>
                    </div>
                </>
            )}

            {error ? <div style={{ marginTop: 12, color: "crimson" }}>{error}</div> : null}
        </div>
    );
}
