import { createBrowserRouter } from "react-router-dom";
import LoginComponent from "../components/auth/Login";
import React from "react";
import Home from "../components/Home";
import UsersList from "../components/auth/UsersList";
import CustomerList from "../components/customer/CustomerList";
import DriversList from "../components/drivers/DriversList";
import StoresList from "../components/store/StoresList";
import SupplierList from "../components/supplier/SupplierList";
import ProductList from "../components/product/ProductList";
import DeclarationList from "../components/declaration/DeclarationList";
import PurchaseList from "../components/purchase/PurchaseList";
import DeclarationDetail from "../components/declaration/DeclarationDetail";
import PurchaseDetail from "../components/purchase/purchaseDetail";
import SalesList from "../components/sales/SalesList";
import SaleDetail from "../components/sales/SaleDetail";
import InventoryList from "../components/inventory/InventoryList";
import CashOfAccountList from "../components/cash-of-account/CashOfAccountList";
import CATransactionsList from "../components/ca-transaction/CATransactionsList";
import DashboardHome from "../components/dashboard/DashboardHome";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "",
        element: <DashboardHome />,
      },
      {
        path: "users",
        element: <UsersList />,
      },
      {
        path: "customers",
        element: <CustomerList />,
      },
      {
        path: "drivers",
        element: <DriversList />,
      },
      { 
        path: "stores", 
        element: <StoresList /> 
      },
      { 
        path: "suppliers",
        element: <SupplierList /> 
      },
      { 
        path: "products",
        element: <ProductList /> 
      },
      { 
        path: "declarations",
        element: <DeclarationList /> 
      },
      { 
        path: "declarations/:id",
        element: <DeclarationDetail /> 
      },
      { 
        path: "purchases",
        element: <PurchaseList /> 
      },
      { 
        path: "purchases/:id",
        element: <PurchaseDetail /> 
      },
      { 
        path: "sales",
        element: <SalesList /> 
      },
      { 
        path: "sales/:id",
        element: <SaleDetail /> 
      },
      { 
        path: "inventory",
        element: <InventoryList /> 
      },
      { 
        path: "cash-of-accounts",
        element: <CashOfAccountList /> 
      },
      {
        path: "ca-transactions",
        element: <CATransactionsList />,
      }
    ],
  },
  {
    path: "/login",
    element: <LoginComponent />,
  },
]);

export default routes;
