import React from "react";
import { useShop } from "../context/ShopContext";

export default function Orders() {
    const { orders, loadingOrders, fetchOrders, error } = useShop();

    return (
        <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <h2 style={{ margin: 0 }}>Orders</h2>
                <button onClick={fetchOrders} disabled={loadingOrders}>
                    {loadingOrders ? "Loading..." : "Refresh"}
                </button>
            </div>

            {loadingOrders ? (
                <div style={{ marginTop: 12 }}>Loading...</div>
            ) : orders.length === 0 ? (
                <div style={{ marginTop: 12 }}>No orders</div>
            ) : (
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
                    {orders.map((o) => (
                        <div key={o.id} style={{ border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
                            <div style={{ fontWeight: 700 }}>Order: {o.id}</div>
                            <div style={{ opacity: 0.7 }}>Date: {String(o.date)}</div>

                            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                                {(o.products ?? []).map((p) => (
                                    <div key={`${o.id}-${p.id}`} style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div>
                                            {p.product?.Name ?? p.product?.name ?? `Product ${p.id}`} (id: {p.id})
                                        </div>
                                        <div>qty: {p.qty}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {error ? <div style={{ marginTop: 12, color: "crimson" }}>{error}</div> : null}
        </div>
    );
}
