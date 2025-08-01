import { toast } from "react-toastify";
import {
  createRoomAPI,
  findByRoomTypeAPI,
  findRoomTypeByRoomIdAPI,
  searchRoomAPI,
  updateRoomAPI,
  updateStatusRoomAPI,
} from "../api/room";

const createRoom = async (roomName, roomTypeId) => {
  try {
    const res = await createRoomAPI(roomName, roomTypeId);
    const resData = res.data;
    if (resData.statusCode === 201) {
      const data = resData.data;
      toast.success(resData.message);
      return data;
    } else {
      throw new Error(resData.message || "Tạo phòng thất bại");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Tạo phòng thất bại. Vui lòng kiểm tra lại thông tin."
    );
  }
};

const updateRoom = async (roomId, updateData) => {
  try {
    const res = await updateRoomAPI(roomId, updateData);
    const resData = res.data;
    if (resData.statusCode === 200) {
      const data = resData.data;
      toast.success(resData.message);
      return data;
    } else {
      throw new Error(resData.message || "Cập nhật phòng thất bại");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Cập nhật phòng thất bại. Vui lòng kiểm tra lại thông tin."
    );
  }
};

const updateStatusRoom = async (roomId, status) => {
  try {
    const res = await updateStatusRoomAPI(roomId, status);
    const resData = res.data;
    if (resData.statusCode === 200) {
      const data = resData.data;
      toast.success(resData.message);
      return data;
    } else {
      throw new Error(resData.message || "Cập nhật trạng thái phòng thất bại");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Cập nhật trạng thái phòng thất bại. Vui lòng kiểm tra lại thông tin."
    );
  }
};

const searchRoom = async (searchData, status, state) => {
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
    const res = await searchRoomAPI(searchData, status, state);
    const resData = res.data;
    if (resData.statusCode === 200) {
      const data = resData.data;
      return data;
    } else {
      throw new Error(resData.message || "Tìm kiếm phòng thất bại");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Tìm kiếm phòng thất bại. Vui lòng kiểm tra lại thông tin."
    );
  }
};

const findByRoomType = async (roomTypeId, status = 1) => {
  try {
    // console.log("service::", roomTypeId);
    const res = await findByRoomTypeAPI(roomTypeId, status);
    const resData = res.data;
    if (resData.statusCode === 200) {
      const data = resData.data;
      return data;
    } else {
      throw new Error(resData.message || "Tìm kiếm phòng thất bại");
    }
  } catch (error) {
    return [];
  }
};

const findRoomTypeByRoomId = async (roomId) => {
  try {
    const res = await findRoomTypeByRoomIdAPI(roomId);
    const resData = res.data;
    if (resData.statusCode === 200) {
      const data = resData.data;
      return data;
    } else {
      throw new Error(resData.message || "Tìm kiếm loại phòng thất bại");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Tìm kiếm loại phòng thất bại. "
    );
  }
};

export {
  searchRoom,
  createRoom,
  updateRoom,
  updateStatusRoom,
  findByRoomType,
  findRoomTypeByRoomId,
};
