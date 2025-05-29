import { Button, Col, Form, Input, InputNumber, message, Row, Select, Switch, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { createProduct, getCategoryProduct } from "../../services/productServices";
import { useEffect, useRef, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { checkImage } from "../../helper/checkImage";
import { handlePickerCallback } from "../../helper/handlePickerCallback";
import { useSelector } from "react-redux";

function CreateProduct() {
    const [form] = Form.useForm();
    const editorRef = useRef(null);
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAPI = async () => {
        const result = await getCategoryProduct();
        if (result.code === 200) {
            setCategory(result.category);
        }
    };

    const { permissions } = useSelector((state) => state.authAdminReducer);

    useEffect(() => {
        fetchAPI();
    }, []);

    const categoryOpitons = [
        {
            value: "",
            label: "-- Danh mục --",
        },
        ...category.map(item => ({
            value: item._id,
            label: `-- ${item.title} --`
        }))
    ];

    const handleSubmit = async (data) => {
        setLoading(true);
        const formData = new FormData();

        for (const key in data) {
            if (key === "thumbnail") {
                if (data[key]) {
                    formData.append("thumbnail", data.thumbnail[0].originFileObj);
                } else {
                    formData.append("thumbnail", "");
                }
            } else if (key === "status") {
                if (data[key]) {
                    formData.append("status", "active");
                } else {
                    formData.append("status", "inactive");
                }
            } else if (key === "position") {
                if (data[key]) {
                    formData.append("position", data[key]);
                }
            } else if (key === "featured") {
                if (data[key]) {
                    formData.append("featured", "1");
                } else {
                    formData.append("featured", "0");
                }
            } else {
                formData.append(key, data[key]);
            }
        }

        if (editorRef.current.getContent()) {
            formData.append("description", editorRef.current.getContent());
        } else {
            formData.append("description", "");
        };



        const result = await createProduct(formData);
        if (result.code === 200) {
            message.success("Tạo sản phẩm mới thành công!");
            form.resetFields();
            editorRef.current.setContent("");
        } else {
            message.error("Tạo sản phẩm mới thất bại!");
        }

        setLoading(false);
    };

    return (
        <>
            {permissions.includes("products_create") && (
                <div className="product__create">
                    <Form
                        className="product__form"
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            title: "",
                            price: 0,
                            stock: 0,
                            discountPercentage: 0,
                            status: true,
                            featured: false,
                            categoryId: ""
                        }}
                    >
                        <div className="header-page">
                            <h5 className="title-page">
                                Tạo mới sản phẩm
                            </h5>

                            <div className="product__buttons">
                                <Form.Item className="product__form-item">
                                    <Button loading={loading} type='primary' htmlType="submit">Tạo sản phẩm</Button>
                                </Form.Item>
                            </div>
                        </div>


                        <div className="product__input-data">
                            <Form.Item
                                label="Tiêu đề sản phẩm"
                                name="title"
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Danh mục sản phẩm"
                                name="categoryId"
                            >
                                <Select options={categoryOpitons} />
                            </Form.Item>

                            <Form.Item
                                label="Sản phẩm nổi bật"
                                name="featured"
                                valuePropName="checked"
                            >
                                <Switch
                                    checkedChildren="Nổi bật"
                                    unCheckedChildren="Không"
                                />
                            </Form.Item>

                            <div className="product__desc">
                                <label className="product__label-desc">Mô tả sản phẩm</label>
                                <Editor
                                    apiKey='vcbgfqutgjbvv0cl9kdsjylyti5d6xq99x8gkrigm9jg62u4'
                                    onInit={(_evt, editor) => editorRef.current = editor}
                                    init={{
                                        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                                        // tinycomments_mode: 'embedded',
                                        // tinycomments_author: 'Author name',
                                        // mergetags_list: [
                                        //     { value: 'First.Name', title: 'First Name' },
                                        //     { value: 'Email', title: 'Email' },
                                        // ],
                                        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                                        file_picker_callback: handlePickerCallback
                                    }}
                                />
                            </div>


                            <Row>
                                <Col span={8}>
                                    <Form.Item
                                        label="Giá"
                                        name="price"
                                    >
                                        <InputNumber min={0} step={0.01} />
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item
                                        label="Giảm giá"
                                        name="discountPercentage"
                                    >
                                        <InputNumber min={0} max={100} step={0.01} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="Số lượng"
                                        name="stock"
                                    >
                                        <InputNumber min={0} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label="Ảnh" name="thumbnail" valuePropName="fileList" getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList || []}>
                                <Upload listType="picture-card" maxCount={1} name="thumbnail" accept="image/*" beforeUpload={(file) => checkImage(file, Upload)}>
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
                                label="Vị trí"
                                name="position"
                            >
                                <InputNumber min={1} placeholder="Tự động tăng" className="product__position" />
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

export default CreateProduct;