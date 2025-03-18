import { Button, Col, InputNumber, Row, Table } from "antd";
import { Link } from "react-router-dom";
import './ProductsCategory.scss';
import { useEffect, useState } from "react";
import { getCategory } from "../../services/categoryServices";
import { EditOutlined } from "@ant-design/icons";
import ChangeStatus from "../../Components/ChangeStatus";
import { changeStatusCategory } from "../../services/categoryServices";
import InputSearch from "../../Components/InputSearch";
import FilterStatus from "../../Components/FilterStatus";
import Sort from "../../Components/Sort";
import { changeMultiCategory } from "../../services/categoryServices";
import ChangeMulti from "../../Components/ChangeMulti";

function ProductsCategory() {
    const [data, setData] = useState([]);
    const [reload, setReload] = useState(false);
    const [positions, setPositions] = useState({});
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const fetchAPI = async (params = {}) => {
        const result = await getCategory(params);
        setData(result.category);
    }

    useEffect(() => {
        fetchAPI();
    }, [reload]);

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
            title: "Vị trí",
            dataIndex: "position",
            key: "position",
            render: (position, record) => <InputNumber min={1} defaultValue={position} onChange={(value) => { handleChangePosition(record._id, value) }} />
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (value, record) => <ChangeStatus status={value} id={record._id} onReload={handleReload} changeStatus={changeStatusCategory} />
        },
        {
            title: "Hành động",
            key: "actions",
            render: (value, record) => (
                <>
                    <Link to={`/admin/products-category/edit/${record._id}`} className='product__button-edit'>
                        <Button type='primary' icon={<EditOutlined />}>
                            Chỉnh sửa
                        </Button>
                    </Link>
                    {/* <DeleteProduct id={record._id} onReload={handleReload} /> */}
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

    const handleSearch = (keyword) => {
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

    const handleSort = (value) => {
        const [sortKey, sortValue] = value.split("-");
        fetchAPI({
            sortKey: sortKey,
            sortValue: sortValue
        });
    };

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

    return (
        <>
            <div className="category">
                <div className="category__header">
                    <h5 className="category__title">
                        Danh mục sản phẩm
                    </h5>

                    <div className="category__buttons">
                        <Link to={"/admin/products-category/create"}>
                            <Button type='primary'>+ Thêm danh mục</Button>
                        </Link>

                        <ChangeMulti
                            changeMultiOption={changeMultiOption}
                            onReload={handleReload}
                            selectedRowKeys={selectedRowKeys}
                            getSelectedProducts={getSelectedProducts}
                            rowKeysEmpty={setRowKeysEmpty}
                            changeMulti={changeMultiCategory}
                        />
                    </div>
                </div>

                <div className='category__navigation'>
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
                    </Row>
                </div>

                <div className='category__list'>
                    <Table rowSelection={rowSelection} columns={columns} dataSource={data} rowKey="_id" />
                </div>
            </div>
        </>
    );
};

export default ProductsCategory;