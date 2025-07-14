import axios from "axios";
import Cookies from "js-cookie";
import { tokenExpiredAccount } from "../actions/auth";
import store from "../store";

const API_DOMAIN =
  "https://api-project-product-management.vercel.app/api/admin/";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const EXCLUDED_URLS = ["accounts/login"];

axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");

  // Kiểm tra URL có trong danh sách loại trừ không
  const isExcluded = EXCLUDED_URLS.some((url) => config.url.includes(url));

  if (token && !isExcluded) {
    config.headers.authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Interceptor cho response
axiosInstance.interceptors.response.use(
  (response) => {
    // Trường hợp server trả về code 401 trong dữ liệu
    if (response?.data?.code === 401) {
      store.dispatch(tokenExpiredAccount());
    }
    return response;
  },
  (error) => {
    // Trường hợp response lỗi 401 từ status code
    if (error?.response?.status === 401) {
      // console.log("Token hết hạn (status 401)");
      store.dispatch(tokenExpiredAccount());
    }
    return Promise.reject(error);
  }
);

export const get = async (path) => {
  const response = await axiosInstance.get(API_DOMAIN + path);
  const result = response.data;
  return result;
};

export const patch = async (path, option) => {
  const response = await axiosInstance.patch(API_DOMAIN + path, option);
  const result = response.data;
  return result;
};

export const del = async (path) => {
  const response = await axiosInstance.delete(API_DOMAIN + path);
  const result = response.data;
  return result;
};

export const post = async (path, option) => {
  const response = await axiosInstance.post(API_DOMAIN + path, option);
  const result = response.data;
  return result;
};
