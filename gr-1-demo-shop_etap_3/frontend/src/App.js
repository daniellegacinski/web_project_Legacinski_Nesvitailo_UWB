import "./App.css";
import { NavLink, Route, Routes, Navigate } from "react-router-dom";
import { ProductsListPage } from "./pages/ProductsListPage";
import { ProductPage } from "./pages/ProductPage";
import { CartPage } from "./pages/CartPage";
import { OrdersPage } from "./pages/OrdersPage";

export default function App() {
    return (
        <div style={{ padding: 16, display: "grid", gap: 16 }}>
            <nav style={{ display: "flex", gap: 12 }}>
                <NavLink to="/products">Products</NavLink>
                <NavLink to="/cart">Cart</NavLink>
                <NavLink to="/orders">Orders</NavLink>
            </nav>

            <Routes>
                <Route path="/" element={<Navigate to="/products" replace />} />
                <Route path="/products" element={<ProductsListPage />} />
                <Route path="/products/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="*" element={<div>Not found</div>} />
            </Routes>
        </div>
    );
}
