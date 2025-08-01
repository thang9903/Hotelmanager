import { toast } from "react-toastify";
import {
  createServiceAPI,
  importProductAPI,
  searchServiceAPI,
  updateServiceAPI,
} from "../api/service";

const searchService = async (searchData) => {
  if (!searchData.name) {
    searchData.name = null;
  }
  if (searchData.type === "Tất cả") {
    searchData.type = null;
  }
  if (searchData.inventory === "Tất cả") {
    searchData.inventory = null;
  }
  if (searchData.status === "all") {
    searchData.status = null;
  } else if (searchData.status === "active") {
    searchData.status = 1;
  } else if (searchData.status === "inactive") {
    searchData.status = 0;
  }

  try {
    const res = await searchServiceAPI(searchData);
    const resData = res.data;
    if (resData.statusCode === 200) {
      const data = resData.data;
      return data;
    } else {
      throw new Error(resData.message || "Tìm kiếm phòng thất bại");
    }
  } catch (error) {
    // toast.error(
    //   error.response?.data?.message ||
    //     "Tìm kiếm phòng thất bại. Vui lòng kiểm tra lại thông tin."
    // );
    return [];
  }
};

const createService = async (serviceDto) => {
  const { id, ...createData } = serviceDto;
  try {
    const res = await createServiceAPI(createData);
    const resData = res.data;
    if (resData.statusCode === 201) {
      const data = resData.data;
      toast.success(resData.message);
      return data;
    } else {
      throw new Error(resData.message || "Tạo dịch vụ thất bại");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Tạo dịch vụ thất bại. Vui lòng kiểm tra lại thông tin."
    );
  }
};

const updateService = async (id, updateDto) => {
  console.log(id, updateDto);
  try {
    const res = await updateServiceAPI(id, updateDto);
    const resData = res.data;
    if (resData.statusCode === 200) {
      const data = resData.data;
      toast.success(resData.message);
      return data;
    } else {
      throw new Error(resData.message || "Cập nhật dịch vụ thất bại");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Cập nhật dịch vụ thất bại. Vui lòng kiểm tra lại thông tin."
    );
  }
};

const importProduct = async (importServices) => {
  try {
    const importServiceDto = importServices.map((item) => ({
      serviceId: item.id,
      quantity: item.quantity,
    }));
    const res = await importProductAPI(importServiceDto);
    const resData = res.data;
    if (resData.statusCode === 200) {
      const data = resData.data;
      toast.success(resData.message);
      return data;
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Nhập hàng thất bại. Vui lòng kiểm tra lại thông tin."
    );
  }
};
export { searchService, createService, updateService, importProduct };
