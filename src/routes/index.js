import ProtectedRoute from "../Components/ProtectedRoute.js";
import LayoutDefault from "../layouts/LayoutDefault";
import Accounts from "../pages/Accounts";
import CreateAccount from "../pages/Accounts/CreateAccount";
import EditAccount from "../pages/Accounts/EditAccount";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Products from "../pages/Products";
import CreateProduct from "../pages/Products/CreateProduct";
import DetailProduct from "../pages/Products/DetailProduct";
import EditProduct from "../pages/Products/EditProduct";
import ProductsCategory from "../pages/ProductsCategory";
import CreateCategory from "../pages/ProductsCategory/CreateCategory";
import DetailCategory from "../pages/ProductsCategory/DetailCategory";
import EditCategory from "../pages/ProductsCategory/EditCategory";
import Roles from "../pages/Roles";
import CreateRole from "../pages/Roles/CreateRole";
import EditRole from "../pages/Roles/EditRole";

export const routes = [
    {
        path: "admin/login",
        element: <Login />
    },
    {
        path: "admin",
        element: <ProtectedRoute />,
        children: [
            
            {
                path: "",
                element: <LayoutDefault />,
                children: [
                    {
                        path: "dashboard",
                        element: <Dashboard />
                    },
                    {
                        path: "products",
                        children: [
                            {
                                index: true,
                                element: <Products />,
                            },
                            {
                                path: "create",
                                element: <CreateProduct />,
                            },
                            {
                                path: "edit/:id",
                                element: <EditProduct />,
                            },
                            {
                                path: "detail/:id",
                                element: <DetailProduct />,
                            }
                        ]
                    },
                    {
                        path: "products-category",
                        children: [
                            {
                                index: true,
                                element: <ProductsCategory />
                            },
                            {
                                path: "create",
                                element: <CreateCategory />
                            },
                            {
                                path: "edit/:id",
                                element: <EditCategory />
                            },
                            {
                                path: "detail/:id",
                                element: <DetailCategory />
                            }
                        ]
                    },
                    {
                        path: "roles",
                        children: [
                            {
                                index: true,
                                element: <Roles />
                            },
                            {
                                path: "create",
                                element: <CreateRole />
                            },
                            {
                                path: "edit/:id",
                                element: <EditRole />
                            }
                        ]
                    },
                    {
                        path: "accounts",
                        children: [
                            {
                                index: true,
                                element: <Accounts />
                            },
                            {
                                path: "create",
                                element: <CreateAccount />
                            },
                            {
                                path: "edit/:id",
                                element: <EditAccount />
                            }
                        ]
                    }

                ]
            }
        ]
    },
]