import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, RouterProvider } from "react-router-dom";
import App from "./App";
import { createBrowserRouter } from "react-router-dom";
import Login from "./Pages/LogIn";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import Download from "./Pages/Download";

const router = createBrowserRouter([
  { path: "/", element: <Home></Home> },
  { path: "/Login", element: <Login></Login> },
  { path: "/register", element: <Register></Register> },
  { path: "/download", element: <Download></Download> },
  { path: "/db", element: <Dashboard></Dashboard> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
