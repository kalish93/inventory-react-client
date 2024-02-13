import {createBrowserRouter } from "react-router-dom";
import LoginComponent from "../components/auth/Login";
import React from "react";
import Home from "../components/Home";
import UsersList from "../components/auth/UsersList";
import CustomerList from "../components/sales/customer/CustomerList";

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Home/> , 
    children: [
      { 
        path: 'users',
        element: <UsersList/>,
      },
      { 
        path: 'customers',
        element: <CustomerList/>,
      },
    ],
  },
{
    path: "/login",
    element: <LoginComponent/> ,
  },
]
)

export default routes;