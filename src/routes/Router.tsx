import { createBrowserRouter } from "react-router-dom";
import LoginComponent from "../components/auth/Login";
import React from "react";
import Home from "../components/Home";
import UsersList from "../components/auth/UsersList";
import CustomerList from "../components/sales/customer/CustomerList";
import DriversList from "../components/drivers/DriversList";
import StoresList from "../components/store/StoresList";
import SupplierList from "../components/supplier/SupplierList";
import ProductList from "../components/product/ProductList";
import DeclarationList from "../components/declaration/DeclarationList";
import PurchaseList from "../components/purchase/PurchaseList";
import DeclarationDetail from "../components/declaration/DeclarationDetail";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
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
    ],
  },
  {
    path: "/login",
    element: <LoginComponent />,
  },
]);

export default routes;
