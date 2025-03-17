import {Menu} from 'antd';
import {DashboardOutlined, ProductOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";

function MenuSider () {
    
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
                {
                    key: 'products-list',
                    label: (<Link to={"/admin/products"}>Danh sách</Link>),
                },
                {
                    key: 'products-category',
                    label: (<Link to={"/admin/products-category"}>Danh mục</Link>),
                },
                {
                    key: 'products-create',
                    label: (<Link to={"/admin/products/create"}>Thêm sản phẩm</Link>),
                }
            ]
        }
    ]
    
    return(
        <>
            <Menu mode='inline' items={items} 
            defaultSelectedKeys={["dashboard"]} />
        </>
    );
};

export default MenuSider;