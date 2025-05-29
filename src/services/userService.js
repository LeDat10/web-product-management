import { del, get, patch } from "../utils/request";

export const getUser = async (params) => {
    const result = await get(`user?status=${params.status}&limit=${params.limit}&page=${params.page}&sortKey=${params.sortKey}&sortValue=${params.sortValue}`);
    return result;
};

export const changeStatusUser = async (id, option) => {
    const result = await patch(`user/change-status/${id}`, option);
    return result;
};

export const changeMultiUser = async (option) => {
    const result = await patch("user/change-multi", option);
    return result;
};

export const deleteUser = async (id) => {
    const result = await del(`user/delete/${id}`);
    return result;
};

export const getDetailUser = async (id) => {
    const result = await get(`user/detail/${id}`);
    return result;
};

export const getTrashUser = async (params) => {
    const result = await get(`user/trash?sortKey=${params.sortKey}&sortValue=${params.sortValue}&limit=${params.limit}&page=${params.page}`);
    return result;
};

export const restoreTrashUser = async (option) => {
    const result = await patch(`user/trash/restore`, option);
    return result;
};

export const deleteTrashUser = async (userId) => {
    const result = await del(`user/trash/delete/${userId}`);
    return result;
};

export const restoreMultiUser = async (option) => {
    const result = await patch('user/trash/restore-multi', option);
    return result;
};