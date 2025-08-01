import { ro } from "date-fns/locale";
import { axiosInstance } from "./config";

const createRoomTypeAPI = async (
  roomTypeName,
  priceByDay,
  priceByHour,
  priceOvernight
) => {
  try {
    const res = await axiosInstance.post("/room-type/create", {
      roomTypeName,
      priceByDay,
      priceByHour,
      priceOvernight,
    });
    return res;
  } catch (error) {
    throw error;
  }
};

const updateRoomTypeAPI = async (
  roomTypeId,
  roomTypeName,
  priceByDay,
  priceByHour,
  priceOvernight
) => {
  try {
    const res = await axiosInstance.put(`/room-type/${roomTypeId}`, {
      roomTypeName,
      priceByDay,
      priceByHour,
      priceOvernight,
    });
    return res;
  } catch (error) {
    throw error;
  }
};

const updateStatusRoomTypeAPI = async (roomTypeId, status) => {
  try {
    const res = await axiosInstance.put(`/room-type/${roomTypeId}`, {
      status,
    });
    return res;
  } catch (error) {
    throw error;
  }
};

const searchRoomTypeAPI = async (searchData, status) => {
  try {
    const res = await axiosInstance.get("/room-type/search", {
      params: {
        searchData,
        status,
      },
    });
    return res;
  } catch (error) {
    throw error;
  }
};

const findAllAPI = async () => {
  try {
    const res = await axiosInstance.get("/room-type");
    return res;
  } catch (error) {
    throw error;
  }
};

export {
  createRoomTypeAPI,
  searchRoomTypeAPI,
  updateRoomTypeAPI,
  findAllAPI,
  updateStatusRoomTypeAPI,
};
