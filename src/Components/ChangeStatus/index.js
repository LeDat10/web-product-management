import { Tag, message } from "antd";

function ChangeStatus(props) {
    const { status, id, onReload, changeStatus } = props;

    const handleChangeStatus = async (statusChange) => {
        const result = await changeStatus(id, { status: statusChange });
        if (result.code === 200) {
            onReload();
            message.success(result.message);
        } else {
            message.error(result.message);
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
            <div className="change-status">
                {tagStatus()}
            </div>
        </>
    );
};

export default ChangeStatus;