import { useLocation, useNavigate } from 'react-router-dom';
import './Order.scss';
import { Table, Row, Col, Pagination, Tag } from 'antd';
import { useEffect, useState } from 'react';
import InputSearch from '../../Components/InputSearch';
import ChangeMulti from "../../Components/ChangeMulti";
import Delete from '../../Components/Delete';
import { useQueryParams } from '../../hooks/useQueryParams';
import Restore from '../../Components/Restore';
import { useSelector } from 'react-redux';
import { deleteTrashOrder, getTrashOrder, restoreMultiOrder, restoreTrashOrder } from '../../services/orderService';
import moment from 'moment';

function TrashOrder() {
    const [orders, setOrders] = useState([]);
    const [reload, setReload] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const queryParams = useQueryParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [totalOrder, setTotalOrder] = useState(1);
    const limit = 10;

    const { permissions } = useSelector((state) => state.authAdminReducer);

    const fetchAPI = async (params = {}) => {
        const result = await getTrashOrder(params);
        if (result.code === 200) {
            setOrders(result.orders);
            setTotalOrder(result.totalOrder);
        }
    };

    useEffect(() => {
        const keyword = queryParams.get('keyword') || '';
        const page = queryParams.get('page') || 1;
        fetchAPI({
            keyword: keyword,
            page: page,
            limit: limit
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
                    <Row gutter={[10, 10]}>
                        {permissions.includes("order_restore") && (
                            <Col>
                                <Restore option={{ orderId: record._id }} onReload={handleReload} functionRestore={restoreTrashOrder} />
                            </Col>
                        )}

                        {permissions.includes("order_delete-permanently") && (
                            <Col>
                                <Delete id={record._id} onReload={handleReload} functionDelete={deleteTrashOrder} textConfirm={"Bạn có muốn xóa sản phẩm này vĩnh viễn không?"} />
                            </Col>
                        )}
                    </Row>
                </>
            )
        }
    ];

    const changeMultiOption = [
        {
            value: '',
            label: "-- Chọn hành động --",
            disabled: true
        },
        ...(permissions.includes("order_restore") ? [{
            value: 'restore',
            label: "-- Khôi phục --"
        }] : []),
        ...(permissions.includes("order_delete-permanently") ? [{
            value: 'delete',
            label: "-- Xóa vĩnh viễn --"
        }] : [])
    ];


    const handleSearch = (keyword) => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('keyword', keyword);
        navigate({
            pathname: location.pathname,
            search: `?${queryParams.toString()}`
        });
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys) => {
            setSelectedRowKeys(selectedKeys);
        },
    };

    const setRowKeysEmpty = () => {
        setSelectedRowKeys([]);
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

    return (
        <>
            {permissions.includes("order_trash") && (
                <div className="order">
                    <div className="header-page">
                        <h5 className="title-page">
                            Thùng rác
                        </h5>

                        <div className="order__buttons">
                            <ChangeMulti
                                changeMultiOption={changeMultiOption}
                                onReload={handleReload}
                                selectedRowKeys={selectedRowKeys}
                                rowKeysEmpty={setRowKeysEmpty}
                                changeMulti={restoreMultiOrder}
                            />
                        </div>
                    </div>

                    <div className='order__navigation'>
                        <Row className='row-height' gutter={20} align={'middle'}>
                            <Col span={6}>
                                <InputSearch placeholder="Tìm kiếm theo mã đơn hàng..." onSearch={handleSearch} defaultValue={queryParams.get('keyword') || ''} />
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

export default TrashOrder;