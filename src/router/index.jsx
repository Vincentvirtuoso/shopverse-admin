import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import ManageProducts from "../pages/ManageProducts";
import AddProduct from "../pages/AddProduct";
import CustomerList from "../pages/CustomerList";
import EditProduct from "../pages/EditProduct";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "/dashboard", element: <Home /> },
      { path: "/manage-products", element: <ManageProducts /> },
      { path: "/add-product", element: <AddProduct /> },
      { path: "/edit-product/:id", element: <EditProduct /> },
      { path: "/customers", element: <CustomerList /> },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
