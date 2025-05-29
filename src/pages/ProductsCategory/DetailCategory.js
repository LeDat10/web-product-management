import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getDetailCategory } from "../../services/categoryServices";
import { Button, Image, Table, Tag } from 'antd';
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import moment from "moment";

function DetailCategory() {
    const params = useParams();
    const [data, setData] = useState();

    const { permissions } = useSelector((state) => state.authAdminReducer);

    const fetchAPI = async () => {
        const result = await getDetailCategory(params.id);
        if (result.code === 200) {
            setData(result.category);
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
            {permissions.includes("products-category_view") && (
                <div className="category__detail">
                    <div className="header-page">
                        <h5 className="title-page">
                            Chi tiết danh mục
                        </h5>

                        <div className="category__buttons">
                            <Link to={"/admin/products-category"}>
                                <Button type="primary">Quay lại danh sách</Button>
                            </Link>
                        </div>
                    </div>

                    <div className="category__inner-detail">
                        {data && (
                            <div className="category__inner-info">
                                <div className="category__box">
                                    <div className="category__info">
                                        <h2>Thông tin danh mục</h2>
                                        <div className="margin-bottom">
                                            <span className="category__label">Tên danh mục: </span>
                                            <span className="category__content">{data.title}</span>
                                        </div>
                                        <div className="margin-bottom">
                                            <span className="category__label">Trạng thái: </span>
                                            <span className="category__content">{renderStatus(data.status)}</span>
                                        </div>

                                        <div className="margin-bottom">
                                            <Image
                                                width={200}
                                                src={data.thumbnail}
                                            />
                                        </div>

                                        <div className="margin-bottom">
                                            <span className="category__label">Vị trí: </span>
                                            <span className="category__content">{data.position}</span>
                                        </div>

                                        <div className="margin-bottom">
                                            <span className="category__label">Mô tả danh mục:</span>
                                            <span>{parse(data.description || "")}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="category__box">
                                    <h2>Hành động</h2>
                                    <div className="margin-bottom">
                                        <span className="category__label">Người tạo: </span>
                                        <span className="category__content">{data.createdBy?.accountFullName}</span>
                                    </div>

                                    <div className="margin-bottom">
                                        <span className="category__label">Ngày tạo: </span>
                                        <span className="category__content">{data.createdBy?.createdAt ? moment(data.createdBy?.createdAt).format('DD/MM/YYYY HH:mm:ss') : ""}</span>
                                    </div>

                                    <div className="margin-bottom">
                                        <span className="category__label">Người xóa: </span>
                                        <span className="category__content">{data.deletedBy?.accountFullName}</span>
                                    </div>

                                    <div className="margin-bottom">
                                        <span className="category__label">Ngày xóa: </span>
                                        <span className="category__content">{data.deletedBy?.deletedAt ? moment(data.deletedBy?.deletedAt).format('DD/MM/YYYY HH:mm:ss') : ""}</span>
                                    </div>

                                    <h2>Danh sách cập nhật</h2>
                                    <Table columns={actionColumns} dataSource={data.updatedBy} rowKey="_id" pagination={false} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default DetailCategory;