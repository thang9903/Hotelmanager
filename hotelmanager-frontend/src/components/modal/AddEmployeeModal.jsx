import { assign } from "lodash";
import React, { useEffect, useState } from "react";
import { uploadAvatar } from "../../services/user";
import Loader from "../Loader";

export default function AddEmployeeModal({
  show,
  onClose,
  employee,
  setEmployee,
  onSave,
}) {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const saveAvatar = async () => {
    if (avatarFile) {
      setLoading(true);
      const res = await uploadAvatar(avatarFile);
      if (res) {
        employee.avatar = res.url;
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveAvatar(); // Đợi upload xong và set avatar
    onSave(); // Gọi sau khi avatar đã được set
    setAvatarPreview(null);
    onClose();
  };

  const handleClose = () => {
    setAvatarPreview(null);
    onClose(); // Close the modal after submitting
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file && file.size > 100 * 1024 * 1024) {
        alert("Ảnh vượt quá 2MB. Vui lòng chọn ảnh nhỏ hơn.");
        return;
      }

      setAvatarPreview(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  useEffect(() => {
    if (show) {
      setAvatarPreview(employee.avatar);
      console.log("llllll", employee);
    }
  }, [show]);
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      {loading && <Loader />}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8 relative border border-green-100">
        <h3 className="text-2xl font-bold text-green-700 mb-6">
          Thêm nhân viên mới
        </h3>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Avatar & Notes */}
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="w-40 h-40 rounded-full border-4 border-gray-100 overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                        <i className="fas fa-user text-4xl"></i>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <i className="fas fa-camera text-white text-2xl"></i>
                  </div>
                </div>

                <label className="relative cursor-pointer bg-white hover:bg-gray-50 border-2 border-dashed border-gray-200 px-6 py-3 rounded-xl text-sm text-gray-600 font-medium text-center w-full transition-all duration-200 hover:border-green-500 hover:text-green-600">
                  <i className="fas fa-upload mr-2"></i>
                  Chọn ảnh
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  rows="4"
                  placeholder="Nhập ghi chú nếu cần..."
                  name="notes"
                  value={employee.notes}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                ></textarea>
              </div>
            </div>

            {/* Form fields column */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">Họ tên</label>
                <input
                  type="text"
                  placeholder="Nhập họ tên"
                  name="fullName"
                  value={employee.fullName}
                  onChange={handleInputChange}
                  className="border rounded-lg px-4 py-2 focus:ring-2 focus:border-green-300 focus:outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">
                  Chức vụ
                </label>
                <select
                  className="border  rounded-lg px-4 py-2 focus:ring-2 focus:border-green-300 focus:outline-none"
                  name="role"
                  value={employee.role}
                  onChange={handleInputChange}
                >
                  <option value="">Chọn chức vụ</option>
                  <option>Quản lý</option>
                  <option>Lễ tân</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="border  rounded-lg px-4 py-2 focus:ring-2 focus:border-green-300 focus:outline-none"
                  name="email"
                  value={employee.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">
                  Điện thoại
                </label>
                <input
                  type="text"
                  placeholder="0123456789"
                  className="border  rounded-lg px-4 py-2 focus:ring-2 focus:border-green-300 focus:outline-none"
                  name="phone"
                  value={employee.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">
                  Trạng thái
                </label>
                <select
                  className="border  rounded-lg px-4 py-2 focus:ring-2 focus:border-green-300 focus:outline-none"
                  name="status"
                  value={employee.status}
                  onChange={handleInputChange}
                >
                  <option value={1}>Đang làm việc</option>
                  <option value={0}>Đã nghỉ</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">
                  Ngày vào làm
                </label>
                <input
                  type="date"
                  className="border  rounded-lg px-4 py-2 focus:ring-2 focus:border-green-300 focus:outline-none"
                  name="startDate"
                  value={employee.startDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  className="border rounded-lg px-4 py-2 focus:ring-2 focus:border-green-300 focus:outline-none"
                  name="dateOfBirth"
                  value={employee.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">
                  Giới tính
                </label>
                <select
                  className="border  rounded-lg px-4 py-2 focus:ring-2 focus:border-green-300 focus:outline-none"
                  name="gender"
                  value={employee.gender}
                  onChange={handleInputChange}
                >
                  <option value={"Nam"}>Nam</option>
                  <option value={"Nữ"}>Nữ</option>
                  <option value={"Khác"}>Khác</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  placeholder="123 Đường ABC, Quận X"
                  name="address"
                  value={employee.address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Buttons full width */}
          <div className="md:col-span-2 flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="border-none px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              className=" border-none px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 shadow"
            >
              Lưu
            </button>
          </div>
        </form>

        <button
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all duration-200"
          onClick={handleClose}
          aria-label="Đóng modal"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
}
