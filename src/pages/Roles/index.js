import { Button, Table } from "antd";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { deleteRole, getRoles } from "../../services/rolesServices";
import { EditOutlined } from "@ant-design/icons";
import parse from "html-react-parser";
import './Roles.scss';
import Permissions from "./Permissions";
import Delete from "../../Components/Delete";
import useAuth from "../../helper/useAuth";

function Roles() {
    const [data, setData] = useState([]);
    const [reload, setReload] = useState(false);

    const fetchAPI = async () => {
        const result = await getRoles();
        setData(result.roles);
    };

    const permissions = useAuth();

    const handleReload = () => {
        setReload(!reload);
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
            title: "Nhóm quyền",
            dataIndex: "title",
            key: "title",
            render: (title, record) => <Link to={`/admin/roles/detail/${record._id}`} >{title}</Link>
        },
        {
            title: "Mô tả ngắn",
            dataIndex: "description",
            key: "description",
            width: 700,
            render: (value) => parse(value)
        },
        {
            title: "Hành động",
            key: "actions",
            render: (value, record) => (
                <>
                    {permissions.includes("roles_permissions") && (
                        <Permissions record={record} />
                    )}

                    {permissions.includes("roles_edit") && (
                        <Link to={`/admin/roles/edit/${record._id}`} className='product__button-edit'>
                            <Button type='primary' icon={<EditOutlined />}>
                                Chỉnh sửa
                            </Button>
                        </Link>
                    )}
                    {permissions.includes("roles_delete") && (
                        <Delete id={record._id} onReload={handleReload} functionDelete={deleteRole} textConfirm={"Bạn có muốn xóa nhóm quyền này không?"} />
                    )}
                </>
            )
        }
    ];

    return (
        <>
            {permissions.includes("roles_view") && (
                <div className="roles">
                    <div className="roles__header">
                        <h5 className="roles__title">
                            Nhóm quyền
                        </h5>

                        <div className="roles__buttons">
                            {permissions.includes("roles_create") && (
                                <Link to={"/admin/roles/create"}>
                                    <Button type='primary' htmlType="submit">+ Thêm nhóm quyền</Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className='roles__list'>
                        <Table columns={columns} dataSource={data} rowKey="_id" />
                    </div>
                </div>
            )}
        </>
    );
};

export default Roles;