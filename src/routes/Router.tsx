import {createBrowserRouter } from "react-router-dom";
import LoginComponent from "../components/auth/Login";
import React from "react";
import Home from "../components/Home";
import UsersList from "../components/auth/UsersList";
import DriversList from "../components/drivers/DriversList";

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
        path: 'drivers', 
        element: <DriversList />,
      }
    ],
  },
{
    path: "/login",
    element: <LoginComponent/> ,
  },
]
)

export default routes;