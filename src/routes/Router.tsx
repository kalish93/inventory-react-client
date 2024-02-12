import {createBrowserRouter } from "react-router-dom";
import LoginComponent from "../components/auth/Login";
import React from "react";

const routes = createBrowserRouter([
  {
//     path: '/',
//     element: <Home/> , 
//     children: [
//       { 
//         path: '',
//         element: <MusicList/>,
//       },
//       {
//         path: "/music-list/:id",
//         element: <MusicDetail/>,
//       }
//     ],
//   },
//   {
    path: "/login",
    element: <LoginComponent/> ,
  },
//   {
//     path: "/register",
//     element: <Register/> ,
//   }
]
)

export default routes;