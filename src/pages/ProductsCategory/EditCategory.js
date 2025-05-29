import { Button, Form, Input, InputNumber, message, Switch, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { useParams } from "react-router-dom";
import { checkImage } from "../../helper/checkImage";
import { getDetailCategory, editCategory } from "../../services/categoryServices";
import { handlePickerCallback } from "../../helper/handlePickerCallback";
import { processThumbnail } from "../../helper/processThumbnail";
import { useSelector } from "react-redux";

function EditCategory() {
    const [form] = Form.useForm();
    const editorRef = useRef(null);
    const [data, setData] = useState({});
    const params = useParams();
    const [reload, setReload] = useState(false);
    const [originalThumbnail, setOriginalThumbnail] = useState(null);
    const [loading, setLoading] = useState(false);

    const { permissions } = useSelector((state) => state.authAdminReducer);

    const fetchAPI = async () => {
        const result = await getDetailCategory(params.id);
        if (result.code === 200) {
            setData(result.category);
            setOriginalThumbnail(result.category.thumbnail);
        }
    };

    const handleReload = () => {
        setReload(!reload);
    }

    useEffect(() => {
        fetchAPI();
    }, [reload]);

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
            handleReload();
        } else {
            message.error("Cập nhật danh mục thất bại!");
        }
        setLoading(false);
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
                        <div className="header-page">
                            <h5 className="title-page">
                                Chỉnh sửa danh mục
                            </h5>

                            <div className="category__buttons">
                                <Form.Item className="category__form-item">
                                    <Button loading={loading} type='primary' htmlType="submit">Cập nhật</Button>
                                </Form.Item>
                            </div>
                        </div>


                        <div className="category__input-data">
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