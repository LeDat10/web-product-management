import { Button, Form, Input, InputNumber, message, Switch, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { editProduct, getDetailProduct } from "../../services/productServices";
import { useEffect, useRef, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { useParams } from "react-router-dom";
import { checkImage } from "../../helper/checkImage";
import { handlePickerCallback } from "../../helper/handlePickerCallback";
import { processThumbnail } from "../../helper/processThumbnail";

function EditProduct() {
    const [form] = Form.useForm();
    const editorRef = useRef(null);
    const [data, setData] = useState({});
    const params = useParams();

    const fetchAPI = async () => {
        const result = await getDetailProduct(params.id);
        setData(result.product);
    };

    useEffect(() => {
        fetchAPI();
    }, []);

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
                    featured: data.featured || false
                })
            }
        }

        formInitialValues();
    }, [data]);



    const handleSubmit = async (data) => {
        const formData = new FormData();

        for (const key in data) {
            if (key === "thumbnail") {
                if (data[key].length > 0) {
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
        } else {
            message.error("Cập nhật sản phẩm thất bại!");
        }
    };

    return (
        <>
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
                        position: data.position || 0

                    }}
                >
                    <div className="product__header">
                        <h5 className="product__title">
                            Cập nhật sản phẩm
                        </h5>

                        <div className="product__buttons">
                            <Form.Item className="product__form-item">
                                <Button type='primary' htmlType="submit">Cập nhật</Button>
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
                                    plugins: [
                                        // Core editing features
                                        'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount', 'code',
                                        // Your account includes a free trial of TinyMCE premium features
                                        // Try the most popular premium features until Mar 29, 2025:
                                        'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
                                    ],
                                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | addcomment showcomments | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                    tinycomments_mode: 'embedded',
                                    tinycomments_author: 'Author name',
                                    mergetags_list: [
                                        { value: 'First.Name', title: 'First Name' },
                                        { value: 'Email', title: 'Email' },
                                    ],
                                    ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                                    file_picker_callback: handlePickerCallback,
                                }}
                                initialValue={data.description || ""}
                            />
                        </div>

                        <Form.Item
                            label="Giá"
                            name="price"
                        >
                            <InputNumber min={0} step={0.01} />
                        </Form.Item>

                        <Form.Item
                            label="Giảm giá"
                            name="discountPercentage"
                        >
                            <InputNumber min={0} max={100} step={0.01} />
                        </Form.Item>

                        <Form.Item
                            label="Số lượng"
                            name="stock"
                        >
                            <InputNumber min={0} />
                        </Form.Item>

                        <Form.Item label="Ảnh" name="thumbnail" valuePropName="fileList" getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList || []}>
                            <Upload action="http://localhost:3001/api/products/create" listType="picture-card" maxCount={1} name="thumbnail" accept="image/*"  beforeUpload={(file) => checkImage(file, Upload)}>
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
        </>
    );
};

export default EditProduct;