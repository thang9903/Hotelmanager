import React, { use, useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import AddEmployeeModal from "../components/modal/AddEmployeeModal";
import { da, ro } from "date-fns/locale";
import { createUser, searchUser, updateUser } from "../services/user";
import { debounce } from "lodash";

export default function EmployeeManagement() {
  const [expandedRow, setExpandedRow] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [employees, setEmployees] = useState([]);

  //   const employees = [
  //     {
  //       id: 1,
  //       name: "Nguyễn Văn A",
  //       position: "Lễ tân",
  //       phone: "0901234567",
  //       email: "a.nguyen@email.com",
  //       status: "Đang làm việc",
  //       address: "123 Đường ABC, Quận 1, TP.HCM",
  //       startDate: "01/01/2023",
  //       note: "Nhân viên làm việc tốt",
  //     },
  //     {
  //       id: 2,
  //       name: "Trần Thị B",
  //       position: "Quản lý",
  //       phone: "0912345678",
  //       email: "b.tran@email.com",
  //       status: "Đã nghỉ",
  //       address: "456 Đường DEF, Quận 3, TP.HCM",
  //       startDate: "15/03/2022",
  //       note: "Đã chuyển công tác",
  //     },
  //   ];

  const [employee, setEmployee] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    status: 1,
    startDate: null,
    address: "",
    avatar: null,
    gender: "Nam",
    dateOfBirth: null,
    notes: "",
  });
  const [searchName, setSearchName] = useState(null);
  const [role, setRole] = useState(null);
  const [status, setStatus] = useState(null);

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleSaveEmployee = async () => {
    if (!isEdit) {
      const newEmp = await createUser(employee);
      if (newEmp) {
        setEmployees((prev) => [newEmp, ...prev]);
      }
    } else {
      console.log("update", employee);
      const updatedUser = await updateUser(employee);
      if (updateUser) {
        setEmployees((prev) =>
          prev.map((item) =>
            item.userId === updatedUser.userId ? updatedUser : item
          )
        );
      }
    }

    setEmployee({
      fullName: "",
      email: "",
      phone: "",
      role: "",
      status: 1,
      startDate: null,
      address: "",
      avatar: null,
      gender: "Nam",
      dateOfBirth: null,
      notes: "",
    });
  };

  const handleChangeSearchName = (e) => {
    const newValue = e.target.value;
    setSearchName(e.target.value);
    debouncedSearch(newValue, status, role);
  };

  const debouncedSearch = useCallback(
    debounce(async (searchName, status, role) => {
      try {
        const users = await searchUser({ userName: searchName, status, role });
        if (users) {
          setEmployees(users);
        } else {
          setEmployees([]);
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
      }
    }, 1000),
    []
  );

  const handleEditEmp = (emp) => {
    setEmployee(emp);
    setIsEdit(true);
    setShowAddModal(true);
  };

  const fetchUsers = async (searchName = null, status = null, role = null) => {
    try {
      const users = await searchUser({ userName: searchName, status, role });
      if (users) {
        setEmployees(users);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container room-management">
      <h2 className="text-4xl font-bold text-green-700 mb-8">
        Quản lí nhân viên
      </h2>

      <div className="flex flex-wrap gap-4 mb-8 items-end">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên..."
          value={searchName}
          onChange={(e) => handleChangeSearchName(e)}
          className="border rounded-lg px-4 py-2 flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:border-green-300 shadow-sm"
        />

        <select
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:border-green-300 shadow-sm"
          value={role}
          onChange={(e) => {
            const newValue = e.target.value === "" ? null : e.target.value;
            setRole(e.target.value);
            fetchUsers(searchName, status, newValue);
          }}
        >
          <option value="">Chức vụ</option>
          <option>Quản lý</option>
          <option>Lễ tân</option>
        </select>

        <select
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:border-green-300 shadow-sm"
          value={status}
          onChange={(e) => {
            const newValue =
              e.target.value === "" ? null : Number(e.target.value);
            setStatus(newValue);
            fetchUsers(searchName, newValue, role);
          }}
        >
          <option value="">Trạng thái</option>
          <option value={1}>Đang làm việc</option>
          <option value={0}>Đã nghỉ</option>
        </select>

        <button
          className="border-none ml-auto bg-green-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          onClick={() => setShowAddModal(true)}
        >
          + Thêm mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[calc(100vh-250px)]">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4"></th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  STT
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Họ tên
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Chức vụ
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Điện thoại
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((emp, i) => (
                <React.Fragment key={emp.userId}>
                  <tr className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleRow(i)}
                        className=" hover:text-gray-600 transition-colors duration-200 border-none"
                      >
                        {expandedRow === i ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{i + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar || "https://via.placeholder.com/40"}
                          alt={emp.fullName}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                        <span className="font-medium text-gray-800">
                          {emp.fullName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {emp.role}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {emp.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {emp.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          emp.status === 1
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {emp.status === 1 ? "Đang làm việc" : "Đã nghỉ"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditEmp(emp)}
                          title="Sửa thông tin"
                          className="p-3 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-200 border-none"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          title={
                            emp.status === 1
                              ? "Khoá tài khoản"
                              : "Mở khoá tài khoản"
                          }
                          className="p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 border-none"
                        >
                          {emp.status === 1 ? (
                            <i className="fa-solid fa-lock"></i>
                          ) : (
                            <i className="fa-solid fa-lock-open"></i>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRow === i && (
                    <tr className="bg-gray-50">
                      <td colSpan={8} className="px-6 py-6">
                        <div className="flex flex-col md:flex-row gap-8">
                          <div className="flex-shrink-0">
                            <img
                              src={
                                emp.avatar || "https://via.placeholder.com/150"
                              }
                              alt={emp.fullName}
                              className="w-32 h-32 rounded-lg object-cover border border-gray-200 shadow-sm"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                            <div className="space-y-4">
                              <div>
                                <span className="text-sm font-medium text-gray-500">
                                  Họ tên:
                                </span>
                                <p className="mt-1 text-gray-800">
                                  {emp.fullName}
                                </p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-500">
                                  Giới tính:
                                </span>
                                <p className="mt-1 text-gray-800">
                                  {emp.gender}
                                </p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-500">
                                  Email:
                                </span>
                                <p className="mt-1 text-gray-800">
                                  {emp.email}
                                </p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-500">
                                  Số điện thoại:
                                </span>
                                <p className="mt-1 text-gray-800">
                                  {emp.phone}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <span className="text-sm font-medium text-gray-500">
                                  Ngày sinh:
                                </span>
                                <p className="mt-1 text-gray-800">
                                  {emp.dateOfBirth
                                    ? new Date(
                                        emp.dateOfBirth
                                      ).toLocaleDateString("vi-VN")
                                    : "Chưa cập nhật"}
                                </p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-500">
                                  Ngày vào làm:
                                </span>
                                <p className="mt-1 text-gray-800">
                                  {emp.startDate
                                    ? new Date(
                                        emp.startDate
                                      ).toLocaleDateString("vi-VN")
                                    : "Chưa cập nhật"}
                                </p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-500">
                                  Địa chỉ:
                                </span>
                                <p className="mt-1 text-gray-800">
                                  {emp.address || "Chưa cập nhật"}
                                </p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-500">
                                  Ghi chú:
                                </span>
                                <p className="mt-1 text-gray-800">
                                  {emp.notes || "Không có"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddEmployeeModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        employee={employee}
        setEmployee={setEmployee}
        onSave={handleSaveEmployee}
      />
    </div>
  );
}
