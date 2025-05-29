
import { del, get, patch, post } from "../utils/request"


export const getRoles = async (params) => {
    const result = await get(`roles?keyword=${params.keyword}&sortKey=${params.sortKey}&sortValue=${params.sortValue}&limit=${params.limit}&page=${params.page}`);
    return result;
};

export const createRoles = async(option) => {
    const result = await post('roles/create', option);
    return result;
};

export const deleteRole = async(id) => {
    const result = await del(`roles/delete/${id}`);
    return result;
};

export const editRole = async (id, option) => {
    const result = await patch(`roles/edit/${id}`, option);
    return result;
};

export const getDetailRole = async(id) => {
    const result = await get(`roles/detail/${id}`);
    return result;
};

export const setPermissions = async(option) => {
    const result = await patch('roles/permissions', option);
    return result;
};

export const getTrashRole = async (params) => {
    const result = await get(`roles/trash?keyword=${params.keyword}&sortKey=${params.sortKey}&sortValue=${params.sortValue}&limit=${params.limit}&page=${params.page}`);
    return result;
};

export const restoreTrashRole = async (option) => {
    const result = await patch(`roles/trash/restore`, option);
    return result;
};

export const deleteTrashRole = async (roleId) => {
    const result = await del(`roles/trash/delete/${roleId}`);
    return result;
};

export const restoreMultiRole = async (option) => {
    const result = await patch('roles/trash/restore-multi', option);
    return result;
};