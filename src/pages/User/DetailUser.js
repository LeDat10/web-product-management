import { Button, Image, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getDetailUser } from "../../services/userService";
import moment from "moment";

function DetailUser() {
    const [data, setData] = useState({});
    const params = useParams();
    const userId = params.userId;

    const { permissions } = useSelector((state) => state.authAdminReducer);

    const fetchAPI = async () => {
        const result = await getDetailUser(userId);
        if (result.code === 200) {
            setData(result.user);
        };
    };

    useEffect(() => {
        fetchAPI();
    }, []);

    const renderStatus = (status) => {
        const colorMap = {
            active: 'success',
            inactive: 'error',
        };

        const labelMap = {
            active: 'Hoạt động',
            inactive: 'Dừng hoạt động',
        };
        return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>;
    };

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
            {permissions.includes("user_view") && (
                <div className="user">
                    <div className="header-page">
                        <h5 className="title-page">
                            Chi tiết người dùng
                        </h5>

                        <div className="user__buttons">
                            <Link to={"/admin/user"}>
                                <Button type="primary">Quay lại danh sách</Button>
                            </Link>
                        </div>
                    </div>

                    <div className="user__box">
                        <h2>Thông tin người dùng</h2>
                        <div className="margin-bottom">
                            <span className="user__label">Tên tài khoản: </span>
                            <span className="user__content">{data.fullName}</span>
                        </div>
                        <div className="margin-bottom">
                            <span className="user__label">Email: </span>
                            <span className="user__content">{data.email}</span>
                        </div>
                        <div className="margin-bottom">
                            <span className="user__label">Trạng thái: </span>
                            <span className="user__content">{renderStatus(data.status)}</span>
                        </div>

                        <div className="margin-bottom">
                            <span className="user__label">Số điện thoại: </span>
                            <span className="user__content">{data.phone}</span>
                        </div>

                        <div className="margin-bottom">
                            <div className="user__label">Ảnh đại diện: </div>
                            <Image
                                width={200}
                                src={data.avatar}
                            />
                        </div>
                    </div>

                    <div className="user__box">
                        <h2>Hành động</h2>
                        <div className="margin-bottom">
                            <span className="user__label">Ngày tạo: </span>
                            <span className="user__content">{data.createdAt ? moment(data.createdAt).format('DD/MM/YYYY HH:mm:ss') : ""}</span>
                        </div>

                        <div className="margin-bottom">
                            <span className="user__label">Người xóa: </span>
                            <span className="user__content">{data.deletedBy?.accountFullName}</span>
                        </div>

                        <div className="margin-bottom">
                            <span className="user__label">Ngày xóa: </span>
                            <span className="user__content">{data.deletedBy?.deletedAt ? moment(data.deletedBy?.deletedAt).format('DD/MM/YYYY HH:mm:ss') : ""}</span>
                        </div>

                        <h2>Danh sách cập nhật</h2>
                        <Table columns={actionColumns} dataSource={data.updatedBy} rowKey="_id" pagination={false} />
                    </div>
                </div>
            )}
        </>
    );
};

export default DetailUser;