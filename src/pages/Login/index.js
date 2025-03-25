import { Button, Col, Form, Input, message, Row } from "antd";
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import './Login.scss';
import { login } from "../../services/accountServices";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function Login() {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleSubmit = async (value) => {
        const result = await login(value);
        if (result.code === 200) {
            Cookies.set("token", result.token);
            navigate("/admin/dashboard");
            message.success("Đăng nhập thành công!");
        } else if (result.code === 401) {
            message.error("Email hoặc mật khẩu đăng nhập không đúng!");
        } else {
            message.error("Đăng nhập thất bại!");
        };
    };

    return (
        <>
            <div className="container">
                <Row gutter={30} justify="center">
                    <Col span={16}>
                        <div className="login">
                            <h1 className="login__title">
                                Đăng nhập
                            </h1>

                            <Form
                                form={form}
                                name="login"
                                layout="vertical"
                                size="large"
                                onFinish={handleSubmit}
                            >
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Email không thể bỏ trống!"
                                        }
                                    ]}
                                >
                                    <Input prefix={<MailOutlined />} />
                                </Form.Item>

                                <Form.Item
                                    label="Mật khẩu"
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Mật khẩu không thể bỏ trống!"
                                        }
                                    ]}
                                >
                                    <Input.Password prefix={<LockOutlined />} />
                                </Form.Item>

                                <Form.Item>
                                    <Button block type="primary" htmlType="submit">
                                        Đăng nhập
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </div>


        </>
    );
};

export default Login;