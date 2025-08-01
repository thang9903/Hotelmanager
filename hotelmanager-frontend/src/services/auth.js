import { loginApi } from "../api/auth";
import { toast } from "react-toastify";

export const login = async (userName, password) => {
  try {
    const res = await loginApi(userName, password);
    const resData = res.data;
    if (resData.statusCode === 200) {
      const data = resData.data;
      return data;
    } else {
      throw new Error("Đăng nhập thất bại");
    }
  } catch (error) {
    console.error("Login error:", JSON.stringify(error));
    const err = error.response?.data || {
      message: "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.",
    };
    console.log(err);
    toast.error(err.message);
  }
};
