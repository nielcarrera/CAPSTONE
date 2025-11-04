import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import App from "./App";
import Login from "./Pages/LogIn";
import Register from "./Pages/Register";
import Intro from "./Pages/Intro";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import Download from "./Pages/Download";
import Skintype from "./Pages/Skintype";
import Legal from "./Pages/Legal";
import Profile from "./Pages/Profile";
import Arms from "./components/bodyparts/arms";
import Legs from "./components/bodyparts/legs";
import Back from "./components/bodyparts/back";
import Routine from "./Pages/Routine";
import LandingPage from "./Pages/LandingPage";
import AboutInsecurityFree from "./Pages/About";
import Product from "./Pages/Product";
import BodyImpurityDashboard from "./Pages/BodyImpurityDashboard";

import AccountManagement from "./Pages/Admin/AccountManagement";
import ReccomendedProductsDialog from "./components/ReccomendedProductsDialog";
import AdminPanel from "./Pages/Admin/AdminPanel";
import AdminProduct from "./Pages/Admin/ProductManagement";

const router = createBrowserRouter([
  { path: "/", element: <Home></Home> },
  { path: "home/", element: <Home></Home> },
  { path: "/lp", element: <LandingPage></LandingPage> },
  { path: "/legal", element: <Legal></Legal> },
  { path: "/about", element: <AboutInsecurityFree></AboutInsecurityFree> },
  { path: "/Login", element: <Login></Login> },
  { path: "/register", element: <Register></Register> },
  { path: "/intro", element: <Intro></Intro> },
  { path: "/download", element: <Download></Download> },
  { path: "/db", element: <Dashboard></Dashboard> },
  { path: "/product", element: <Product></Product> },
  { path: "/body", element: <BodyImpurityDashboard></BodyImpurityDashboard> },
  { path: "/profile", element: <Profile></Profile> },
  { path: "/skintype", element: <Skintype></Skintype> },
  { path: "/arms", element: <Arms></Arms> },
  { path: "/legs", element: <Legs></Legs> },
  { path: "/back", element: <Back></Back> },
  { path: "/routine", element: <Routine></Routine> },

  {
    path: "/admin",
    element: <AdminPanel />,
    children: [
      { index: true, element: <AccountManagement /> }, // default page
      { path: "accounts", element: <AccountManagement /> },
      { path: "products", element: <AdminProduct /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
