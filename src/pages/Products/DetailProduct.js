import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getDetailProduct } from "../../services/productServices";
import { Button, Image } from 'antd';
import parse from "html-react-parser";

function DetailProduct() {
    const params = useParams();
    const [data, setData] = useState();

    const fetchAPI = async () => {
        const result = await getDetailProduct(params.id);
        setData(result.product);
    };


    useEffect(() => {
        fetchAPI();
    }, []);

    return (
        <>
            <div className="product__detail">
                <div className="product__header">
                    <h5 className="product__title">
                        Chi tiết sản phẩm
                    </h5>

                    <div className="product__buttons">
                        <Link to={"/admin/products"}>
                            <Button type="primary">Quay lại danh sách</Button>
                        </Link>
                    </div>
                </div>

                <div className="product__inner-detail">
                    {data && (
                        <div className="product__inner-info">
                            <div className="product__inner-title">
                                Sản phẩm: {data.title}
                            </div>

                            <div className="product__info-product">
                                <div className="product__info-header">
                                    Thông tin sản phẩm
                                </div>

                                <div className="product__inner-content">
                                    {data.status === "active" ? (
                                        <div className="margin-bottom product__status">
                                            <span className="product__label">Trạng thái:</span> <span className="product__content product__content--active">Hoạt động</span>
                                        </div>
                                    ) : (
                                        <div className="margin-bottom product__status product__status--inactive">
                                            <span className="product__label">Trạng thái:</span> <span className="product__content product__content--inactive">Dừng hoạt động</span>
                                        </div>
                                    )}

                                    <div className="margin-bottom product__price"><span className="product__label">Giá:</span> <span className="product__content">{data.price}$</span></div>
                                    <div className="margin-bottom product__discount"><span className="product__label">Giảm giá:</span> <span className="product__content">{data.discountPercentage}%</span></div>
                                    <div className="margin-bottom product__image">
                                        <Image
                                            width={200}
                                            src={data.thumbnail}
                                        />
                                    </div>

                                    <div className="margin-bottom product__featured">
                                        <span className="margin-bottom product__label">Sản phẩm nổi bật:</span> <span className="product__content">{data.featured === "1" ? "Có" : "Không"}</span>
                                    </div>

                                    <div className="margin-bottom product__stock">
                                        <span className="product__label">Số lượng sẵn có:</span> <span className="product__content">{data.stock}</span>
                                    </div>

                                    <div className="product__desc">
                                        <span className="product__label">Mô tả sản phẩm:</span>
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

export default DetailProduct;