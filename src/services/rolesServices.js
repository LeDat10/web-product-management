
import { del, get, patch, post } from "../utils/request"


export const getRoles = async () => {
    const result = await get('roles');
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