import { useState } from 'react';
import { Layout, Button, Flex } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import MenuSider from './MenuSider';
import Logo from "../../images/logo.png";
import './LayoutDefault.scss';
import { Link, Outlet } from 'react-router-dom';
import Info from './Info';

const { Header, Sider, Content } = Layout;
function LayoutDefault() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            <Layout>
                <Sider
                    style={{
                        overflow: 'auto',
                        height: '98vh',
                        position: 'sticky',
                        insetInlineStart: 0,
                        top: 0,
                        bottom: 0,
                    }}
                    theme='light' collapsed={collapsed} className='sider'>
                    <Link to={"/admin/dashboard"} className='sider__logo'>
                        <img src={Logo} alt='Adminator' />
                        <h5 className='sider__label' collapsed={`${collapsed}`} >Adminator</h5>
                    </Link>
                    <MenuSider />
                </Sider>

                <Layout className='layout-full'>
                    <Header style={{
                        padding: 0,
                        paddingRight: "20px",
                        background: "#fff",
                        position: 'sticky',
                        top: 0,
                        zIndex: 999,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        borderBottom: "1px solid #ddd",
                        height: "64px",
                        width: "100%"
                    }}>



                        <Flex justify="space-between" align="center" style={{width: "100%"}}>
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

                            <Info />
                        </Flex>
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