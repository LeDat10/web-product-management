import { Button, Form, Input, message } from "antd";
import { Editor } from '@tinymce/tinymce-react';
import { handlePickerCallback } from "../../helper/handlePickerCallback";
import './Roles.scss';
import { useRef, useState } from "react";
import { createRoles } from "../../services/rolesServices";
import { useSelector } from "react-redux";

function CreateRole() {
    const [form] = Form.useForm();
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(false);


    const { permissions } = useSelector((state) => state.authAdminReducer);

    const handleSubmit = async (data) => {
        setLoading(true);
        if (editorRef.current.getContent()) {
            data["description"] = editorRef.current.getContent();
        } else {
            data["description"] = "";
        };

        const result = await createRoles(data);
        if (result.code === 200) {
            message.success("Tạo nhóm quyền thành công!");
            form.resetFields();
            editorRef.current.setContent("");
        } else {
            message.success("Tạo nhóm quyền thất bại!");
        }
        setLoading(false);
    }

    return (
        <>
            {permissions.includes("roles_create") && (
                <div className="roles__create">
                    <Form
                        form={form}
                        layout="vertical"
                        className="roles__form"
                        onFinish={handleSubmit}
                    >
                        <div className="header-page">
                            <h5 className="title-page">
                                Tạo mới nhóm quyền
                            </h5>

                            <div className="roles__buttons">
                                <Form.Item className="roles__form-item">
                                    <Button loading={loading} type='primary' htmlType="submit">Tạo nhóm quyền</Button>
                                </Form.Item>
                            </div>
                        </div>


                        <div className="roles__input-data">
                            <Form.Item
                                label="Tiêu đề nhóm quyền"
                                name="title"
                            >
                                <Input />
                            </Form.Item>

                            <div className="roles__desc">
                                <label className="roles__label-desc">Mô tả nhóm quyền</label>
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
                        </div>
                    </Form>
                </div>
            )}
        </>
    );
};

export default CreateRole;