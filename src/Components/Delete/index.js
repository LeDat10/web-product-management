import { Button, message, Popconfirm } from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import "./Delelte.scss";

function Delete(props) {
    const { id, onReload, functionDelete, textConfirm } = props;

    const handleDelete = async () => {
        const result = await functionDelete(id);
        if (result.code === 200) {
            onReload();
            message.success(result.message);
        } else {
            message.error(result.message);
        };
    }
    return (
        <>
            <Popconfirm title={textConfirm} onConfirm={handleDelete} okText="Đồng ý" cancelText="Không">
                <Button className="button-delete" danger icon={<DeleteOutlined />}>Xóa</Button>
            </Popconfirm>
        </>
    );
};

export default Delete;