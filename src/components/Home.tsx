import React, { useState } from "react";
import Sidebar from "./common/SideBar";
import Navbar from "./common/ToolBar";
import { Route, Routes } from "react-router-dom";
import UsersList from "./auth/UsersList";
import CustomerList from "./customer/CustomerList";
import DriversList from "./drivers/DriversList";
import StoresList from "./store/StoresList";
import SupplierList from "./supplier/SupplierList";
import ProductList from "./product/ProductList";
import DeclarationList from "./declaration/DeclarationList";
import PurchaseList from "./purchase/PurchaseList";
import DeclarationDetail from "./declaration/DeclarationDetail";
import PurchaseDetail from "./purchase/purchaseDetail";
import SalesList from "./sales/SalesList";
import SaleDetail from "./sales/SaleDetail";
import InventoryList from "./inventory/InventoryList";
import CashOfAccountList from "./cash-of-account/CashOfAccountList";
import CATransactionsList from "./ca-transaction/CATransactionsList";
import DashboardHome from "./dashboard/DashboardHome";
import { CssBaseline, styled } from "@mui/material";
import PermissionList from "./auth/PermissionList";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  marginTop: "78px",
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const Home = () => {
  const [showDrawer, setShowDrawer] = useState(true);

  return (
    <div style={{ display: "flex" }}>
      <CssBaseline />
      <Navbar showDrawer={showDrawer} setShowDrawer={setShowDrawer} />
      <Sidebar showDrawer={showDrawer} setShowDrawer={setShowDrawer} />
      <Main open={showDrawer}>
        <Routes>
          <Route path="/users" element={<UsersList />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/drivers" element={<DriversList />} />
          <Route path="/stores" element={<StoresList />} />
          <Route path="/suppliers" element={<SupplierList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/declarations" element={<DeclarationList />} />
          <Route path="/declarations/:id" element={<DeclarationDetail />} />
          <Route path="/purchases" element={<PurchaseList />} />
          <Route path="/purchases/:id" element={<PurchaseDetail />} />
          <Route path="/sales" element={<SalesList />} />
          <Route path="/sales/:id" element={<SaleDetail />} />
          <Route path="/inventory" element={<InventoryList />} />
          <Route path="/ca-transactions" element={<CATransactionsList />} />
          <Route path="/cash-of-accounts" element={<CashOfAccountList />} />
          <Route path="/" element={<DashboardHome />} />
          <Route path="/permissions/:id" element={<PermissionList />} />
        </Routes>
      </Main>
    </div>
  );
};

export default Home;
