import { Button, Table } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteAccount, getAccount } from "../../services/accountServices";
import { EditOutlined } from "@ant-design/icons";
import { changeStatusAccount } from "../../services/accountServices";
import ChangeStatus from "../../Components/ChangeStatus";
import Delete from "../../Components/Delete";
import useAuth from "../../helper/useAuth";


function Accounts() {
    const [data, setData] = useState([]);
    const [reload, setReload] = useState(false);

    const permissions = useAuth();

    const handleReload = () => {
        setReload(!reload);
    };

    const fetchAPI = async () => {
        const result = await getAccount();
        setData(result.accounts);
    };

    useEffect(() => {
        fetchAPI();
    }, [reload]);

    const columns = [
        {
            title: "STT",
            dataIndex: "_id",
            key: "_id",
            render: (value, record, index) => index + 1
        },
        {
            title: "Ảnh đại diện",
            dataIndex: "avatar",
            key: "avatar",
            render: (value, record) => <img src={value} alt={record.title} className="table__image" />
        },
        {
            title: "Họ tên",
            dataIndex: "fullName",
            key: "fullName",
            render: (value) => <b>{value}</b>
        },
        {
            title: "Phân quyền",
            dataIndex: "roleTitle",
            key: "roleTitle"
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email"
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (value, record) => <ChangeStatus status={value} id={record._id} onReload={handleReload} changeStatus={changeStatusAccount} />
        },
        {
            title: "Hành động",
            key: "actions",
            render: (value, record) => (
                <>
                    {permissions.includes("accounts_edit") && (
                        <Link to={`/admin/accounts/edit/${record._id}`} className='accounts__button-edit'>
                            <Button type='primary' icon={<EditOutlined />}>
                                Chỉnh sửa
                            </Button>
                        </Link>
                    )}

                    {permissions.includes("accounts_delete") && (
                        <Delete id={record._id} onReload={handleReload} functionDelete={deleteAccount} textConfirm={"Bạn có muốn xóa tài khoản này không?"} />
                    )}
                </>
            )
        }
    ]

    return (
        <>
            {permissions.includes("accounts_view") && (
                <div className="accounts">
                    <div className="accounts__header">
                        <h5 className="accounts__title">
                            Danh sách tài khoản
                        </h5>

                        <div className="accounts__buttons">
                            {permissions.includes("accounts_create") && (
                                <Link to={"/admin/accounts/create"}>
                                    <Button type='primary'>+ Thêm tài khoản</Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className='accounts__list'>
                        <Table columns={columns} dataSource={data} rowKey="_id" />
                    </div>
                </div>
            )}
        </>
    );
};

export default Accounts;