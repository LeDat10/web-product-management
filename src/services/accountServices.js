import { del, get, patch, post } from "../utils/request"


export const getAccount = async() => {
    const result = await get('accounts');
    return result;
}

export const createAccount = async(option) => {
    const result = await post('accounts/create', option);
    return result;
};

export const changeStatusAccount = async(id, option) => {
    const result = await patch(`accounts/change-status/${id}`, option);
    return result;
};

export const deleteAccount = async (id) => {
    const result = await del(`accounts/delete/${id}`);
    return result;
};

export const getDetailAccount = async (id) => {
    const result = await get(`accounts/detail/${id}`);
    return result;
};

export const editAccount = async (id, option) => {
    const result = await patch(`accounts/edit/${id}`, option);
    return result;
};

export const login = async(option) => {
    const result = await post('accounts/login', option);
    return result;
};

export const getPermssions = async() => {
    const result = await get('accounts/get-role');
    return result;
};