import axios from "axios";

const API_DOMAIN = "http://localhost:5000/api/";

export const get = async(path) => {
    const response = await axios.get(API_DOMAIN + path);
    const result = response.data;
    return result;
};

export const patch = async(path, option) => {
    const response = await axios.patch(API_DOMAIN + path, option);
    const result = response.data;
    return result;
};

export const del = async(path) => {
    const response = await axios.delete(API_DOMAIN + path);
    const result = response.data;
    return result;
};

export const post = async(path, option) => {
    const response = await axios.post(API_DOMAIN + path, option);
    const result = response.data;
    return result;
};