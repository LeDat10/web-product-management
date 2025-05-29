import { Button, Table } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getDetailRole } from "../../services/rolesServices";
import parse from "html-react-parser";
import moment from "moment";

function DetailRole() {
    const params = useParams();
    const [data, setData] = useState({});

    const { permissions } = useSelector((state) => state.authAdminReducer);

    const fetchAPI = async () => {
        const result = await getDetailRole(params.roleId);
        if (result.code === 200) {
            setData(result.role);
        };
    };

    useEffect(() => {
        fetchAPI();
    }, []);

    const actionColumns = [
        {
            title: "Người cập nhật",
            dataIndex: "accountFullName",
            key: "accountFullName"
        },
        {
            title: "Thời gian cập nhật",
            dataIndex: "updatedAt",
            key: "updatedAt",
            render: (updatedAt) => <p>{moment(updatedAt).format('DD/MM/YYYY HH:mm:ss')}</p>
        }
    ];

    return (
        <>
            {permissions.includes("roles_view") && (
                <div className="roles">
                    <div className="header-page">
                        <h5 className="title-page">
                            Chi tiết nhóm quyền
                        </h5>

                        <div className="roles__buttons">
                            <Link to={"/admin/roles"}>
                                <Button type="primary">Quay lại danh sách</Button>
                            </Link>
                        </div>
                    </div>

                    <div className="roles__box">
                        <div className="roles__info">
                            <h2>Thông tin nhóm quyền</h2>
                            <div className="margin-bottom">
                                <span className="roles__label">Tên nhóm quyền: </span>
                                <span className="roles__content">{data.title}</span>
                            </div>

                            <div className="margin-bottom">
                                <span className="roles__label">Mô tả ngắn:</span>
                                <span>{parse(data.description || "")}</span>
                            </div>
                        </div>
                    </div>

                    <div className="roles__box">
                        <h2>Hành động</h2>
                        <div className="margin-bottom">
                            <span className="roles__label">Người tạo: </span>
                            <span className="roles__content">{data.createdBy?.accountFullName}</span>
                        </div>

                        <div className="margin-bottom">
                            <span className="roles__label">Ngày tạo: </span>
                            <span className="roles__content">{data.createdBy?.createdAt ? moment(data.createdBy?.createdAt).format('DD/MM/YYYY HH:mm:ss') : ""}</span>
                        </div>

                        <div className="margin-bottom">
                            <span className="roles__label">Người xóa: </span>
                            <span className="roles__content">{data.deletedBy?.accountFullName}</span>
                        </div>

                        <div className="margin-bottom">
                            <span className="roles__label">Ngày xóa: </span>
                            <span className="roles__content">{data.deletedBy?.deletedAt ? moment(data.deletedBy?.deletedAt).format('DD/MM/YYYY HH:mm:ss') : ""}</span>
                        </div>

                        <h2>Danh sách cập nhật</h2>
                        <Table columns={actionColumns} dataSource={data.updatedBy} rowKey="_id" pagination={false} />
                    </div>
                </div>
            )}
        </>
    );
};

export default DetailRole;