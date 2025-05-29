import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getDetailProduct } from "../../services/productServices";
import { Button, Image, Table, Tag } from 'antd';
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import moment from "moment";

function DetailProduct() {
    const params = useParams();
    const [data, setData] = useState();

    const { permissions } = useSelector((state) => state.authAdminReducer);

    const fetchAPI = async () => {
        const result = await getDetailProduct(params.id);
        if (result.code === 200) {
            setData(result.product);
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
            {permissions.includes("products_view") && (
                <div className="product__detail">
                    <div className="header-page">
                        <h5 className="title-page">
                            Chi tiết sản phẩm
                        </h5>

                        <div className="product__buttons">
                            <Link to={"/admin/products"}>
                                <Button type="primary">Quay lại danh sách</Button>
                            </Link>
                        </div>
                    </div>

                    <div className="product__inner-detail">
                        {data && (
                            <div className="product__inner-info">
                                <div className="product__box">
                                    <div className="product__info">
                                        <h2>Thông tin sản phẩm</h2>
                                        <div className="margin-bottom">
                                            <span className="product__label">Tên sản phẩm: </span>
                                            <span className="product__content">{data.title}</span>
                                        </div>
                                        <div className="margin-bottom">
                                            <span className="product__label">Trạng thái: </span>
                                            <span className="product__content">{renderStatus(data.status)}</span>
                                        </div>

                                        <div className="margin-bottom">
                                            <span className="product__label">Danh mục: </span>
                                            <span className="product__content">{data["categoryTitle"] ? (data["categoryTitle"]) : ("Không có")}</span>
                                        </div>

                                        <div className="margin-bottom">
                                            <span className="product__label">Giá: </span>
                                            <span className="product__content">{data.price}$</span>
                                        </div>

                                        <div className="margin-bottom">
                                            <span className="product__label">Giảm giá: </span>
                                            <span className="product__content">{data.discountPercentage}%</span>
                                        </div>

                                        <div className="margin-bottom">
                                            <Image
                                                width={200}
                                                src={data.thumbnail}
                                            />
                                        </div>

                                        <div className="margin-bottom">
                                            <span className="product__label">Sản phẩm nổi bật: </span>
                                            <span className="product__content">{data.featured === "1" ? "Có" : "Không"}</span>
                                        </div>

                                        <div className="margin-bottom">
                                            <span className="product__label">Số lượng sẵn có: </span>
                                            <span className="product__content">{data.stock}</span>
                                        </div>

                                        <div className="margin-bottom">
                                            <span className="product__label">Vị trí: </span>
                                            <span className="product__content">{data.position}</span>
                                        </div>

                                        <div className="margin-bottom">
                                            <span className="product__label">Mô tả sản phẩm:</span>
                                            <span>{parse(data.description || "")}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="product__box">
                                    <h2>Hành động</h2>
                                    <div className="margin-bottom">
                                        <span className="product__label">Người tạo sản phẩm: </span>
                                        <span className="product__content">{data.createdBy?.accountFullName}</span>
                                    </div>

                                    <div className="margin-bottom">
                                        <span className="product__label">Ngày tạo sản phẩm: </span>
                                        <span className="product__content">{data.createdBy?.createdAt ? moment(data.createdBy?.createdAt).format('DD/MM/YYYY HH:mm:ss') : ""}</span>
                                    </div>

                                    <div className="margin-bottom">
                                        <span className="product__label">Người xóa sản phẩm: </span>
                                        <span className="product__content">{data.deletedBy?.accountFullName}</span>
                                    </div>

                                    <div className="margin-bottom">
                                        <span className="product__label">Ngày xóa sản phẩm: </span>
                                        <span className="product__content">{data.deletedBy?.deletedAt ? moment(data.deletedBy?.deletedAt).format('DD/MM/YYYY HH:mm:ss') : ""}</span>
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

export default DetailProduct;