import { Button, Form, Input, InputNumber, message, Switch, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { createCategory } from "../../services/categoryServices";
import { useRef, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { checkImage } from "../../helper/checkImage";
import { handlePickerCallback } from "../../helper/handlePickerCallback";
import { useSelector } from "react-redux";


function CreateCategory() {
    const [form] = Form.useForm();
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(false);


    const { permissions } = useSelector((state) => state.authAdminReducer);

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
            } else {
                formData.append(key, data[key]);
            }
        }

        if (editorRef.current.getContent()) {
            formData.append("description", editorRef.current.getContent());
        } else {
            formData.append("description", "");
        };

        const result = await createCategory(formData);
        if (result.code === 200) {
            message.success("Tạo danh mục mới thành công!");
            form.resetFields();
            editorRef.current.setContent("");
        } else {
            message.error("Tạo danh mục mới thất bại!");
        }
        setLoading(false);
    }

    return (
        <>
            {permissions.includes("products-category_create") && (
                <div className="category__create">
                    <Form
                        className="category__form"
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            status: true
                        }}
                    >
                        <div className="header-page">
                            <h5 className="title-page">
                                Tạo mới danh mục
                            </h5>

                            <div className="category__buttons">
                                <Form.Item className="category__form-item">
                                    <Button loading={loading} type='primary' htmlType="submit">Tạo danh mục</Button>
                                </Form.Item>
                            </div>
                        </div>


                        <div className="category__input-data">
                            <Form.Item
                                label="Tiêu đề danh mục"
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

                            <div className="category__desc">
                                <label className="category__label-desc">Mô tả danh mục</label>
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
                                <InputNumber min={1} placeholder="Tự động tăng" className="category__position" />
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

export default CreateCategory;