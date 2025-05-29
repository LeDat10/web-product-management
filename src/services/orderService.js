import { del, get, patch } from "../utils/request";

export const getOrders = async(params) => {
    const result = await get(`order?orderId=${params.keyword}&limit=${params.limit}&page=${params.page}&status=${params.status}`);
    return result;
};

export const changeMultiOrder = async (option) => {
    const result = await patch("order/change-multi", option);
    return result;
};

export const detailOrder = async (orderId) => {
    const result = await get(`order/detail/${orderId}`);
    return result;
};

export const getTrashOrder = async (params) => {
    const result = await get(`order/trash?keyword=${params.keyword}&limit=${params.limit}&page=${params.page}`);
    return result;
};

export const restoreTrashOrder = async (option) => {
    const result = await patch(`order/trash/restore`, option);
    return result;
};

export const deleteTrashOrder = async (orderId) => {
    const result = await del(`order/trash/delete/${orderId}`);
    return result;
};

export const restoreMultiOrder = async (option) => {
    const result = await patch('order/trash/restore-multi', option);
    return result;
};