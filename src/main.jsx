import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, RouterProvider } from "react-router-dom";
import App from "./App";
import { createBrowserRouter } from "react-router-dom";
import Login from "./Pages/LogIn";
import Register from "./Pages/Register";
import Intro from "./Pages/Intro";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import Download from "./Pages/Download";
import Skintype from "./Pages/Skintype";
import Profile from "./Pages/Profile";
import Arms from "./components/bodyparts/arms";
import Legs from "./components/bodyparts/legs";
import Back from "./components/bodyparts/back";
import Routine from "./Pages/Routine";

const router = createBrowserRouter([
  { path: "/", element: <Login></Login> },
  { path: "home/", element: <Home></Home> },
  { path: "/Login", element: <Login></Login> },
  { path: "/register", element: <Register></Register> },
  { path: "/intro", element: <Intro></Intro> },
  { path: "/download", element: <Download></Download> },
  { path: "/db", element: <Dashboard></Dashboard> },
  { path: "/profile", element: <Profile></Profile> },
  { path: "/skintype", element: <Skintype></Skintype> },
  { path: "/arms", element: <Arms></Arms> },
  { path: "/legs", element: <Legs></Legs> },
  { path: "/back", element: <Back></Back> },
  { path: "/routine", element: <Routine></Routine> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
