import { del, get, patch, post } from "../utils/request"


export const getAccount = async (params) => {
    const result = await get(`accounts?sortKey=${params.sortKey}&sortValue=${params.sortValue}&limit=${params.limit}&page=${params.page}`);
    return result;
}

export const createAccount = async (option) => {
    const result = await post('accounts/create', option);
    return result;
};

export const changeStatusAccount = async (id, option) => {
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

export const login = async (option) => {
    const result = await post('accounts/login', option);
    return result;
};

export const getPermssions = async () => {
    const result = await get('accounts/get-role');
    return result;
};

export const getTrashAccount = async (params) => {
    const result = await get(`accounts/trash?sortKey=${params.sortKey}&sortValue=${params.sortValue}&limit=${params.limit}&page=${params.page}`);
    return result;
};

export const restoreTrashAccount = async (option) => {
    const result = await patch(`accounts/trash/restore`, option);
    return result;
};

export const deleteTrashAccount = async (accountId) => {
    const result = await del(`accounts/trash/delete/${accountId}`);
    return result;
};

export const restoreMultiAccount = async (option) => {
    const result = await patch('accounts/trash/restore-multi', option);
    return result;
};

export const getRoles = async () => {
    const result = await get('accounts/get-roles');
    return result;
};

export const getInfoAccount = async () => {
    const result = await get('accounts/info-account');
    return result;
};

export const logout = async () => {
    const result = await post('accounts/logout', {});
    return result;
};