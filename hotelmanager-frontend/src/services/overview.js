import { toast } from "react-toastify";
import {
  getCountBookingAPI,
  getCountBookingByChannelAPI,
  getCountServiceByTypeAPI,
  getRevenueAPI,
  getServiceTypeSoldAPI,
  getTop5ServiceAPI,
} from "../api/overview";

const getRevenue = async () => {
  try {
    const res = await getRevenueAPI();
    const resData = res.data;
    console.log("resdata", resData);
    if (resData.statusCode === 200) {
      const data = resData.data;
      //   toast.success(resData.message);
      return data;
    } else {
      throw new Error(resData.message || "Đặt phòng thất bại");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || " Vui lòng kiểm tra lại thông tin."
    );
  }
};

const getCountBooking = async () => {
  try {
    const res = await getCountBookingAPI();
    const resData = res.data;
    console.log("resdata", resData);
    if (resData.statusCode === 200) {
      const data = resData.data;
      //   toast.success(resData.message);
      return data;
    } else {
      throw new Error(resData.message || "Đặt phòng thất bại");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || " Vui lòng kiểm tra lại thông tin."
    );
  }
};

const getServiceTypeSold = async () => {
  try {
    const res = await getServiceTypeSoldAPI();
    const resData = res.data;
    console.log("resdata", resData);
    if (resData.statusCode === 200) {
      const data = resData.data;
      //   toast.success(resData.message);
      return data;
    } else {
      throw new Error(resData.message || "Đặt phòng thất bại");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || " Vui lòng kiểm tra lại thông tin."
    );
  }
};

const getTop5Service = async () => {
  try {
    const res = await getTop5ServiceAPI();
    const resData = res.data;
    if (resData.statusCode === 200) {
      const data = resData.data;
      //   toast.success(resData.message);
      return data;
    } else {
      throw new Error(resData.message || "Đặt phòng thất bại");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || " Vui lòng kiểm tra lại thông tin."
    );
  }
};

const getCountBookingByChannel = async () => {
  try {
    const res = await getCountBookingByChannelAPI();
    const resData = res.data;
    if (resData.statusCode === 200) {
      const data = resData.data;
      //   toast.success(resData.message);
      return data;
    } else {
      throw new Error(resData.message || "Đặt phòng thất bại");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || " Vui lòng kiểm tra lại thông tin."
    );
  }
};

export {
  getRevenue,
  getCountBooking,
  getServiceTypeSold,
  getTop5Service,
  getCountBookingByChannel,
};
