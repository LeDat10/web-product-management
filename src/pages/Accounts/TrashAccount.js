import { useLocation, useNavigate } from 'react-router-dom';
import './Accounts.scss';
import { Table, Row, Col, Pagination } from 'antd';
import { useEffect, useState } from 'react';
import InputSearch from '../../Components/InputSearch';
import ChangeMulti from "../../Components/ChangeMulti";
import Sort from '../../Components/Sort';
import Delete from '../../Components/Delete';
import { useQueryParams } from '../../hooks/useQueryParams';
import Restore from '../../Components/Restore';
import { deleteTrashAccount, getTrashAccount, restoreMultiAccount, restoreTrashAccount } from '../../services/accountServices';
import { useSelector } from 'react-redux';

function TrashAccount() {
    const [accounts, setAccounts] = useState([]);
    const [reload, setReload] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const queryParams = useQueryParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [totalAccount, setTotalAccount] = useState(1);
    const limit = 5;

    const { permissions } = useSelector((state) => state.authAdminReducer);

    const fetchAPI = async (params = {}) => {
        const result = await getTrashAccount(params);
        if (result.code === 200) {
            setAccounts(result.accounts);
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

    const handleReload = () => {
        setReload(!reload);
    };

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
            title: "Phân quyền",
            dataIndex: "roleTitle",
            key: "roleTitle"
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email"
        },
        {
            title: "Hành động",
            key: "actions",
            render: (value, record) => (
                <>
                    <Row gutter={[10, 10]}>
                        {permissions.includes("accounts_restore") && (
                            <Col>
                                <Restore option={{ accountId: record._id }} onReload={handleReload} functionRestore={restoreTrashAccount} />
                            </Col>
                        )}

                        {permissions.includes("accounts_delete-permanently") && (
                            <Col>
                                <Delete id={record._id} onReload={handleReload} functionDelete={deleteTrashAccount} textConfirm={"Bạn có muốn xóa sản phẩm này vĩnh viễn không?"} />
                            </Col>
                        )}
                    </Row>

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

    const changeMultiOption = [
        {
            value: '',
            label: "-- Chọn hành động --",
            disabled: true
        },
        ...(permissions.includes("accounts_restore") ? [{
            value: 'restore',
            label: "-- Khôi phục --"
        }] : []),
        ...(permissions.includes("accounts_delete-permanently") ? [{
            value: 'delete',
            label: "-- Xóa vĩnh viễn --"
        }] : [])
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
            {permissions.includes("accounts_trash") && (
                <div className="accounts">
                    <div className="header-page">
                        <h5 className="title-page">
                            Thùng rác
                        </h5>

                        <div className="accounts__buttons">
                            <ChangeMulti
                                changeMultiOption={changeMultiOption}
                                onReload={handleReload}
                                selectedRowKeys={selectedRowKeys}
                                rowKeysEmpty={setRowKeysEmpty}
                                changeMulti={restoreMultiAccount}
                            />
                        </div>
                    </div>

                    <div className='accounts__navigation'>
                        <Row className='row-height' gutter={20} align={'middle'}>
                            <Col span={6}>
                                <Sort sortOptions={sortOptions} handleSort={handleSort} defaultValue={`${queryParams.get('sortKey') || "fullName"}-${queryParams.get('sortValue') || "asc"}`} />
                            </Col>
                        </Row>
                    </div>

                    <div className='roles__list'>
                        <Table rowSelection={rowSelection} columns={columns} dataSource={accounts} rowKey="_id" pagination={false} />
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

export default TrashAccount;