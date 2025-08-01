import { axiosInstance } from "./config";

const getRevenueAPI = async () => {
  try {
    const res = await axiosInstance.get(`/booking/get-revenue`);
    return res;
  } catch (error) {
    throw error;
  }
};

const getCountBookingAPI = async () => {
  try {
    const res = await axiosInstance.get(`/booking/get-count-booking`);
    return res;
  } catch (error) {
    throw error;
  }
};

const getServiceTypeSoldAPI = async () => {
  try {
    const res = await axiosInstance.get(
      `/booking-service/get-count-service-by-type`
    );
    return res;
  } catch (error) {
    throw error;
  }
};

const getTop5ServiceAPI = async () => {
  try {
    const res = await axiosInstance.get(`/booking-service/get-top5-service`);
    return res;
  } catch (error) {
    throw error;
  }
};

const getCountBookingByChannelAPI = async () => {
  try {
    const res = await axiosInstance.get(`/booking/get-count-by-channel`);
    return res;
  } catch (error) {
    throw error;
  }
};

export {
  getRevenueAPI,
  getCountBookingAPI,
  getServiceTypeSoldAPI,
  getTop5ServiceAPI,
  getCountBookingByChannelAPI,
};
