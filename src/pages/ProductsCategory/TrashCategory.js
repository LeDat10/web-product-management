import { Link, useLocation, useNavigate } from 'react-router-dom';
import './ProductsCategory.scss';
import { Table, Row, Col, Pagination } from 'antd';
import { useEffect, useState } from 'react';
import InputSearch from '../../Components/InputSearch';
import ChangeMulti from "../../Components/ChangeMulti";
import Sort from '../../Components/Sort';
import Delete from '../../Components/Delete';
import { useQueryParams } from '../../hooks/useQueryParams';
import Restore from '../../Components/Restore';
import { deleteTrashCategory, getTrashCategory, restoreMultiCategory, restoreTrashCategory } from '../../services/categoryServices';
import { useSelector } from 'react-redux';

function TrashCategory() {
    const [category, setCategory] = useState([]);
    const [reload, setReload] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const queryParams = useQueryParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [totalCategory, setTotalCategory] = useState(1);
    const limit = 5;

    const { permissions } = useSelector((state) => state.authAdminReducer);

    const fetchAPI = async (params = {}) => {
        const result = await getTrashCategory(params);
        if (result.code === 200) {
            setCategory(result.category);
            setTotalCategory(result.totalCategory);
        }
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

    const handleReload = () => {
        setReload(!reload);
    };

    const columns = [
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
            render: (title, record) => <Link to={`/admin/products/detail/${record._id}`} >{title}</Link>
        },
        {
            title: "Ảnh",
            dataIndex: "thumbnail",
            key: "thumbnail",
            render: (thumbnail, record) => <img src={thumbnail} alt={record.title} className='table__image' />
        },
        {
            title: "Hành động",
            key: "actions",
            render: (value, record) => (
                <>
                    <Row gutter={[10, 10]}>
                        {permissions.includes("products-category_restore") && (
                            <Col>
                                <Restore option={{ categoryId: record._id }} onReload={handleReload} functionRestore={restoreTrashCategory} />
                            </Col>
                        )}

                        {permissions.includes("products-category_delete-permanently") && (
                            <Col>
                                <Delete id={record._id} onReload={handleReload} functionDelete={deleteTrashCategory} textConfirm={"Bạn có muốn xóa sản phẩm này vĩnh viễn không?"} />
                            </Col>
                        )}
                    </Row>

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

    const changeMultiOption = [
        {
            value: '',
            label: "-- Chọn hành động --",
            disabled: true
        },
        ...(permissions.includes("products-category_restore") ? [{
            value: 'restore',
            label: "-- Khôi phục --"
        }] : []),
        ...(permissions.includes("products-category_delete-permanently") ? [{
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
            {permissions.includes("products-category_trash") && (
                <div className="category">
                    <div className="header-page">
                        <h5 className="title-page">
                            Thùng rác
                        </h5>

                        <div className="category__buttons">
                            <ChangeMulti
                                changeMultiOption={changeMultiOption}
                                onReload={handleReload}
                                selectedRowKeys={selectedRowKeys}
                                rowKeysEmpty={setRowKeysEmpty}
                                changeMulti={restoreMultiCategory}
                            />
                        </div>
                    </div>

                    <div className='category__navigation'>
                        <Row className='row-height' gutter={20} align={'middle'}>
                            <Col span={6}>
                                <InputSearch onSearch={handleSearch} defaultValue={queryParams.get('keyword') || ''} />
                            </Col>
                            <Col span={6}>
                                <Sort sortOptions={sortOptions} handleSort={handleSort} defaultValue={`${queryParams.get('sortKey') || "title"}-${queryParams.get('sortValue') || "asc"}`} />
                            </Col>
                        </Row>
                    </div>

                    <div className='category__list'>
                        <Table rowSelection={rowSelection} columns={columns} dataSource={category} rowKey="_id" />
                    </div>

                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <Pagination onChange={handleChangePagination} className="pagination" align="center" defaultCurrent={queryParams.get('page')} total={totalCategory} pageSize={limit} />
                        </Col>
                    </Row>
                </div>
            )}
        </>
    );
};

export default TrashCategory;