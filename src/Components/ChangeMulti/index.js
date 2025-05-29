import { Button, Select, message, Popconfirm } from 'antd';
import { useState } from "react";
import './ChangeMulti.scss';

function ChangeMulti(props) {
    const {changeMultiOption, onReload, selectedRowKeys, getSelectedProducts, rowKeysEmpty, changeMulti, textConfirm} = props;

    const [keyAction, setKeyAction] = useState("");
    const [loading ,setLoading] = useState(false);

    const handleChangeMulti = (value) => {
        setKeyAction(value);
    };

    const handleClickChangeMulti = async () => {
        setLoading(true);
        if (keyAction === "position") {
            const ids = getSelectedProducts();
            const result = await changeMulti({
                ids: ids,
                key: keyAction
            });

            if (result.code === 200) {
                message.success(result.message || "");
                rowKeysEmpty();
                onReload();
            } else {
                message.error(result.message || "");
            }
        } else if (keyAction === "delete-all") {
            const result = await changeMulti({
                ids: selectedRowKeys,
                key: keyAction
            });

            if (result.code === 200) {
                message.success(result.message || "");
                rowKeysEmpty();
                onReload();

            } else {
                message.error(result.message || "");
            }
        } else {
            const result = await changeMulti({
                ids: selectedRowKeys,
                key: keyAction
            });

            if (result.code === 200) {
                message.success(result.message || "");
                rowKeysEmpty();
                onReload();

            } else {
                message.error(result.message || "");
            }
        };
        setLoading(false);
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
                            title={textConfirm || ""}
                            okText="Đồng ý"
                            cancelText="Không"
                            onConfirm={handleClickChangeMulti}
                        >
                            <Button loading={loading} type='primary'>Áp dụng</Button>
                        </Popconfirm>
                    ) : (
                        <Button loading={loading} type='primary' onClick={handleClickChangeMulti}>Áp dụng</Button>
                    )
                }
            </div>
        </>
    )
};

export default ChangeMulti;