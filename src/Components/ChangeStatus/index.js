import { Tag, message } from "antd";

function ChangeStatus(props) {
    const { status, id, onReload, changeStatus } = props;
    const [messageApi, contextHolder] = message.useMessage();

    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'Cập nhật trạng thái sản phẩm thành công!'
        });
    };

    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'Xóa sản phẩm thất bại!'
        });
    };

    const handleChangeStatus = async (statusChange) => {
        const result = await changeStatus(id, { status: statusChange });
        if (result.code === 200) {
            onReload();
            success();
        } else {
            error();
        }
    };

    const tagStatus = () => {
        if (status === "active") {
            return <Tag color='success' onClick={() => handleChangeStatus("inactive")}>Hoạt động</Tag>
        } else {
            return <Tag color='error' onClick={() => handleChangeStatus("active")}>Dừng hoạt động</Tag>
        }
    }

    return (
        <>
            {contextHolder}
            <div className="change-status">
                {tagStatus()}
            </div>
        </>
    );
};

export default ChangeStatus;