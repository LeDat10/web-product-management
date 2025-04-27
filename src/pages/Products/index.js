import { Link } from 'react-router-dom';
import './Products.scss';
import { Button, Table, InputNumber, Row, Col, Select, Tag } from 'antd';
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from 'react';
import { getProducts } from '../../services/productServices';
import InputSearch from '../../Components/InputSearch';
import ChangeMulti from "../../Components/ChangeMulti";
import FilterStatus from '../../Components/FilterStatus';
import Sort from '../../Components/Sort';
import ChangeStatus from '../../Components/ChangeStatus';
import { changeStatusProduct } from '../../services/productServices';
import { changeMultiProduct } from '../../services/productServices';
import { getCategory } from '../../services/categoryServices';
import Delete from '../../Components/Delete';
import { deleteProduct } from '../../services/productServices';
import useAuth from '../../helper/useAuth';
import moment from 'moment';

function Products() {
    const [data, setData] = useState([]);
    const [reload, setReload] = useState(false);
    const [positions, setPositions] = useState({});
    const [category, setCategory] = useState([]);

    const permissions = useAuth();

    const fetchAPI = async (params = {}) => {
        const result = await getProducts(params);
        setData(result.products);
    };

    const fetchCategoryAPI = async () => {
        const result = await getCategory({ status: "active" });
        setCategory(result.category);
    };

    const handleReload = () => {
        setReload(!reload);
    };

    useEffect(() => {
        fetchAPI();
    }, [reload]);

    useEffect(() => {
        fetchCategoryAPI();
    }, []);

    const categoryOpitons = [
        {
            value: "",
            label: "-- Danh mục --",
        },
        ...category.map(item => ({
            value: item._id,
            label: `-- ${item.title} --`
        }))
    ];

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
            title: "Giá",
            dataIndex: "price",
            key: "price",
            render: (price) => <p>{price}$</p>
        },
        {
            title: "Vị trí",
            dataIndex: "position",
            key: "position",
            render: (position, record) => <InputNumber min={1} defaultValue={position} onChange={(value) => { handleChangePosition(record._id, value) }} />
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (value, record) => (
                <>
                    {permissions.includes('products_edit') ? (
                        <ChangeStatus status={value} id={record._id} onReload={handleReload} changeStatus={changeStatusProduct} />
                    ) : (
                        value === "active" ? (
                            <Tag color='success'>Hoạt động</Tag>
                        ) : (
                            <Tag color='error'>Dừng hoạt động</Tag>
                        )
                    )}
                </>
            )
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
                    {permissions.includes('products_edit') && (
                        <Link to={`/admin/products/edit/${record._id}`} className='product__button-edit'>
                            <Button type='primary' icon={<EditOutlined />}>
                                Chỉnh sửa
                            </Button>
                        </Link>
                    )}
                    {permissions.includes('products_delete') && (
                        <Delete id={record._id} onReload={handleReload} functionDelete={deleteProduct} textConfirm={"Bạn có muốn xóa sản phẩm này không?"} />
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
            value: 'position',
            label: "-- Thay đổi vị trí --"
        },
        {
            value: 'delete-all',
            label: "-- Xóa tất cả --"
        }
    ];

    const sortOptions = [
        {
            value: "position-desc",
            label: "-- Vị trí giảm dần --"
        },
        {
            value: "position-asc",
            label: "-- Vị trí tăng dần --"
        },
        {
            value: "title-asc",
            label: "-- Tiêu đề từ A - Z --"
        },
        {
            value: "title-desc",
            label: "-- Tiêu đề từ Z -A --"
        },
        {
            value: "price-desc",
            label: "-- Giá giảm dần --"
        },
        {
            value: "price-asc",
            label: "-- Giá tăng dần --"
        }
    ];

    // const [searchParams, setSearchParams] = useSearchParams();

    const handleSearch = (keyword) => {
        // const newParams = new URLSearchParams(searchParams);
        // if (!keyword) {
        //     newParams.delete("keyword");
        //     setSearchParams(newParams);
        //     handleReload();
        // } else {
        //     newParams.set("keyword", keyword);
        //     setSearchParams(newParams);
        //     const urlParams = new URLSearchParams(window.location.search);
        //     const currentParams = Object.fromEntries(urlParams.entries());
        //     fetchAPI(currentParams);
        // };

        if (keyword) {
            fetchAPI({
                keyword: keyword
            });
        } else {
            fetchAPI({
                keyword: ""
            });
        };
    };

    const handleChangeStatus = (status) => {
        if (status === "all") {
            fetchAPI({
                status: ""
            });
        } else {
            fetchAPI({
                status: status
            });
        };
    };

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys) => {
            setSelectedRowKeys(selectedKeys);
        },
    };

    const handleChangePosition = (key, value) => {
        setPositions(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const getSelectedProducts = () => {
        const selectedProducts = selectedRowKeys.map(key => {
            const position = positions[key];
            return `${key}-${position}`;
        });
        return selectedProducts;
    };

    const setRowKeysEmpty = () => {
        setSelectedRowKeys([]);
    };

    const handleSort = (value) => {
        const [sortKey, sortValue] = value.split("-");
        fetchAPI({
            sortKey: sortKey,
            sortValue: sortValue
        });
    };

    const handleChangeCategory = (value) => {
        fetchAPI({
            categoryId: value
        });
    }

    return (
        <>
            {permissions.includes('products_view') && (
                <div className="product">
                    <div className="product__header">
                        <h5 className="product__title">
                            Danh sách sản phẩm
                        </h5>

                        <div className="product__buttons">
                            {permissions.includes('products_create') && (
                                <Link to={"/admin/products/create"}>
                                    <Button type='primary'>+ Thêm sản phẩm</Button>
                                </Link>
                            )}

                            {permissions.includes('products_edit') && (
                                <ChangeMulti
                                    changeMultiOption={changeMultiOption}
                                    onReload={handleReload}
                                    selectedRowKeys={selectedRowKeys}
                                    getSelectedProducts={getSelectedProducts}
                                    rowKeysEmpty={setRowKeysEmpty}
                                    changeMulti={changeMultiProduct}
                                />
                            )}
                        </div>
                    </div>

                    <div className='product__navigation'>
                        <Row className='row-height' gutter={20} align={'middle'}>
                            <Col span={6}>
                                <InputSearch onSearch={handleSearch} />
                            </Col>
                            <Col span={6}>
                                <FilterStatus filterStatusOptions={filterStatusOptions} handleChangeStatus={handleChangeStatus} />
                            </Col>
                            <Col span={6}>
                                <Sort sortOptions={sortOptions} handleSort={handleSort} />
                            </Col>
                            <Col span={6}>
                                <Select className='product__filter-category' options={categoryOpitons} defaultValue={""} onChange={handleChangeCategory} />
                            </Col>
                        </Row>
                    </div>

                    <div className='product__list'>
                        <Table rowSelection={rowSelection} columns={columns} dataSource={data} rowKey="_id" />
                    </div>
                </div>
            )}
        </>
    );
};

export default Products;