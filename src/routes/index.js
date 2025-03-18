import LayoutDefault from "../layouts/LayoutDefault";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import CreateProduct from "../pages/Products/CreateProduct";
import DetailProduct from "../pages/Products/DetailProduct";
import EditProduct from "../pages/Products/EditProduct";
import ProductsCategory from "../pages/ProductsCategory";
import CreateCategory from "../pages/ProductsCategory/CreateCategory";
import EditCategory from "../pages/ProductsCategory/EditCategory";

export const routes = [
    {
        path: "admin",
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
                    }
                ]
            }
            
        ]
    }
]