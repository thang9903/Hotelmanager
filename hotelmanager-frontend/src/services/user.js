import { toast } from "react-toastify";
import {
  createUserAPI,
  searchUserAPI,
  updateUserAPI,
  uploadAvatarAPI,
} from "../api/user";

const createUser = async (userDto) => {
  try {
    const res = await createUserAPI(userDto);
    const resData = res.data;
    if (resData.statusCode === 201) {
      const data = resData.data;
      toast.success(resData.message);
      return data;
    } else {
      throw new Error(resData.message || "Thêm nhân viên thất bại");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Vui lòng kiểm tra lại thông tin."
    );
  }
};

const updateUser = async (userDto) => {
  const { userId, ...updateDto } = userDto;

  try {
    const res = await updateUserAPI(userId, updateDto);
    const resData = res.data;
    if (resData.statusCode === 200) {
      const data = resData.data;
      toast.success(resData.message);
      return data;
    } else {
      throw new Error(resData.message || "Cập nhật thất bại");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Vui lòng kiểm tra lại thông tin."
    );
  }
};

const uploadAvatar = async (file) => {
  try {
    const res = await uploadAvatarAPI(file);
    const resData = res.data;
    if (resData.statusCode === 200) {
      const data = resData.data;
      //   toast.success(resData.message);
      return data;
    } else {
      throw new Error(resData.message || "thất bại");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Vui lòng kiểm tra lại thông tin."
    );
  }
};

const searchUser = async (userDto) => {
  try {
    const res = await searchUserAPI(userDto);
    const resData = res.data;
    if (resData.statusCode === 200) {
      const data = resData.data;
      // toast.success(resData.message);
      return data;
    } else {
      throw new Error(resData.message || "");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Vui lòng kiểm tra lại thông tin."
    );
    return [];
  }
};
export { createUser, uploadAvatar, searchUser, updateUser };
