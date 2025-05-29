import ProtectedRoute from "../Components/ProtectedRoute.js";
import LayoutDefault from "../layouts/LayoutDefault";
import Accounts from "../pages/Accounts";
import CreateAccount from "../pages/Accounts/CreateAccount";
import DetailAccount from "../pages/Accounts/DetailAccount.js";
import EditAccount from "../pages/Accounts/EditAccount";
import TrashAccount from "../pages/Accounts/TrashAccount.js";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import DetailOrder from "../pages/Order/DetailOrder.js";
import Order from "../pages/Order/index.js";
import TrashOrder from "../pages/Order/TrashOrder.js";
import Products from "../pages/Products";
import CreateProduct from "../pages/Products/CreateProduct";
import DetailProduct from "../pages/Products/DetailProduct";
import EditProduct from "../pages/Products/EditProduct";
import TrashProduct from "../pages/Products/TrashProduct.js";
import ProductsCategory from "../pages/ProductsCategory";
import CreateCategory from "../pages/ProductsCategory/CreateCategory";
import DetailCategory from "../pages/ProductsCategory/DetailCategory";
import EditCategory from "../pages/ProductsCategory/EditCategory";
import TrashCategory from "../pages/ProductsCategory/TrashCategory.js";
import Roles from "../pages/Roles";
import CreateRole from "../pages/Roles/CreateRole";
import DetailRole from "../pages/Roles/DetailRole.js";
import EditRole from "../pages/Roles/EditRole";
import TrashRole from "../pages/Roles/TrashRole.js";
import DetailUser from "../pages/User/DetailUser.js";
import User from "../pages/User/index.js";
import TrashUser from "../pages/User/TrashUser.js";

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
                            },
                            {
                                path: "trash",
                                element: <TrashProduct />
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
                            },
                            {
                                path: "trash",
                                element: <TrashCategory />
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
                            },
                            {
                                path: "trash",
                                element: <TrashRole />
                            },
                            {
                                path: "detail/:roleId",
                                element: <DetailRole />
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
                            },
                            {
                                path: "trash",
                                element: <TrashAccount />
                            },
                            {
                                path: "detail/:accountId",
                                element: <DetailAccount />
                            }
                        ]
                    },
                    {
                        path: "order",
                        children: [
                            {
                                index: true,
                                element: <Order />
                            },
                            {
                                path: "detail/:orderId",
                                element: <DetailOrder />
                            },
                            {
                                path: "trash",
                                element: <TrashOrder />
                            }
                        ]
                    },
                    {
                        path: "user",
                        children: [
                            {
                                index: true,
                                element: <User />
                            },
                            {
                                path: "detail/:userId",
                                element: <DetailUser />
                            },
                            {
                                path: "trash",
                                element: <TrashUser />
                            }
                        ]
                    }
                ]
            }
        ]
    },
]