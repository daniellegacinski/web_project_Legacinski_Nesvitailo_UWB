import "./App.css";
import { ProductsPage } from "./components/ProductList";
import Cart from "./components/Cart";
import Orders from "./components/Orders";

function App() {
    return (
        <div className="App" style={{ padding: 16, display: "grid", gap: 16 }}>
            <ProductsPage />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Cart />
                <Orders />
            </div>
        </div>
    );
}

export default App;
