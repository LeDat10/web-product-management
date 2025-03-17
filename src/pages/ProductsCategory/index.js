import { Button } from "antd";
import { Link } from "react-router-dom";
import './ProductsCategory.scss';

function ProductsCategory() {
    return(
        <>
            <div className="products-category">
                <div className="products-category__header">
                <h5 className="product__title">
                        Danh mục sản phẩm
                    </h5>

                    <div className="product__buttons">
                        <Link to={"/admin/products-category/create"}>
                            <Button type='primary'>+ Thêm sản phẩm</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductsCategory;