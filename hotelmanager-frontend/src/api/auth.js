import { axiosInstance } from "./config";

const loginApi = async (userName, password) => {
  try {
    const res = await axiosInstance.post("/auth/login", { userName, password });
    return res;
  } catch (error) {
    throw error;
  }
};

export { loginApi };
