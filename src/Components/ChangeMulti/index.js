import { Button, Select, message, Popconfirm } from 'antd';
import { useState } from "react";
import './ChangeMulti.scss';

function ChangeMulti(props) {
    const {changeMultiOption, onReload, selectedRowKeys, getSelectedProducts, rowKeysEmpty, changeMulti} = props;

    const [keyAction, setKeyAction] = useState("");

    const handleChangeMulti = (value) => {
        setKeyAction(value);
    };

    const handleClickChangeMulti = async () => {
        if (keyAction === "position") {
            const ids = getSelectedProducts();
            const result = await changeMulti({
                ids: ids,
                key: keyAction
            });

            if (result.code === 200) {
                message.success(`Cập nhật vị trí của ${ids.length} sản phẩm thành công!`);
                rowKeysEmpty();
                onReload();
            } else {
                message.error(`Cập nhật vị trí của ${ids.length} sản phẩm thất bại!`);
            }
        } else if (keyAction === "delete-all") {
            const result = await changeMulti({
                ids: selectedRowKeys,
                key: keyAction
            });

            if (result.code === 200) {
                message.success(`Xóa thành công ${selectedRowKeys.length} sản phẩm!`);
                rowKeysEmpty();
                onReload();

            } else {
                message.error(`Xóa thất bại ${selectedRowKeys.length} sản phẩm!`);
            }
        } else {
            const result = await changeMulti({
                ids: selectedRowKeys,
                key: keyAction
            });

            if (result.code === 200) {
                message.success(`Cập nhật trạng thái của ${selectedRowKeys.length} sản phẩm thành công!`);
                rowKeysEmpty();
                onReload();

            } else {
                message.error(`Cập nhật trạng thái của ${selectedRowKeys.length} sản phẩm thất bại!`);
            }
        };
    };
    return (
        <>
            <div className='change-multi'>
                <Select options={changeMultiOption} style={{
                    width: 'auto',
                }} defaultValue={""} onChange={handleChangeMulti} />

                {
                    keyAction === "delete-all" ? (
                        <Popconfirm
                            title="Bạn có muốn xóa những sản phẩm này?"
                            okText="Đồng ý"
                            cancelText="Không"
                            onConfirm={handleClickChangeMulti}
                        >
                            <Button type='primary'>Áp dụng</Button>
                        </Popconfirm>
                    ) : (
                        <Button type='primary' onClick={handleClickChangeMulti}>Áp dụng</Button>
                    )
                }
            </div>
        </>
    )
};

export default ChangeMulti;