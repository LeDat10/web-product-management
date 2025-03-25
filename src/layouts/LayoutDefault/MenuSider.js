import { Menu } from 'antd';
import { DashboardOutlined, ProductOutlined, KeyOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import useAuth from '../../helper/useAuth';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function MenuSider() {
    const permissions = useAuth();

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