import { Button, Col, Pagination, Row, Table } from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { deleteRole, getRoles } from "../../services/rolesServices";
import { EditOutlined } from "@ant-design/icons";
import parse from "html-react-parser";
import './Roles.scss';
import Permissions from "./Permissions";
import Delete from "../../Components/Delete";
import InputSearch from "../../Components/InputSearch";
import Sort from "../../Components/Sort";
import { useQueryParams } from "../../hooks/useQueryParams";
import { useSelector } from "react-redux";
import moment from "moment";

function Roles() {
    const [data, setData] = useState([]);
    const [reload, setReload] = useState(false);
    const queryParams = useQueryParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [totalRole, setTotalRole] = useState(1);
    const limit = 5;

    const fetchAPI = async (params = {}) => {
        const result = await getRoles(params);
        if (result.code === 200) {
            setData(result.roles);
            setTotalRole(result.totalRole);
        };
    };

    const { permissions } = useSelector((state) => state.authAdminReducer);

    const handleReload = () => {
        setReload(!reload);
    };

    useEffect(() => {
        const sortKey = queryParams.get('sortKey') || '';
        const sortValue = queryParams.get('sortValue') || '';
        const keyword = queryParams.get('keyword') || '';
        const page = queryParams.get('page') || 1;
        fetchAPI({
            sortKey,
            sortValue,
            keyword,
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
            title: "Nhóm quyền",
            dataIndex: "title",
            key: "title",
            render: (title, record) => <Link to={`/admin/roles/detail/${record._id}`} >{title}</Link>
        },
        {
            title: "Mô tả ngắn",
            dataIndex: "description",
            key: "description",
            width: 700,
            render: (value) => parse(value)
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
                    {permissions.includes("roles_permissions") && (
                        <Permissions record={record} />
                    )}

                    {permissions.includes("roles_edit") && (
                        <Link to={`/admin/roles/edit/${record._id}`} className='product__button-edit'>
                            <Button type='primary' icon={<EditOutlined />}>
                                Chỉnh sửa
                            </Button>
                        </Link>
                    )}
                    {permissions.includes("roles_delete") && (
                        <Delete id={record._id} onReload={handleReload} functionDelete={deleteRole} textConfirm={"Bạn có muốn xóa nhóm quyền này không?"} />
                    )}
                </>
            )
        }
    ];

    const sortOptions = [
        {
            value: "title-asc",
            label: "-- Tiêu đề từ A - Z --"
        },
        {
            value: "title-desc",
            label: "-- Tiêu đề từ Z - A --"
        }
    ];

    const handleSearch = (keyword) => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('keyword', keyword);
        navigate({
            pathname: location.pathname,
            search: `?${queryParams.toString()}`
        });
    };

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
            {permissions.includes("roles_view") && (
                <div className="roles">
                    <div className="header-page">
                        <h5 className="title-page">
                            Nhóm quyền
                        </h5>

                        <div className="roles__buttons">
                            {permissions.includes("roles_create") && (
                                <Link to={"/admin/roles/create"}>
                                    <Button type='primary' htmlType="submit">+ Thêm nhóm quyền</Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className='roles__navigation'>
                        <Row className='row-height' gutter={20} align={'middle'}>
                            <Col span={6}>
                                <InputSearch onSearch={handleSearch} defaultValue={queryParams.get('keyword') || ''} />
                            </Col>
                            <Col span={6}>
                                <Sort sortOptions={sortOptions} handleSort={handleSort} defaultValue={`${queryParams.get('sortKey') || "title"}-${queryParams.get('sortValue') || "asc"}`} />
                            </Col>
                        </Row>
                    </div>

                    <div className='roles__list'>
                        <Table columns={columns} dataSource={data} rowKey="_id" pagination={false} />
                    </div>

                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <Pagination onChange={handleChangePagination} className="pagination" align="center" defaultCurrent={queryParams.get('page')} total={totalRole} pageSize={limit} />
                        </Col>
                    </Row>
                </div>
            )}
        </>
    );
};

export default Roles;