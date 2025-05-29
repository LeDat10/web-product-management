import { Button, Col, Pagination, Row, Table } from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { deleteAccount, getAccount } from "../../services/accountServices";
import { EditOutlined } from "@ant-design/icons";
import { changeStatusAccount } from "../../services/accountServices";
import ChangeStatus from "../../Components/ChangeStatus";
import Delete from "../../Components/Delete";
import { useQueryParams } from "../../hooks/useQueryParams";
import Sort from "../../Components/Sort";
import { useSelector } from "react-redux";
import moment from "moment";

function Accounts() {
    const [data, setData] = useState([]);
    const [reload, setReload] = useState(false);
    const queryParams = useQueryParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [totalAccount, setTotalAccount] = useState(1);
    const limit = 5;

    const { permissions } = useSelector((state) => state.authAdminReducer);

    const handleReload = () => {
        setReload(!reload);
    };

    const fetchAPI = async (params = {}) => {
        const result = await getAccount(params);
        if (result.code === 200) {
            setData(result.accounts);
            setTotalAccount(result.totalAccount);
        };
    };

    useEffect(() => {
        const sortKey = queryParams.get('sortKey') || '';
        const sortValue = queryParams.get('sortValue') || '';
        const page = queryParams.get('page') || 1;
        fetchAPI({
            sortKey,
            sortValue,
            limit,
            page
        });
    }, [reload, location.search]);

    const columns = [
        {
            title: "STT",
            dataIndex: "_id",
            key: "_id",
            render: (value, record, index) => index + 1
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
            title: "Nhóm quyền",
            dataIndex: "roleTitle",
            key: "roleTitle",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email"
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (value, record) => <ChangeStatus status={value} id={record._id} onReload={handleReload} changeStatus={changeStatusAccount} />
        },
        {
            title: "Người cập nhật",
            dataIndex: "updatedBy",
            render: (value, record) => (
                <>
                    {value && (
                        <div className='time'>
                            <p>{value.accountFullName}</p>
                            <p>{moment(value.updatedAt).format('DD/MM/YYYY HH:mm:ss')}</p>
                        </div>
                    )}
                </>
            )
        },
        {
            title: "Hành động",
            key: "actions",
            render: (value, record) => (
                <>
                    <Link to={`/admin/accounts/detail/${record._id}`} style={{marginRight: "10px"}}>
                        <Button>
                            Chi tiết
                        </Button>
                    </Link>

                    {permissions.includes("accounts_edit") && (
                        <Link to={`/admin/accounts/edit/${record._id}`} className='accounts__button-edit'>
                            <Button type='primary' icon={<EditOutlined />}>
                                Chỉnh sửa
                            </Button>
                        </Link>
                    )}

                    {permissions.includes("accounts_delete") && (
                        <Delete id={record._id} onReload={handleReload} functionDelete={deleteAccount} textConfirm={"Bạn có muốn xóa tài khoản này không?"} />
                    )}
                </>
            )
        }
    ];

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
            {permissions.includes("accounts_view") && (
                <div className="accounts">
                    <div className="header-page">
                        <h5 className="title-page">
                            Danh sách tài khoản
                        </h5>

                        <div className="accounts__buttons">
                            {permissions.includes("accounts_create") && (
                                <Link to={"/admin/accounts/create"}>
                                    <Button type='primary'>+ Thêm tài khoản</Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className='accounts__navigation'>
                        <Row className='row-height' gutter={20} align={'middle'}>
                            <Col span={6}>
                                <Sort sortOptions={sortOptions} handleSort={handleSort} defaultValue={`${queryParams.get('sortKey') || "fullName"}-${queryParams.get('sortValue') || "asc"}`} />
                            </Col>
                        </Row>
                    </div>

                    <div className='accounts__list'>
                        <Table columns={columns} dataSource={data} rowKey="_id" pagination={false} />
                    </div>

                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <Pagination onChange={handleChangePagination} className="pagination" align="center" defaultCurrent={queryParams.get('page')} total={totalAccount} pageSize={limit} />
                        </Col>
                    </Row>
                </div>
            )}
        </>
    );
};

export default Accounts;