import { toast } from "react-toastify";
import {
  cancelBookingAPI,
  checkinBookingAPI,
  createBookingAPI,
  findAllBookingAPI,
  findBookedTimeSlotsAPI,
  findBookingByDateAPI,
  findBookingByIdAPI,
  payBookingAPI,
  searchBookingAPI,
  updateBookingAPI,
} from "../api/booking";
import { toZonedTime, format } from "date-fns-tz";

const createBooking = async ({
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
    const res = await createBookingAPI({
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
    const resData = res.data;
    console.log("resdata", resData);
    if (resData.statusCode === 201) {
      const data = resData.data;
      console.log("201");
      toast.success(resData.message);
      return data;
    } else {
      throw new Error(resData.message || "Đặt phòng thất bại");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Đặt phòng thất bại. Vui lòng kiểm tra lại thông tin."
    );
  }
};

const findAllBooking = async () => {
  try {
    const res = await findAllBookingAPI();
    const resData = res.data;
    console.log("resdata", resData);
    if (resData.statusCode === 200) {
      const data = resData.data;
      //   toast.success(resData.message);
      return data;
    } else {
      throw new Error(resData.message || "Không tìm thấy đơn đặt phòng");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Không tìm thấy đơn đặt phòng"
    );
  }
};

const findBookedTimeSlots = async (roomId) => {
  try {
    const res = await findBookedTimeSlotsAPI(roomId); // Gọi API để lấy danh sách thời gian đã đặt
    const resData = res.data;

    if (resData.statusCode === 200) {
      const bookedTimeSlots = resData.data; // Dữ liệu thời gian đã đặt
      return bookedTimeSlots;
    } else {
      throw new Error(resData.message || "Không tìm thấy thời gian đã đặt");
    }
  } catch (error) {
    return [];
  }
};

const findBookingById = async (bookingId) => {
  try {
    const timeZone = "Asia/Ho_Chi_Minh";
    const res = await findBookingByIdAPI(bookingId);
    const resData = res.data;

    if (resData.statusCode === 200) {
      const { room, ...booking } = resData.data;
      const { checkInDate, checkOutDate, createdAt } = booking;

      const checkInVNDate = toZonedTime(checkInDate, timeZone);
      booking.checkInDate = format(checkInVNDate, "yyyy-MM-dd HH:mm", {
        timeZone,
      });

      const checkOutVNDate = toZonedTime(checkOutDate, timeZone);
      booking.checkOutDate = format(checkOutVNDate, "yyyy-MM-dd HH:mm", {
        timeZone,
      });

      const createAtVNDate = toZonedTime(createdAt, timeZone);
      booking.createdAt = format(createAtVNDate, "yyyy/MM/dd HH:mm", {
        timeZone,
      });

      return { room, booking };
    } else {
      throw new Error(resData.message || "Không tìm thấy đơn đặt phòng");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Không tìm thấy đơn đặt phòng"
    );
  }
};

const searchBooking = async ({
  roomName = "",
  customerName = "",
  channel = "",
  status = [],
}) => {
  try {
    const customChannel = channel === "Tất cả" ? null : channel;
    console.log("----------", customChannel, roomName, channel);
    const res = await searchBookingAPI({
      roomName,
      customerName,
      channel: customChannel,
      status,
    });
    const resData = res.data;

    if (resData.statusCode === 200) {
      const data = resData.data;
      //   toast.success(resData.message);
      return data;
    } else {
      throw new Error(resData.message || "Không tìm thấy đơn đặt phòng");
    }
  } catch (error) {
    // toast.error(
    //   error.response?.data?.message || "Không tìm thấy đơn đặt phòng"
    // );
    return [];
  }
};

const updateBooking = async (data) => {
  try {
    const res = await updateBookingAPI(data);

    const resData = res.data;
    // console.log("resdata", resData);
    if (resData.statusCode === 200) {
      const data = resData.data;
      // console.log("201");
      toast.success(resData.message);
      return data;
    } else {
      throw new Error(resData.message || "Cập nhật đặt phòng thất bại");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Đặt phòng thất bại. Vui lòng kiểm tra lại thông tin."
    );
  }
};

const payBooking = async (bookingId, customerPaid) => {
  try {
    const res = await payBookingAPI(bookingId, customerPaid);

    const resData = res.data;
    // console.log("resdata", resData);
    if (resData.statusCode === 200) {
      const data = resData.data;
      // console.log("201");
      toast.success(resData.message);
      return data;
    } else {
      throw new Error(resData.message || "Lỗi thanh toán");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Lỗi thanh toán");
  }
};

const checkinBooking = async (bookingId) => {
  try {
    const res = await checkinBookingAPI(bookingId);

    const resData = res.data;
    // console.log("resdata", resData);
    if (resData.statusCode === 200) {
      const data = resData.data;
      // console.log("201");
      toast.success(resData.message);
      return data;
    } else {
      throw new Error(resData.message || "Lỗi Nhận phòng ");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Lỗi Nhận phòng ");
  }
};

const cancelBooking = async (bookingId) => {
  try {
    const res = await cancelBookingAPI(bookingId);

    const resData = res.data;
    // console.log("resdata", resData);
    if (resData.statusCode === 200) {
      const data = resData.data;
      // console.log("201");
      toast.success(resData.message);
      return data;
    } else {
      throw new Error(resData.message || "Lỗi hủy đơn");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Lỗi hủy đơn");
  }
};

const findBookingByDate = async (dates) => {
  try {
    const [from, to] = dates;
    const res = await findBookingByDateAPI(
      from.format("YYYY-MM-DD"),
      to.format("YYYY-MM-DD")
    );
    const resData = res.data;

    if (resData.statusCode === 200) {
      const data = resData.data;
      return data;
    } else {
      // throw new Error(resData.message || "Không tìm thấy đơn đặt phòng");
      return [];
    }
  } catch (error) {
    // toast.error(
    //   error.response?.data?.message || "Không tìm thấy đơn đặt phòng"
    // );
  }
};

export {
  createBooking,
  findAllBooking,
  findBookedTimeSlots,
  searchBooking,
  findBookingById,
  updateBooking,
  payBooking,
  checkinBooking,
  cancelBooking,
  findBookingByDate,
};
