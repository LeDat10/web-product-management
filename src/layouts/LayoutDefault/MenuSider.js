import { Menu } from 'antd';
import { DashboardOutlined, ProductOutlined, KeyOutlined, UserOutlined, DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

function MenuSider() {
    const { permissions } = useSelector((state) => state.authAdminReducer);

    const items = [
        {
            key: 'dashboard',
            label: (<Link to={"/admin/dashboard"}>Tổng quan</Link>),
            icon: <DashboardOutlined />
        },
        {
            key: 'products',
            label: "Sản phẩm",
            icon: <ProductOutlined />,
            children: [
                (permissions.includes('products_view') && (
                    {
                        key: 'products-list',
                        label: (<Link to={"/admin/products"}>Danh sách</Link>),
                    }
                )),
                (permissions.includes('products-category_view') && (
                    {
                        key: 'products-category',
                        label: (<Link to={"/admin/products-category"}>Danh mục</Link>),
                    }
                )),
                (permissions.includes('products_create') && (
                    {
                        key: 'products-create',
                        label: (<Link to={"/admin/products/create"}>Thêm sản phẩm</Link>),
                    }
                )),
            ]
        },
        {
            key: 'roles',
            label: "Quyền",
            icon: <KeyOutlined />,
            children: [
                (permissions.includes("roles_view") && (
                    {
                        key: 'roles-list',
                        label: (<Link to={"/admin/roles"}>Nhóm quyền</Link>),
                    }
                )),
                (permissions.includes("roles_create") && (
                    {
                        key: 'create-role',
                        label: (<Link to={"/admin/roles/create"}>Thêm nhóm quyền</Link>)
                    }
                ))
            ]
        },
        {
            key: 'accounts',
            label: "Tài khoản",
            icon: <UserOutlined />,
            children: [
                (permissions.includes("accounts_view") && (
                    {
                        key: 'accounts-list',
                        label: (<Link to={"/admin/accounts"}>Danh sách</Link>),
                    }
                )),
                (permissions.includes("accounts_create") && (
                    {
                        key: 'accounts-create',
                        label: (<Link to={"/admin/accounts/create"}>Thêm tài khoản</Link>)
                    }
                ))
            ]
        },
        {
            key: "order",
            label: "Đơn hàng",
            icon: <ShoppingCartOutlined />,
            children: [
                (permissions.includes("order_view") && (
                    {
                        key: 'order_view',
                        label: (<Link to={"/admin/order"}>Đơn hàng</Link>),
                    }
                )),
            ]
        },
        {
            key: "user",
            label: "Người dùng",
            icon: <UserOutlined />,
            children: [
                (permissions.includes("user_view") && (
                    {
                        key: 'user_view',
                        label: (<Link to={"/admin/user"}>Người dùng</Link>),
                    }
                )),
            ]
        },
        {
            key: "trash",
            label: "Thùng rác",
            icon: <DeleteOutlined />,
            children: [
                (permissions.includes("products_trash") && (
                    {
                        key: 'products_trash',
                        label: (<Link to={"/admin/products/trash"}>Sản phẩm</Link>),
                    }
                )),
                (permissions.includes("products-category_trash") && (
                    {
                        key: 'products-category_trash',
                        label: (<Link to={"/admin/products-category/trash"}>Danh mục</Link>)
                    }
                )),
                (permissions.includes("roles_trash") && (
                    {
                        key: 'roles_trash',
                        label: (<Link to={"/admin/roles/trash"}>Nhóm quyền</Link>)
                    }
                )),
                (permissions.includes("accounts_trash") && (
                    {
                        key: 'accounts_trash',
                        label: (<Link to={"/admin/accounts/trash"}>Tài khoản</Link>)
                    }
                )),
                (permissions.includes("order_trash") && (
                    {
                        key: 'order_trash',
                        label: (<Link to={"/admin/order/trash"}>Đơn hàng</Link>)
                    }
                )),
                 (permissions.includes("user_trash") && (
                    {
                        key: 'user_trash',
                        label: (<Link to={"/admin/user/trash"}>Người dùng</Link>)
                    }
                ))
            ]
        }
    ];

    return (
        <>
            <Menu
                mode='inline' items={items}
                defaultSelectedKeys={["dashboard"]}
            />
        </>
    );
};

export default MenuSider;