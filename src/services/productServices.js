import { del, get, patch, post } from "../utils/request";

const objParams = {
    keyword: "",
    status: "",
    sortKey: "",
    sortValue: ""
};
export const getProducts = async (params) => {


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
    const result = await get(`products?keyword=${objParams.keyword}&status=${objParams.status}&sortKey=${objParams.sortKey}&sortValue=${objParams.sortValue}`);
    return result;
};

export const changeStatus = async (id, option) => {
    const result = await patch(`products/change-status/${id}`, option);
    return result;
};

export const deleteProduct = async (id) => {
    const result = await del(`products/delete/${id}`);
    return result;
};

export const changeMulti = async (option) => {
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