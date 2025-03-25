import { useState } from 'react';
import { Layout, Button } from 'antd';
import {MenuUnfoldOutlined, MenuFoldOutlined} from "@ant-design/icons";
import MenuSider from './MenuSider';
import Logo from "../../images/logo.png";
import './LayoutDefault.scss';
import { Link, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
function LayoutDefault() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            <Layout>
                <Sider theme='light' collapsed={collapsed} className='sider'>
                    <Link to={"/admin/dashboard"} className='sider__logo'>
                        <img src={Logo} alt='Adminator' />
                        <h5 className='sider__label' collapsed={`${collapsed}`} >Adminator</h5>
                    </Link>
                    <MenuSider />
                </Sider>

                <Layout className='layout-full'>
                    <Header style={{
                        padding: 0,
                        background: "#ddd",
                    }}>

                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                    </Header>

                    <Content className='content'>
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default LayoutDefault;