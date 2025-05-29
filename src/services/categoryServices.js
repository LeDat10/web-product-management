import { get, post, patch, del } from "../utils/request"

export const getCategory = async (params) => {
    const result = await get(`products-category?keyword=${params.keyword}&status=${params.status}&sortKey=${params.sortKey}&sortValue=${params.sortValue}&limit=${params.limit}&page=${params.page}`);
    return result;
}

export const createCategory = async (option) => {
    const result = await post('products-category/create', option);
    return result;
};

export const changeStatusCategory = async (id, option) => {
    const result = await patch(`products-category/change-status/${id}`, option);
    return result;
};

export const changeMultiCategory = async (option) => {
    const result = await patch("products-category/change-multi", option);
    return result;
};

export const getDetailCategory = async (id) => {
    const result = await get(`products-category/detail/${id}`);
    return result;
};

export const editCategory = async (id, option) => {
    const result = await patch(`products-category/edit/${id}`, option);
    return result;
};

export const deleteCategory = async (id) => {
    const result = await del(`products-category/delete/${id}`);
    return result;
};

export const getTrashCategory = async (params) => {
    const result = await get(`products-category/trash?keyword=${params.keyword}&sortKey=${params.sortKey}&sortValue=${params.sortValue}&limit=${params.limit}&page=${params.page}`);
    return result;
};

export const restoreTrashCategory = async (option) => {
    const result = await patch(`products-category/trash/restore`, option);
    return result;
};

export const deleteTrashCategory = async (categoryId) => {
    const result = await del(`products-category/trash/delete/${categoryId}`);
    return result;
};

export const restoreMultiCategory = async (option) => {
    const result = await patch('products-category/trash/restore-multi', option);
    return result;
};