import { del, get, patch, post } from "../utils/request";

export const getProducts = async (params) => {
    const result = await get(`products?keyword=${params.keyword}&status=${params.status}&sortKey=${params.sortKey}&sortValue=${params.sortValue}&categoryId=${params.category}&page=${params.page}&limit=${params.limit}`);
    return result;
};

export const changeStatusProduct = async (id, option) => {
    const result = await patch(`products/change-status/${id}`, option);
    return result;
};

export const deleteProduct = async (id) => {
    const result = await del(`products/delete/${id}`);
    return result;
};

export const changeMultiProduct = async (option) => {
    const result = await patch("products/change-multi", option);
    return result;
};

export const createProduct = async (option) => {
    const result = await post("products/create", option);
    return result;
};

export const getDetailProduct = async (id) => {
    const result = await get(`products/detail/${id}`);
    return result;
};

export const editProduct = async (id, option) => {
    const result = await patch(`products/edit/${id}`, option);
    return result;
};

export const getTrashProduct = async (params) => {
    const result = await get(`products/trash?keyword=${params.keyword}&sortKey=${params.sortKey}&sortValue=${params.sortValue}&limit=${params.limit}&page=${params.page}`);
    return result;
};

export const restoreTrashProduct = async (option) => {
    const result = await patch(`products/trash/restore`, option);
    return result;
};

export const deleteTrashProduct = async (productId) => {
    const result = await del(`products/trash/delete/${productId}`);
    return result;
};

export const restoreMultiProduct = async (option) => {
    const result = await patch('products/trash/restore-multi', option);
    return result;
};

export const getCategoryProduct = async() => {
    const result = await get("products/category");
    return result;
}