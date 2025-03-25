import { Button, Form, Input, InputNumber, message, Switch, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { useParams } from "react-router-dom";
import { checkImage } from "../../helper/checkImage";
import { getDetailCategory, editCategory } from "../../services/categoryServices";
import { handlePickerCallback } from "../../helper/handlePickerCallback";
import { processThumbnail } from "../../helper/processThumbnail";
import { permissions } from "../../services/rolesServices";
import useAuth from "../../helper/useAuth";

function EditCategory() {
    const [form] = Form.useForm();
    const editorRef = useRef(null);
    const [data, setData] = useState({});
    const params = useParams();

    const permissions = useAuth();

    const fetchAPI = async () => {
        const result = await getDetailCategory(params.id);
        setData(result.category);
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
    };

    useEffect(() => {
        const formInitialValues = async () => {
            if (Object.keys(data).length > 0) {
                form.setFieldsValue({
                    title: data.title || "",
                    status: data.status || false,
                    thumbnail: await processThumbnail(data.thumbnail),
                    position: data.position || 0
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
            } else {
                formData.append(key, data[key]);
            }
        }

        if (editorRef.current.getContent()) {
            formData.append("description", editorRef.current.getContent());
        } else {
            formData.append("description", "");
        };

        const result = await editCategory(params.id, formData);
        if (result.code === 200) {
            message.success("Cập nhật danh mục thành công!");
        } else {
            message.error("Cập nhật danh mục thất bại!");
        }
    };

    return (
        <>
            {permissions.includes("products-category_edit") && (
                <div className="category__edit">
                    <Form
                        className="category__form"
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            title: data.title || "",
                            status: data.status || false,
                            thumbnail: data.thumbnail
                                ? [{ uid: '-1', name: 'image.png', status: 'done', url: data.thumbnail }]
                                : [],
                            position: data.position || 0

                        }}
                    >
                        <div className="category__header">
                            <h5 className="product__title">
                                Chỉnh sửa danh mục
                            </h5>

                            <div className="category__buttons">
                                <Form.Item className="category__form-item">
                                    <Button type='primary' htmlType="submit">Cập nhật</Button>
                                </Form.Item>
                            </div>
                        </div>


                        <div className="category__input-data">
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

                            <div className="category__desc">
                                <label className="category__label-desc">Mô tả danh mục</label>
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
                            <Form.Item label="Ảnh" name="thumbnail" valuePropName="fileList" getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList || []}>
                                <Upload action="http://localhost:3001/api/products/create" listType="picture-card" maxCount={1} name="thumbnail" accept="image/*" beforeUpload={(file) => checkImage(file, Upload)}>
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
                                <InputNumber name="position" min={1} placeholder="Tự động tăng" className="category__position" />
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

export default EditCategory;