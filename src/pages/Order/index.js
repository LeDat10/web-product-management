import { useEffect, useState } from "react";
import "./Order.scss";
import { changeMultiOrder, getOrders } from "../../services/orderService";
import moment from "moment";
import { Button, Col, Pagination, Row, Table, Tag } from "antd";
import { useSelector } from "react-redux";
import ChangeMulti from "../../Components/ChangeMulti";
import { Link, useLocation, useNavigate } from "react-router-dom";
import InputSearch from "../../Components/InputSearch";
import { useQueryParams } from "../../hooks/useQueryParams";
import FilterStatus from "../../Components/FilterStatus";

function Order() {
    const [orders, setOrders] = useState([]);
    const [reload, setReload] = useState(false);
    const [totalOrder, setTotalOrder] = useState(1);
    const queryParams = useQueryParams();
    const location = useLocation();
    const navigate = useNavigate();
    const limit = 10;

    const fetchAPI = async (params = {}) => {
        const result = await getOrders(params);
        if (result.code === 200) {
            setOrders(result.orders);
            setTotalOrder(result.totalOrder);
        };
    };

    const { permissions } = useSelector((state) => state.authAdminReducer);

    useEffect(() => {
        const keyword = queryParams.get('keyword') || '';
        const page = queryParams.get('page') || 1;
        const status = queryParams.get('status') || '';
        fetchAPI({
            keyword: keyword,
            page: page,
            limit: limit,
            status: status
        });
    }, [reload, location.search]);

    const handleReload = () => {
        setReload(!reload);
    };

    const columns = [
        {
            title: "Mã đơn hàng",
            dataIndex: "_id",
            key: "id"
        },
        {
            title: "Khách hàng",
            dataIndex: "userInfo",
            key: "userInfo",
            render: (userInfo) => <div>{userInfo?.fullName}</div>
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (totalPrice) => <p>{totalPrice}$</p>
        },
        {
            title: "Ngày đặt",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt) => <p>{moment(createdAt).format('DD/MM/YYYY HH:mm:ss')}</p>
        },
        {
            title: "Thanh toán",
            dataIndex: "payment",
            key: "payment",
            render: (payment) => (
                <>
                    {payment ? (
                        <div>Đã thanh toán</div>
                    ) : (
                        <div>Chưa thanh toán</div>
                    )}
                </>
            )
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => {
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
        },
        {
            title: "Hành động",
            key: "actions",
            render: (value, record) => (
                <>
                    {permissions.includes('order_view') && (
                        <Link to={`/admin/order/detail/${record._id}`}>
                            <Button type='primary'>
                                Chi tiết
                            </Button>
                        </Link>
                    )}
                </>
            )
        }
    ];

    const filterStatusOptions = [
        {
            value: "",
            label: "-- Trạng thái --",
            disabled: true
        },
        {
            value: 'pending',
            label: "-- Chờ xử lý --"
        },
        {
            value: 'confirmed',
            label: "-- Đã xác nhận --"
        },
        {
            value: 'shipping',
            label: "-- Đang giao --"
        },
        {
            value: "delivered",
            label: "-- Đã giao --"
        },
        {
            value: "cancelled",
            label: "-- Đã hủy --"
        },
        {
            value: "refunded",
            label: "-- Hoàn tiền --"
        }
    ];

    const changeMultiOption = [
        {
            value: '',
            label: "-- Chọn hành động --",
            disabled: true
        },
        {
            value: 'pending',
            label: "-- Chờ xử lý --"
        },
        {
            value: 'confirmed',
            label: "-- Đã xác nhận --"
        },
        {
            value: 'shipping',
            label: "-- Đang giao --"
        },
        {
            value: "delivered",
            label: "-- Đã giao --"
        },
        {
            value: "cancelled",
            label: "-- Đã hủy --"
        },
        {
            value: "refunded",
            label: "-- Hoàn tiền --"
        },
        {
            value: 'delete-all',
            label: "-- Xóa tất cả --"
        }
    ];

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys) => {
            setSelectedRowKeys(selectedKeys);
        },
    };

    const setRowKeysEmpty = () => {
        setSelectedRowKeys([]);
    };

    const handleSearch = (keyword) => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('keyword', keyword);
        navigate({
            pathname: location.pathname,
            search: `?${queryParams.toString()}`
        });
    };

    const handleChangePagination = (page) => {
        const queryParams = new URLSearchParams(location.search);

        queryParams.set('page', page);
        queryParams.set('limit', limit);
        navigate({
            pathname: location.pathname,
            search: `?${queryParams.toString()}`
        });
    };

    const handleFilterStatus = (status) => {
        if (status === "all") {
            const queryParams = new URLSearchParams(location.search);
            queryParams.set('status', "");
            navigate({
                pathname: location.pathname,
                search: `?${queryParams.toString()}`
            });
        } else {
            const queryParams = new URLSearchParams(location.search);
            queryParams.set('status', status);
            navigate({
                pathname: location.pathname,
                search: `?${queryParams.toString()}`
            });
        };
    };

    return (
        <>
            {permissions.includes("order_view") && (
                <div className="order">
                    <div className="header-page">
                        <h5 className="title-page">
                            Danh sách đơn hàng
                        </h5>

                        <div className="order__buttons">
                            {permissions.includes('order_edit') && (
                                <ChangeMulti
                                    changeMultiOption={changeMultiOption}
                                    onReload={handleReload}
                                    selectedRowKeys={selectedRowKeys}
                                    rowKeysEmpty={setRowKeysEmpty}
                                    changeMulti={changeMultiOrder}
                                    textConfirm="Bạn có muốn xóa những đơn hàng này?"
                                />
                            )}
                        </div>
                    </div>

                    <div className='order__navigation'>
                        <Row className='row-height' gutter={20} align={'middle'}>
                            <Col span={6}>
                                <InputSearch placeholder="Tìm kiếm theo mã đơn hàng..." onSearch={handleSearch} defaultValue={queryParams.get('keyword') || ''} />
                            </Col>
                            <Col span={6}>
                                <FilterStatus filterStatusOptions={filterStatusOptions} handleChangeStatus={handleFilterStatus} defaultValue={queryParams.get('status') || ''} />
                            </Col>
                        </Row>
                    </div>

                    <div className='order__list'>
                        <Table rowSelection={rowSelection} columns={columns} dataSource={orders} rowKey="_id" pagination={false} />
                    </div>

                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <Pagination onChange={handleChangePagination} className="pagination" align="center" defaultCurrent={queryParams.get('page')} total={totalOrder} pageSize={limit} />
                        </Col>
                    </Row>
                </div>
            )}
        </>
    );
};

export default Order;