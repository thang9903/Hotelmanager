import { axiosInstance } from "./config";

const createBookingAPI = async ({
  customerName,
  customerPhone,
  cccd,
  roomId,
  type,
  status,
  checkInDate,
  checkOutDate,
  unitPrice,
  totalPrice,
  depositAmount,
  channel,
}) => {
  try {
    const res = axiosInstance.post("/booking/create", {
      customerName,
      customerPhone,
      cccd,
      roomId,
      type,
      status,
      checkInDate,
      checkOutDate,
      unitPrice,
      totalPrice,
      depositAmount,
      channel,
    });

    return res;
  } catch (err) {
    throw err;
  }
};

// const updateBookingAPI = async ({})

const findAllBookingAPI = async () => {
  try {
    const res = axiosInstance.get("/booking");
    return res;
  } catch (err) {
    throw err;
  }
};

const findBookedTimeSlotsAPI = async (roomId) => {
  try {
    const res = axiosInstance.get(`/booking/booked-time-slots/${roomId}`);
    return res;
  } catch (err) {
    throw err;
  }
};

const findBookingByIdAPI = async (bookingId) => {
  try {
    const res = axiosInstance.get(`/booking/${bookingId}`);
    return res;
  } catch (err) {
    throw err;
  }
};

const searchBookingAPI = async ({
  roomName,
  customerName,
  channel,
  status,
}) => {
  try {
    const res = axiosInstance.get("/booking/search", {
      params: { roomName, customerName, channel, status },
    });
    return res;
  } catch (err) {
    throw err;
  }
};

const updateBookingAPI = async (data) => {
  try {
    const res = await axiosInstance.put(`/booking/${data.bookingId}`, data);
    return res;
  } catch (err) {
    throw err;
  }
};

const payBookingAPI = async (bookingId, customerPaid) => {
  try {
    const res = await axiosInstance.post(`/booking/${bookingId}/pay`, {
      customerPaid,
    });
    return res;
  } catch (err) {
    throw err;
  }
};

const checkinBookingAPI = async (bookingId) => {
  try {
    const res = await axiosInstance.post(`/booking/${bookingId}/checkin`);
    return res;
  } catch (err) {
    throw err;
  }
};

const cancelBookingAPI = async (bookingId) => {
  try {
    const res = await axiosInstance.delete(`/booking/${bookingId}/cancel`);
    return res;
  } catch (err) {
    throw err;
  }
};

const findBookingByDateAPI = async (from, too) => {
  try {
    const res = await axiosInstance.get("/booking/get-booking-by-date", {
      params: { from, too },
    });
    return res;
  } catch (err) {
    throw err;
  }
};

export {
  createBookingAPI,
  findAllBookingAPI,
  findBookedTimeSlotsAPI,
  searchBookingAPI,
  findBookingByIdAPI,
  updateBookingAPI,
  payBookingAPI,
  checkinBookingAPI,
  cancelBookingAPI,
  findBookingByDateAPI,
};
