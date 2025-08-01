import { axiosInstance } from "./config";
import axios from "axios";

const createUserAPI = async (userDto) => {
  try {
    const res = await axiosInstance.post("/user/create", userDto);
    return res;
  } catch (error) {
    throw error;
  }
};

const updateUserAPI = async (userId, updateDto) => {
  try {
    const res = await axiosInstance.put(`/user/${userId}`, updateDto);
    return res;
  } catch (error) {
    throw error;
  }
};

const uploadAvatarAPI = async (file) => {
  console.log(file);
  const formData = new FormData();
  formData.append("file", file);
  try {
    console.log([...formData.entries()]);

    const res = await axios.post(
      "http://localhost:3333/api/v1/user/upload-avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    console.log("Upload thành công:", res.data);
    return res; // secure_url từ Cloudinary
  } catch (error) {
    console.error("Lỗi upload:", error.res?.data || error.message);
    throw error;
  }
};

const searchUserAPI = async (userDto) => {
  try {
    const res = await axiosInstance.get("/user/search", { params: userDto });
    return res;
  } catch (error) {
    throw error;
  }
};

export { createUserAPI, uploadAvatarAPI, searchUserAPI, updateUserAPI };
