import { Button, Popconfirm, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteProduct } from "../../services/productServices";
function DeleteProduct(props) {
    const { id, onReload } = props;

    const handleDelete = async () => {
        const result = await deleteProduct(id);
        if (result.code === 200) {
            onReload();
            message.success("Xóa sản phẩm thành công!");
        } else {
            message.error("Xóa sản phẩm thất bại!");
        };
    }
    return (
        <>
            <Popconfirm title="Bạn có chắc muốn xóa sản phẩm này không?" onConfirm={handleDelete} okText="Đồng ý" cancelText="Không">
                <Button danger icon={<DeleteOutlined />}>Xóa</Button>
            </Popconfirm>
        </>
    );
};

export default DeleteProduct;