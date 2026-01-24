import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const ShopContext = createContext(null);

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export function ShopProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [creatingOrder, setCreatingOrder] = useState(false);
    const [error, setError] = useState("");

    const fetchOrders = useCallback(async () => {
        setLoadingOrders(true);
        setError("");
        try {
            const r = await fetch(`${API_BASE}/orders`);
            if (!r.ok) throw new Error(`GET /orders failed (${r.status})`);
            const data = await r.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(String(e?.message ?? e));
        } finally {
            setLoadingOrders(false);
        }
    }, []);

    const addToCart = useCallback((product, qty = 1) => {
        const id = product.Id ?? product.id;
        const name = product.Name ?? product.name ?? `Product ${id}`;

        setCart((prev) => {
            const i = prev.findIndex((x) => String(x.Id) === String(id));
            if (i >= 0) {
                const copy = [...prev];
                copy[i] = { ...copy[i], Qty: Number(copy[i].Qty) + Number(qty) };
                return copy;
            }
            return [...prev, { Id: id, Name: name, Qty: Number(qty) }];
        });
    }, []);

    const setCartQty = useCallback((id, qty) => {
        setCart((prev) =>
            prev
                .map((x) => (String(x.Id) === String(id) ? { ...x, Qty: Number(qty) } : x))
                .filter((x) => Number(x.Qty) > 0)
        );
    }, []);

    const removeFromCart = useCallback((id) => {
        setCart((prev) => prev.filter((x) => String(x.Id) !== String(id)));
    }, []);

    const clearCart = useCallback(() => setCart([]), []);

    const createOrder = useCallback(async () => {
        if (cart.length === 0) return;

        setCreatingOrder(true);
        setError("");
        try {
            const payload = cart.map((p) => ({ Id: p.Id, Qty: Number(p.Qty) }));

            const r = await fetch(`${API_BASE}/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!r.ok) {
                const err = await r.json().catch(() => ({}));
                throw new Error(err?.error ?? `POST /orders failed (${r.status})`);
            }

            clearCart();
            await fetchOrders();
        } catch (e) {
            setError(String(e?.message ?? e));
        } finally {
            setCreatingOrder(false);
        }
    }, [cart, clearCart, fetchOrders]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const value = useMemo(
        () => ({
            cart,
            orders,
            loadingOrders,
            creatingOrder,
            error,
            addToCart,
            setCartQty,
            removeFromCart,
            clearCart,
            fetchOrders,
            createOrder
        }),
        [cart, orders, loadingOrders, creatingOrder, error, addToCart, setCartQty, removeFromCart, clearCart, fetchOrders, createOrder]
    );

    return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
    const ctx = useContext(ShopContext);
    if (!ctx) throw new Error("ShopProvider missing");
    return ctx;
}
