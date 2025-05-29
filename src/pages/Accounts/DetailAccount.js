import { Button, Image, Table, Tag } from "antd";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getDetailAccount } from "../../services/accountServices";
import moment from "moment";
import { useEffect, useState } from "react";

function DetailAccount() {
    const params = useParams();
    const [data, setData] = useState({});

    const { permissions } = useSelector((state) => state.authAdminReducer);

    const fetchAPI = async () => {
        const result = await getDetailAccount(params.accountId);
        if (result.code === 200) {
            setData(result.account);
        }
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
            <div className="accounts">
                <div className="header-page">
                    <h5 className="title-page">
                        Chi tiết tài khoản
                    </h5>

                    <div className="accounts__buttons">
                        <Link to={"/admin/accounts"}>
                            <Button type="primary">Quay lại danh sách</Button>
                        </Link>
                    </div>
                </div>

                <div className="accounts__box">
                    <h2>Thông tin tài khoản</h2>
                    <div className="margin-bottom">
                        <span className="accounts__label">Tên tài khoản: </span>
                        <span className="accounts__content">{data.fullName}</span>
                    </div>
                    <div className="margin-bottom">
                        <span className="accounts__label">Email: </span>
                        <span className="accounts__content">{data.email}</span>
                    </div>
                    <div className="margin-bottom">
                        <span className="accounts__label">Trạng thái: </span>
                        <span className="accounts__content">{renderStatus(data.status)}</span>
                    </div>

                    <div className="margin-bottom">
                        <span className="accounts__label">Nhóm quyền: </span>
                        <span className="accounts__content">{data.roleTitle}</span>
                    </div>

                    <div className="margin-bottom">
                        <span className="accounts__label">Số điện thoại: </span>
                        <span className="accounts__content">{data.phone}</span>
                    </div>

                    <div className="margin-bottom">
                        <div className="accounts__label">Ảnh đại diện: </div>
                        <Image
                            width={200}
                            src={data.avatar}
                        />
                    </div>
                </div>

                <div className="accounts__box">
                    <h2>Hành động</h2>
                    <div className="margin-bottom">
                        <span className="accounts__label">Người tạo: </span>
                        <span className="accounts__content">{data.createdBy?.accountFullName}</span>
                    </div>

                    <div className="margin-bottom">
                        <span className="accounts__label">Ngày tạo: </span>
                        <span className="accounts__content">{data.createdBy?.createdAt ? moment(data.createdBy?.createdAt).format('DD/MM/YYYY HH:mm:ss') : ""}</span>
                    </div>

                    <div className="margin-bottom">
                        <span className="accounts__label">Người xóa: </span>
                        <span className="accounts__content">{data.deletedBy?.accountFullName}</span>
                    </div>

                    <div className="margin-bottom">
                        <span className="accounts__label">Ngày xóa: </span>
                        <span className="accounts__content">{data.deletedBy?.deletedAt ? moment(data.deletedBy?.deletedAt).format('DD/MM/YYYY HH:mm:ss') : ""}</span>
                    </div>

                    <h2>Danh sách cập nhật</h2>
                    <Table columns={actionColumns} dataSource={data.updatedBy} rowKey="_id" pagination={false} />
                </div>
            </div>
        </>
    );
};

export default DetailAccount;