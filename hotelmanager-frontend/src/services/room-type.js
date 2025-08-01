import { toast } from "react-toastify";
import {
  createRoomTypeAPI,
  searchRoomTypeAPI,
  updateRoomTypeAPI,
  updateStatusRoomTypeAPI,
} from "../api/room-type";

const createRoomType = async (
  roomTypeName,
  priceByDay,
  priceByHour,
  priceOvernight
) => {
  try {
    const res = await createRoomTypeAPI(
      roomTypeName,
      priceByDay,
      priceByHour,
      priceOvernight
    );
    const resData = res.data;
    if (resData.statusCode === 201) {
      const data = resData.data;
      toast.success(resData.message);
      return data;
    } else {
      throw new Error(resData.message || "Tạo loại phòng thất bại");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Tạo loại phòng thất bại. Vui lòng kiểm tra lại thông tin."
    );
  }
};

const updateRoomType = async (
  roomTypeId,
  roomTypeName,
  priceByDay,
  priceByHour,
  priceOvernight
) => {

  try {
    const res = await updateRoomTypeAPI(
      roomTypeId,
      roomTypeName,
      priceByDay,
      priceByHour,
      priceOvernight
    );
    const resData = res.data;
    if (resData.statusCode === 200) {
      const data = resData.data;
      toast.success(resData.message);
      return data;
    } else {
      throw new Error(resData.message || "Tạo loại phòng thất bại");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Tạo loại phòng thất bại. Vui lòng kiểm tra lại thông tin."
    );
  }
};

const updateStatusRoomType = async (roomTypeId, status) => {
  try {
    const res = await updateStatusRoomTypeAPI(roomTypeId, status);
    const resData = res.data;
    if (resData.statusCode === 200) {
      const data = resData.data;
      toast.success(resData.message);
      return data;
    } else {
      throw new Error(
        resData.message || "Cập nhật trạng thái loại phòng thất bại"
      );
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Cập nhật trạng thái loại phòng thất bại. Vui lòng kiểm tra lại thông tin."
    );
  }
};

const searchRoomType = async (searchData, status) => {

  if (!searchData) {
    searchData = null;
  }
  if (status === "all") {
    status = null;
  } else if (status === "active") {
    status = 1;
  } else if (status === "inactive") {
    status = 0;
  }

  try {
    const res = await searchRoomTypeAPI(searchData, status);
    const resData = res.data;
    if (resData.statusCode === 200) {
      const data = resData.data;
      return data;
    } else {
      throw new Error(resData.message || "Tìm kiếm loại phòng thất bại");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Tìm kiếm loại phòng thất bại. Vui lòng kiểm tra lại thông tin."
    );
  }
};

const findAllRoomType = async () => {
  try {
    const res = await searchRoomTypeAPI();
    const resData = res.data;
    if (resData.statusCode === 200) {
      const data = resData.data;
      return data;
    } else {
      throw new Error(resData.message || "Tìm kiếm loại phòng thất bại");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Tìm kiếm loại phòng thất bại. Vui lòng kiểm tra lại thông tin."
    );
  }
};
export {
  createRoomType,
  searchRoomType,
  updateRoomType,
  findAllRoomType,
  updateStatusRoomType,
};
