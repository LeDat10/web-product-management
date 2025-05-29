import { useEffect, useState } from "react";
import { detailOrder } from "../../services/orderService";
import { useParams } from "react-router-dom";
import moment from "moment";
import { Table, Tag } from "antd";
import { useSelector } from "react-redux";

function DetailOrder() {
    const [order, setOrder] = useState({});
    const params = useParams();
    const orderId = params.orderId;

    const { permissions } = useSelector((state) => state.authAdminReducer);

    const fetchAPI = async () => {
        const result = await detailOrder(orderId);
        if (result.code === 200) {
            setOrder(result.order);
        };
    };

    useEffect(() => {
        fetchAPI();
    }, []);

    const renderStatus = (status) => {
        const colorMap = {
            pending: 'orange',
            confirmed: 'blue',
            shipping: 'processing',
            delivered: 'green',
            cancelled: 'red',
            refunded: 'purple'
        };

        const labelMap = {
            pending: 'Chờ xử lý',
            confirmed: 'Đã xác nhận',
            shipping: 'Đang giao',
            delivered: 'Đã giao',
            cancelled: 'Đã huỷ',
            refunded: 'Hoàn tiền'
        };
        return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>;
    }

    const columns = [
        {
            title: "Sản phẩm",
            dataIndex: "titleProduct",
            key: "titleProduct"
        },
        {
            title: "Ảnh",
            dataIndex: "thumbnail",
            key: "thumbnail",
            render: (thumbnail, record) => <img src={thumbnail} alt={record.title} className='table__image' />
        },
        {
            title: "Đơn giá",
            dataIndex: "priceNew",
            key: "priceNew",
            render: (priceNew) => <p>{priceNew}$</p>
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity"
        },
        {
            title: "Thành tiền",
            key: "totalPrice",
            render: (_, record) => (
                <>
                    <p>{Math.ceil(record.priceNew * record.quantity)}$</p>
                </>
            )
        }
    ];

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
            {permissions.includes("order_view") && (
                <div className="order">
                    <div className="header-page">
                        <h5 className="title-page">
                            Chi tiết đơn hàng
                        </h5>
                    </div>

                    <div className="order__box">
                        <div className="order__info">
                            <h2>Thông tin đơn hàng</h2>
                            <div className="margin-bottom">
                                <span className="order__label">Mã đơn hàng: </span>
                                <span className="order__content">{order._id}</span>
                            </div>
                            <div className="order__date margin-bottom">
                                <span className="order__label">Ngày đặt hàng: </span>
                                <span className="order__content">{moment(order.createdAt).format('DD/MM/YYYY HH:mm:ss')}</span>
                            </div>

                            <div className="order__status margin-bottom">
                                <span className="order__label">Trạng thái: </span>
                                <span className="order__content">{renderStatus(order.status)}</span>
                            </div>

                            <div className="order__price margin-bottom">
                                <span className="order__label">Tổng tiền: </span>
                                <span className="order__content">{order.totalPrice}$</span>
                            </div>
                        </div>
                    </div>

                    <div className="order__box">
                        <div className="order__info-user">
                            <h2>Thông tin người mua</h2>
                            <div className="order__name margin-bottom">
                                <span className="order__label">Họ tên: </span>
                                <span className="order__content">{order.userInfo?.fullName}</span>
                            </div>

                            <div className="order__phone margin-bottom">
                                <span className="order__label">Số điện thoại: </span>
                                <span className="order__content">{order.userInfo?.phone}</span>
                            </div>

                            <div className="order__address margin-bottom">
                                <span className="order__label">Địa chỉ: </span>
                                <span className="order__content">{order.userInfo?.address}</span>
                            </div>
                        </div>
                    </div>

                    <div className="order__box">
                        <div className="order__inner-list">
                            <h2>Danh sách sản phẩm trong đơn hàng</h2>
                            <Table columns={columns} dataSource={order.products} rowKey="_id" pagination={false} />

                        </div>
                    </div>

                    <div className="order__box">
                        <div className="order__action">
                            <h2>Danh sách cập nhật</h2>
                            <Table columns={actionColumns} dataSource={order.updatedBy} rowKey="_id" pagination={false} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DetailOrder;