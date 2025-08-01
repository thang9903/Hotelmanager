import { axiosInstance } from "./config";

const createRoomAPI = async (roomName, roomTypeId) => {
  try {
    const res = await axiosInstance.post("/room/create", {
      roomName,
      roomTypeId,
    });
    return res;
  } catch (error) {
    throw error;
  }
};

const updateRoomAPI = async (roomId, updateData) => {
  try {
    const res = await axiosInstance.put(`/room/${roomId}`, updateData);
    return res;
  } catch (error) {
    throw error;
  }
};

const updateStatusRoomAPI = async (roomId, status) => {
  try {
    const res = await axiosInstance.put(`/room/${roomId}`, {
      status,
    });
    return res;
  } catch (error) {
    throw error;
  }
};

const searchRoomAPI = async (searchData, status, state) => {
  try {
    const res = await axiosInstance.get("/room/search", {
      params: {
        searchData,
        status,
        state,
      },
    });
    return res;
  } catch (error) {
    throw error;
  }
};

const findByRoomTypeAPI = async (roomTypeId, status = 1) => {
  try {
    // console.log("API", roomTypeId);
    const res = await axiosInstance.get("/room/find-by-room-type", {
      params: {
        roomTypeId,
        status,
      },
    });
    return res;
  } catch (error) {
    throw error;
  }
};

const findRoomTypeByRoomIdAPI = async (roomId) => {
  try {
    const res = await axiosInstance.get(`/room/find-room-type/${roomId}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export {
  searchRoomAPI,
  createRoomAPI,
  updateRoomAPI,
  updateStatusRoomAPI,
  findByRoomTypeAPI,
  findRoomTypeByRoomIdAPI,
};
