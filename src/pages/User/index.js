import { useEffect, useState } from "react";
import { useQueryParams } from "../../hooks/useQueryParams";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { changeMultiUser, changeStatusUser, deleteUser, getUser } from "../../services/userService";
import { useSelector } from "react-redux";
import { Button, Col, Pagination, Row, Table, Tag } from "antd";
import moment from "moment";
import ChangeStatus from "../../Components/ChangeStatus";
import ChangeMulti from "../../Components/ChangeMulti";
import "./User.scss";
import Delete from "../../Components/Delete";
import FilterStatus from "../../Components/FilterStatus";
import Sort from "../../Components/Sort";

function User() {
    const [data, setData] = useState([]);
    const [reload, setReload] = useState(false);
    const queryParams = useQueryParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [totalUser, setTotalUser] = useState(1);
    const limit = 5;

    const fetchAPI = async (params = {}) => {
        const result = await getUser(params);
        if (result.code === 200) {
            setData(result.users);
            setTotalUser(result.totalUser);
        };
    };

    const { permissions } = useSelector((state) => state.authAdminReducer);

    const handleReload = () => {
        setReload(!reload);
    };

    useEffect(() => {
        const sortKey = queryParams.get('sortKey') || '';
        const sortValue = queryParams.get('sortValue') || '';
        const page = queryParams.get('page') || 1;
        const status = queryParams.get('status') || '';
        fetchAPI({
            sortKey,
            sortValue,
            status,
            limit,
            page
        });
    }, [reload, location.search]);

    console.log(data);

    const columns = [
        {
            title: "Email",
            dataIndex: "email",
            key: "email"
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
            title: "Xác thực",
            dataIndex: "isVerified",
            key: "isVerified",
            render: (value) => (
                <>
                    {value ? (
                        <Tag color="success">Đã xác thực</Tag>
                    ) : (
                        <Tag color="error">Chưa xác thực</Tag>
                    )}
                </>
            )
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (value, record) => <ChangeStatus status={value} id={record._id} onReload={handleReload} changeStatus={changeStatusUser} />
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            render: (value, record) => (
                <>
                    <p>{moment(value).format('DD/MM/YYYY HH:mm:ss')}</p>

                </>
            )
        },
        {
            title: "Hành động",
            key: "actions",
            render: (value, record) => (
                <>
                    <Row gutter={20}>
                        <Col>
                            {permissions.includes("user_view") && (
                                <Link to={`/admin/user/detail/${record._id}`}>
                                    <Button>
                                        Chi tiết
                                    </Button>
                                </Link>
                            )}
                        </Col>
                        <Col>
                            {permissions.includes("user_delete") && (
                                <Delete id={record._id} onReload={handleReload} functionDelete={deleteUser} textConfirm={"Bạn có muốn xóa người dùng này không?"} />
                            )}
                        </Col>
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
        {
            value: 'active',
            label: "-- Hoạt động --"
        },
        {
            value: 'inactive',
            label: "-- Dừng hoạt động --"
        },
        {
            value: 'delete-all',
            label: "-- Xóa tất cả --"
        }
    ];

    const filterStatusOptions = [
        {
            value: "",
            label: "-- Trạng thái --",
            disabled: true
        },
        {
            value: "all",
            label: "-- Tất cả --"
        },
        {
            value: "active",
            label: "-- Hoạt động --",
        },
        {
            value: "inactive",
            label: "-- Dừng hoạt động --",
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

    const sortOptions = [
        {
            value: "fullName-asc",
            label: "-- Tên từ A - Z --"
        },
        {
            value: "fullName-desc",
            label: "-- Tên từ Z - A --"
        }
    ];

    const handleSort = (value) => {
        const [sortKey, sortValue] = value.split("-");
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('sortKey', sortKey);
        queryParams.set('sortValue', sortValue);
        navigate({
            pathname: location.pathname,
            search: `?${queryParams.toString()}`
        });
    };
    return (
        <>
            <div className="user">
                <div className="header-page">
                    <h5 className="title-page">
                        Danh sách người dùng
                    </h5>

                    <div className="user__buttons">
                        {permissions.includes('user_edit') && (
                            <ChangeMulti
                                changeMultiOption={changeMultiOption}
                                onReload={handleReload}
                                selectedRowKeys={selectedRowKeys}
                                rowKeysEmpty={setRowKeysEmpty}
                                changeMulti={changeMultiUser}
                                textConfirm="Bạn có muốn xóa những người dùng này?"
                            />
                        )}
                    </div>
                </div>

                <div className='user__navigation'>
                    <Row className='row-height' gutter={20} align={'middle'}>
                        <Col span={6}>
                            <Sort sortOptions={sortOptions} handleSort={handleSort} defaultValue={`${queryParams.get('sortKey') || "fullName"}-${queryParams.get('sortValue') || "asc"}`} />
                        </Col>

                        <Col span={6}>
                            <FilterStatus filterStatusOptions={filterStatusOptions} handleChangeStatus={handleFilterStatus} defaultValue={queryParams.get('status') || ''} />
                        </Col>
                    </Row>
                </div>

                <div className='user__list'>
                    <Table rowSelection={rowSelection} columns={columns} dataSource={data} rowKey="_id" pagination={false} />
                </div>

                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <Pagination onChange={handleChangePagination} className="pagination" align="center" defaultCurrent={queryParams.get('page')} total={totalUser} pageSize={limit} />
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default User;