import { get, post, patch, del } from "../utils/request"

const objParams = {
    keyword: "",
    status: "",
    sortKey: "",
    sortValue: ""
};
export const getCategory = async(params) => {
    if (params.keyword) {
        objParams.keyword = params.keyword;
    } else if (params.keyword === "") {
        objParams.keyword = ""
    }
    
    if (params.status) {
        objParams.status = params.status;
    } else if (params.status === "") {
        objParams.status = "";
    }

    if(params.sortKey && params.sortValue) {
        objParams.sortKey = params.sortKey;
        objParams.sortValue = params.sortValue;
    } else {
        objParams.sortKey = "";
        objParams.sortValue = "";
    };
    const result = await get(`products-category?keyword=${objParams.keyword}&status=${objParams.status}&sortKey=${objParams.sortKey}&sortValue=${objParams.sortValue}`);
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
}