import axios from "axios";
import { toast } from "react-toastify";

// Axios instance mặc định
export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
  withCredentials: true,
});

// Chỉ cho phép 1 refresh token request cùng lúc
let refreshPromise = null;

// Hàm gọi API refresh token
const requestTokenAPI = async () => {
  return axiosInstance.post("/auth/refresh");
};

// Hàm logout user
const logoutUserAPI = async () => {
  try {
    await axiosInstance.post("/v1/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    // const token = "mnn";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor cho axiosInstance
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401: Unauthorized -> logout luôn
    if (error.response?.status === 401) {
      await logoutUserAPI();
      localStorage.clear();
      window.location.href = "/login";
      toast.error("Vui lòng đăng nhập lại.");
      return Promise.reject(error);
    }

    // // 410: Token hết hạn, cần refresh
    // if (error.response?.status === 410 && !originalRequest._retry) {
    //   originalRequest._retry = true;

    //   if (!refreshPromise) {
    //     refreshPromise = requestTokenAPI()
    //       .then(() => axiosInstance(originalRequest)) // Thử lại request cũ
    //       .catch(async (err) => {
    //         await logoutUserAPI();
    //         localStorage.clear();
    //         window.location.href = "/";
    //         toast.error("Phiên đăng nhập đã hết hạn.");
    //         return Promise.reject(err);
    //       })
    //       .finally(() => {
    //         refreshPromise = null;
    //       });
    //   }

    //   return refreshPromise;
    // }

    // const errMsg = error.response?.data?.message || "Có lỗi xảy ra!";
    // toast.error(errMsg);
    // return Promise.reject(error);
  }
);
