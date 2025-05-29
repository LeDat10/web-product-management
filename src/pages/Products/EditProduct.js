import { Button, Col, Form, Input, InputNumber, message, Row, Select, Switch, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { editProduct, getCategoryProduct, getDetailProduct } from "../../services/productServices";
import { useEffect, useRef, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { useParams } from "react-router-dom";
import { checkImage } from "../../helper/checkImage";
import { handlePickerCallback } from "../../helper/handlePickerCallback";
import { processThumbnail } from "../../helper/processThumbnail";
import { useSelector } from "react-redux";

function EditProduct() {
    const [form] = Form.useForm();
    const editorRef = useRef(null);
    const [data, setData] = useState({});
    const params = useParams();
    const [category, setCategory] = useState([]);
    const [originalThumbnail, setOriginalThumbnail] = useState(null);
    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(false);
    const { permissions } = useSelector((state) => state.authAdminReducer);

    const fetchAPI = async () => {
        const result = await getDetailProduct(params.id);
        if (result.code === 200) {
            setData(result.product);
            setOriginalThumbnail(result.product.thumbnail);

        }
        const result2 = await getCategoryProduct();
        if (result2.code === 200) {
            setCategory(result2.category);
        }
    };

    const handleReload = () => {
        setReload(!reload);
    }

    useEffect(() => {
        fetchAPI();
    }, [reload]);

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

    if (Object.keys(data).length > 0) {
        if (data.status === "active") {
            data.status = true;
        } else if (data.status === "inactive") {
            data.status = false;
        };

        if (data.featured === "1") {
            data.featured = true;
        } else if (data.featured === "0") {
            data.featured = false;
        }
    };

    useEffect(() => {
        const formInitialValues = async () => {
            if (Object.keys(data).length > 0) {
                form.setFieldsValue({
                    title: data.title || "",
                    price: data.price || 0,
                    stock: data.stock || 0,
                    discountPercentage: data.discountPercentage || 0,
                    status: data.status || false,
                    thumbnail: await processThumbnail(data.thumbnail),
                    position: data.position || 0,
                    featured: data.featured || false,
                    categoryId: data.categoryId || ""
                })
            }
        }

        formInitialValues();
    }, [data]);



    const handleSubmit = async (data) => {
        setLoading(true);
        const formData = new FormData();

        for (const key in data) {
            if (key === "thumbnail") {
                const newFile = data[key]?.[0];
                if (!newFile) {
                    // Người dùng đã xóa ảnh (fileList rỗng) → gửi thumbnail = ""
                    formData.append("thumbnail", "");
                } else {
                    if (newFile.url === originalThumbnail) {
                        // Không thay đổi ảnh → không append gì
                        continue;
                    }

                    if (newFile.originFileObj) {
                        // Người dùng chọn ảnh mới → gửi file
                        formData.append("thumbnail", newFile.originFileObj);
                    }
                }
            } else if (key === "status") {
                if (data[key]) {
                    formData.append("status", "active");
                } else {
                    formData.append("status", "inactive");
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

        const result = await editProduct(params.id, formData);
        if (result.code === 200) {
            message.success("Cập nhật sản phẩm thành công!");
            handleReload();
        } else {
            message.error("Cập nhật sản phẩm thất bại!");
        }
        setLoading(false);
    };

    return (
        <>
            {permissions.includes("products_edit") && (
                <div className="product__edit">
                    <Form
                        className="product__form"
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            title: data.title || "",
                            price: data.price || 0,
                            stock: data.stock || 0,
                            discountPercentage: data.discountPercentage || 0,
                            status: data.status || false,
                            thumbnail: data.thumbnail
                                ? [{ uid: '-1', name: 'image.png', status: 'done', url: data.thumbnail }]
                                : [],
                            position: data.position || 0,
                            categoryId: ""
                        }}
                    >
                        <div className="header-page">
                            <h5 className="title-page">
                                Cập nhật sản phẩm
                            </h5>

                            <div className="product__buttons">
                                <Form.Item className="product__form-item">
                                    <Button loading={loading} type='primary' htmlType="submit">Cập nhật</Button>
                                </Form.Item>
                            </div>
                        </div>

                        <div className="product__input-data">
                            <Form.Item
                                label="Tiêu đề sản phẩm"
                                name="title"
                                rules={[
                                    {
                                        required: true,
                                        message: "Tiêu đề không được bỏ trống!"
                                    }
                                ]}
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
                                        file_picker_callback: handlePickerCallback,
                                    }}
                                    initialValue={data.description || ""}
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
                                <InputNumber name="position" min={1} placeholder="Tự động tăng" className="product__position" />
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

export default EditProduct;