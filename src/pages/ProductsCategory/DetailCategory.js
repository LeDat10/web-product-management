import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getDetailCategory } from "../../services/categoryServices";
import { Button, Image } from 'antd';
import parse from "html-react-parser";

function DetailCategory() {
    const params = useParams();
    const [data, setData] = useState();

    const fetchAPI = async () => {
        const result = await getDetailCategory(params.id);
        setData(result.category);
    };

    useEffect(() => {
        fetchAPI();
    }, []);
    return (
        <>
            <div className="category__detail">
                <div className="category__header">
                    <h5 className="category__title">
                        Chi tiết danh mục
                    </h5>

                    <div className="category__buttons">
                        <Link to={"/admin/products"}>
                            <Button type="primary">Quay lại danh sách</Button>
                        </Link>
                    </div>
                </div>

                <div className="category__inner-detail">
                    {data && (
                        <div className="category__inner-info">
                            <div className="category__inner-title">
                                Danh mục: {data.title}
                            </div>

                            <div className="category__info-category">
                                <div className="category__info-header">
                                    Thông tin danh mục
                                </div>

                                <div className="category__inner-content">
                                    {data.status === "active" ? (
                                        <div className="margin-bottom category__status">
                                            <span className="category__label">Trạng thái:</span> <span className="category__content category__content--active">Hoạt động</span>
                                        </div>
                                    ) : (
                                        <div className="margin-bottom category__status category__status--inactive">
                                            <span className="category__label">Trạng thái:</span> <span className="category__content category__content--inactive">Dừng hoạt động</span>
                                        </div>
                                    )}
                                    <div className="margin-bottom category__image">
                                        <Image
                                            width={200}
                                            src={data.thumbnail}
                                        />
                                    </div>

                                    <div className="category__desc">
                                        <span className="category__label">Mô tả danh mục:</span>
                                        <span>{parse(data.description)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DetailCategory;