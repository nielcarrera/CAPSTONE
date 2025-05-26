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
import Profile from "./Pages/Profile";
import Arms from "./components/bodyparts/arms";
import Legs from "./components/bodyparts/legs";
import Back from "./components/bodyparts/back";
import Routine from "./Pages/Routine";
import LandingPage from "./Pages/LandingPage";
import ProductReccomendations from "./Pages/Product_Reccomendation";
import Product from "./Pages/Product";
import BodyImpurityDashboard from "./Pages/BodyImpurityDashboard";
import ReccomendedProductsDialog from "./components/ReccomendedProductsDialog";

const router = createBrowserRouter([
  { path: "/", element: <Home></Home> },
  { path: "home/", element: <Home></Home> },
  { path: "/lp", element: <LandingPage></LandingPage> },
  { path: "/Login", element: <Login></Login> },
  { path: "/register", element: <Register></Register> },
  { path: "/intro", element: <Intro></Intro> },
  { path: "/download", element: <Download></Download> },
  { path: "/db", element: <Dashboard></Dashboard> },
  { path: "/product", element: <Product></Product> },
  { path: "/body", element: <BodyImpurityDashboard></BodyImpurityDashboard> },
  {
    path: "/prodrecco",
    element: <ProductReccomendations></ProductReccomendations>,
  },
  {
    path: "/product-recommendations",
    element: <ReccomendedProductsDialog></ReccomendedProductsDialog>,
  },

  { path: "/profile", element: <Profile></Profile> },
  { path: "/skintype", element: <Skintype></Skintype> },
  { path: "/arms", element: <Arms></Arms> },
  { path: "/legs", element: <Legs></Legs> },
  { path: "/back", element: <Back></Back> },
  { path: "/routine", element: <Routine></Routine> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
