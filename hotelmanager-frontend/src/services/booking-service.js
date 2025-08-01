import { toast } from "react-toastify";
import {
  createBookingItemAPI,
  deleteBookingItemAPI,
  findBookingItemByDateAPI,
  findItemByBookingAPI,
  updateBookingItemAPI,
} from "../api/booking-item";

const createBookingItem = async (createDto) => {
  try {
    const res = await createBookingItemAPI(createDto);
    const resData = res.data;
    if (resData.statusCode === 201) {
      const data = resData.data;
      console.log("201");
      //   toast.success(resData.message);
      return data;
    } else {
      throw new Error(resData.message || "Đặt thất bại");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Vui lòng kiểm tra lại thông tin."
    );
  }
};

const updateBookingItem = async (id, updateDto) => {
  try {
    const res = await updateBookingItemAPI(id, updateDto);
    const resData = res.data;
    if (resData.statusCode === 200) {
      //   toast.success(resData.message || "Cập nhật thành công");
      return resData.data;
    } else {
      throw new Error(resData.message || "Cập nhật thất bại");
    }
  } catch (error) {
    toast.error(
      error?.response?.data?.message || error?.message || "Đã xảy ra lỗi"
    );
  }
};

const getBookingItemsByBooking = async (bookingId) => {
  try {
    const res = await findItemByBookingAPI(bookingId);
    const resData = res.data;
    if (resData.statusCode === 200) {
      return resData.data;
    } else {
      throw new Error(resData.message || "Không lấy được danh sách dịch vụ");
    }
  } catch (error) {
    // toast.error(
    //   error?.response?.data?.message || error?.message || "Đã xảy ra lỗi"
    // );
    return [];
  }
};

const removeBookingItem = async (bookingItemId) => {
  try {
    const res = await deleteBookingItemAPI(bookingItemId);
    const resData = res.data;
    if (resData.statusCode === 200) {
      //   toast.success(resData.message || "Xóa thành công");
      return resData.data;
    } else {
      throw new Error(resData.message || "Xóa thất bại");
    }
  } catch (error) {
    toast.error(
      error?.response?.data?.message || error?.message || "Đã xảy ra lỗi"
    );
  }
};

const findBookingItemByDate = async (dates) => {
  try {
    const [from, to] = dates;
    const res = await findBookingItemByDateAPI(
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
  createBookingItem,
  updateBookingItem,
  getBookingItemsByBooking,
  removeBookingItem,
  findBookingItemByDate,
};
