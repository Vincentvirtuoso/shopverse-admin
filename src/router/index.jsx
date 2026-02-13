import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import ManageProducts from "../pages/ManageProducts";
import AddProduct from "../pages/AddProduct";
import CustomerList from "../pages/CustomerList";
import EditProduct from "../pages/EditProduct";
import Auth from "../pages/Auth";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminLayout from "../layout/AdminLayout";
import Orders from "../pages/Orders";
import CustomerStats from "../pages/CustomerStats";
import ManageCategories from "../pages/ManageCategories";
import AddCategory from "../pages/AddCategory";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/auth" replace /> },
      { path: "/auth", element: <Auth /> },
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <AdminLayout />,
            children: [
              { path: "/dashboard", element: <Home /> },
              { path: "/manage-categories", element: <ManageCategories /> },
              { path: "/categories/new", element: <AddCategory /> },
              { path: "/manage-products", element: <ManageProducts /> },
              { path: "/add-product", element: <AddProduct /> },
              { path: "/edit-product/:id", element: <EditProduct /> },
              { path: "/customers", element: <CustomerList /> },
              { path: "/customers/stats", element: <CustomerStats /> },
              { path: "/orders", element: <Orders /> },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
