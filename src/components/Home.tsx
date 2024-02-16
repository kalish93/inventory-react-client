import React from "react"
import Sidebar from "./common/SideBar"
import Navbar from "./common/ToolBar";
import { Route, Routes } from "react-router-dom";
import UsersList from "./auth/UsersList";
import CustomerList from "./sales/customer/CustomerList";
import DriversList from "./drivers/DriversList";
import StoresList from "./store/StoresList";
import SupplierList from "./supplier/SupplierList";
import ProductList from "./product/ProductList";
import DeclarationList from "./declaration/DeclarationList";


const Home = () => {
    return (
        <div style={{ display: 'flex' }}>
            <Navbar />
            <Sidebar />
            <main style={{ flexGrow: 1, margin: '100px 50px 0 0' }}>
            <Routes>
                <Route path="/users" element={<UsersList />} />
                <Route path="/customers" element={<CustomerList />} />
                <Route path="/drivers" element={<DriversList />} />
                <Route path="/stores" element={<StoresList />} />
                <Route path="/suppliers" element={<SupplierList />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/declarations" element={<DeclarationList />} />
            </Routes>
            </main>
        </div>
    );
}

export default Home;