import { Button, Form, Input, message, Select, Switch, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { checkImage } from "../../helper/checkImage";
import { createAccount, getRoles } from "../../services/accountServices";
import './Accounts.scss';
import { useSelector } from "react-redux";

function CreateAccount() {
    const [form] = Form.useForm();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);

    const { permissions } = useSelector((state) => state.authAdminReducer);

    const fetchAPI = async () => {
        const result = await getRoles();
        if (result.code === 200) {
            setRoles(result.roles);
        }
    };

    useEffect(() => {
        fetchAPI();
    }, []);

    const rolesOption = [
        {
            label: "-- Chọn quyền --",
            value: "",
            disabled: true
        },
        ...roles.map(role => ({
            value: role._id,
            label: role.title
        }))
    ];

    const handleSubmit = async (data) => {
        setLoading(true);
        const formData = new FormData();

        for (const key in data) {
            if (key === "avatar") {
                if (data[key]) {
                    formData.append("avatar", data.avatar[0].originFileObj);
                } else {
                    formData.append("avatar", "");
                }
            } else if (key === "status") {
                if (data[key]) {
                    formData.append("status", "active");
                } else {
                    formData.append("status", "inactive");
                }
            } else {
                formData.append(key, data[key]);
            }
        }

        const result = await createAccount(formData);
        if (result.code === 200) {
            message.success("Tạo tài khoản mới thành công!");
            form.resetFields();
        } else if (result.code === 409) {
            message.error("Email này đã tồn tại!");
        } else {
            message.error("Tại tài khoản thất bại!");
        };
        setLoading(false);
    };

    return (
        <>
            {permissions.includes("accounts_create") && (
                <div className="accounts__create">
                    <Form
                        className="accounts__form"
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            status: true,
                            role_id: ""
                        }}
                    >
                        <div className="header-page">
                            <h5 className="title-page">
                                Tạo tài khoản mới
                            </h5>

                            <div className="accounts__buttons">
                                <Form.Item className="accounts__form-item">
                                    <Button loading={loading} type='primary' htmlType="submit">Tạo tài khoản</Button>
                                </Form.Item>
                            </div>
                        </div>

                        <div className="accounts__input-data">
                            <Form.Item
                                label="Họ tên"
                                name="fullName"
                                rules={[
                                    {
                                        required: true,
                                        message: "Họ tên không thể bỏ trống!"
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    {
                                        type: 'email',
                                        required: true,
                                        message: "Email không thể bỏ trống!"
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label="Mật khẩu"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Mật khẩu không thể bỏ trống!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                label="Xác nhận mật khẩu"
                                name='confirm-password'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Hãy xác nhận mật khẩu!',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu bạn nhập không khớp!'));
                                        },
                                    })
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item label="Ảnh" name="avatar" valuePropName="fileList" getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList || []}>
                                <Upload listType="picture-card" maxCount={1} name="avatar" accept="image/*" beforeUpload={(file) => checkImage(file, Upload)}>
                                    <button
                                        style={{
                                            color: 'inherit',
                                            cursor: 'inherit',
                                            border: 0,
                                            background: 'none',
                                        }}
                                        type="button"
                                    >
                                        <PlusOutlined />
                                        <div
                                            style={{
                                                marginTop: 8,
                                            }}
                                        >
                                            Upload
                                        </div>
                                    </button>
                                </Upload>
                            </Form.Item>

                            <Form.Item
                                label="Phân quyền"
                                name="role_id"
                            >
                                <Select options={rolesOption} />
                            </Form.Item>

                            <Form.Item
                                label="Trạng thái"
                                name="status"
                                valuePropName="checked"
                            >
                                <Switch
                                    checkedChildren="Hoạt động"
                                    unCheckedChildren="Dừng hoạt động"
                                />
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            )}
        </>
    );
};

export default CreateAccount;