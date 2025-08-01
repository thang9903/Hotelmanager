import React, { useCallback, useEffect, useState } from "react";
import "../styles/RoomManagementPage.css";
import RoomTypeModal from "../components/modal/RoomTypeModal";
import RoomModal from "../components/modal/RoomModal";
import {
  createRoomType,
  searchRoomType,
  updateRoomType,
  updateStatusRoomType,
} from "../services/room-type";
import { debounce } from "lodash";
import {
  createRoom,
  searchRoom,
  updateRoom,
  updateStatusRoom,
} from "../services/room";

const RoomManagement = () => {
  const [tab, setTab] = useState(0);
  const [searchData, setSearchData] = useState("");
  const [status, setStatus] = useState("active");
  const [branch, setBranch] = useState("Chi nhánh trung tâm");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRoomTypeModalOpen, setIsRoomTypeModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [roomData, setRoomData] = useState([]);
  const [roomTypeData, setRoomTypeData] = useState([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const [roomType, setRoomType] = useState({
    roomTypeId: "",
    roomTypeName: "",
    priceByDay: 0,
    priceByHour: 0,
    priceOvernight: 0,
    status: 1,
  });

  const [room, setRoom] = useState({
    roomId: "",
    roomName: "",
    roomTypeId: "",
  });
  const [isEdit, setIsEdit] = useState(false);

  const handleEditRoomType = (roomType) => {
    console.log("Chỉnh sửa phòng:", roomType);
    setRoomType({ ...roomType });
    setIsEdit(true);
    setIsRoomTypeModalOpen(true);
  };

  const handleChangeStatusRoomType = (roomTypeId, status) => {
    setIsConfirmDialogOpen(true);
    setRoomType((prev) => ({ ...prev, roomTypeId, status }));
  };

  const handleChangeStatusRoom = (roomId, status) => {
    setIsConfirmDialogOpen(true);
    console.log("room::::", roomId, status);
    setRoom((prev) => ({ ...prev, roomId, status }));
  };

  const handleEditRoom = (room) => {
    console.log("Chỉnh sửa phòng:", room);
    setRoom({ ...room });
    setIsEdit(true);
    setIsRoomModalOpen(true);
  };

  const handleSaveRoom = async () => {
    console.log("Dữ liệu phòng mới:", room);
    if (!isEdit) {
      const newRoom = await createRoom(room.roomName, room.roomTypeId);
      if (newRoom) {
        setRoomData((prev) => [newRoom, ...prev]);
      }
    } else {
      console.log("update room");
      const updatedRoom = await updateRoom(room.roomId, {
        roomName: room.roomName,
        roomTypeId: room.roomTypeId,
      });

      if (updatedRoom) {
        setRoomData((prev) =>
          prev.map((item) =>
            item.roomId === updatedRoom.roomId ? updatedRoom : item
          )
        );
      }
    }
    setRoom({ roomId: "", roomName: "", roomTypeId: "" });
  };

  const handleSave = async () => {
    console.log("Hạng phòng mới:", roomType);
    if (!isEdit) {
      const newRoomType = await createRoomType(
        roomType.roomTypeName,
        roomType.priceByDay,
        roomType.priceByHour,
        roomType.priceOvernight
      );

      if (newRoomType) {
        setRoomTypeData((prev) => [newRoomType, ...prev]);
      }
    } else {
      console.log("update");
      const updatedRoomType = await updateRoomType(
        roomType.roomTypeId,
        roomType.roomTypeName,
        roomType.priceByDay,
        roomType.priceByHour,
        roomType.priceOvernight
      );
      if (updatedRoomType) {
        setRoomTypeData((prev) =>
          prev.map((item) =>
            item.roomTypeId === updatedRoomType.roomTypeId
              ? updatedRoomType
              : item
          )
        );
      }
    }
    setRoomType({
      roomTypeName: "",
      priceByDay: 0,
      priceByHour: 0,
      priceOvernight: 0,
    });
    setIsRoomTypeModalOpen(false); // Đóng modal sau khi lưu
  };

  const updateStatus = async (type) => {
    if (type == "room-type") {
      const updatedRoomType = await updateStatusRoomType(
        roomType.roomTypeId,
        roomType.status === 1 ? 0 : 1
      );

      if (updatedRoomType) {
        setRoomTypeData((prev) =>
          prev.map((item) =>
            item.roomTypeId === updatedRoomType.roomTypeId
              ? updatedRoomType
              : item
          )
        );
      }

      setRoomType({
        roomTypeName: "",
        priceByDay: 0,
        priceByHour: 0,
        priceOvernight: 0,
      });
    } else {
      console.log("update rooom", room.roomId, room.status);
      const updatedRoom = await updateStatusRoom(
        room.roomId,
        room.status === 1 ? 0 : 1
      );

      if (updatedRoom) {
        setRoomData((prev) =>
          prev.map((item) =>
            item.roomId === updatedRoom.roomId ? updatedRoom : item
          )
        );
      }

      setRoom({ roomId: "", roomName: "", roomTypeId: "" });
    }
  };

  const handleConfirmChangeStatus = (type) => {
    updateStatus(type);
    setIsConfirmDialogOpen(false);
  };

  const handleAddNew = (type) => {
    if (type === "room") {
      console.log("Thêm phòng");
      setIsRoomModalOpen(true); // Mở modal thêm hạng phòng
      // Logic thêm phòng
    } else if (type === "roomType") {
      console.log("Thêm loại phòng");
      setIsRoomTypeModalOpen(true); // Mở modal thêm hạng phòng
    }
    setIsDropdownOpen(false); // Đóng menu sau khi chọn
  };

  const debouncedSearch = useCallback(
    debounce(async (searchValue, statusValue, tabActive) => {
      try {
        console.log("tab", tabActive);
        if (tabActive === 0) {
          const roomTypes = await searchRoomType(searchValue, statusValue);
          if (roomTypes) {
            setRoomTypeData(roomTypes);
          } else {
            setRoomTypeData([]);
          }
          console.log("Kết quả tìm kiếm:", roomTypes);
        } else {
          const rooms = await searchRoom(searchValue, statusValue);
          if (rooms) {
            setRoomData(rooms);
          } else {
            setRoomData([]);
          }
          console.log("Kết quả tìm kiếm:", rooms);
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
      }
    }, 1000),
    []
  );

  const handleChangeSearchData = (e) => {
    const newValue = e.target.value;
    setSearchData(e.target.value);
    debouncedSearch(newValue, status, tab);
  };

  const handleChangeStatus = (e) => {
    const newValue = e.target.value;
    setStatus(newValue);
    console.log("Tab:", tab);
    if (tab === 0) {
      fetchRoomTypes(searchData, newValue);
    } else {
      fetchRooms(searchData, newValue);
    }
  };

  const fetchRoomTypes = async (search, status) => {
    const roomTypes = await searchRoomType(search, status);
    if (roomTypes) {
      console.log("roomTypes");
      setRoomTypeData(roomTypes);
    } else {
      setRoomTypeData([]);
    }
  };

  const fetchRooms = async (search, status) => {
    const rooms = await searchRoom(search, status);
    if (rooms) {
      setRoomData(rooms);
    } else {
      setRoomData([]);
    }
  };
  useEffect(() => {
    fetchRoomTypes(searchData, status);
    fetchRooms(searchData, status);
  }, []);

  return (
    <div className="container room-management">
      <h2>Hạng phòng & Phòng</h2>

      <div className="filter-row">
        <input
          type="text"
          placeholder="Tìm kiếm phòng/hạng phòng"
          className="search-input"
          value={searchData}
          onChange={(e) => handleChangeSearchData(e)}
        />
        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="select-input"
        >
          <option value="Chi nhánh trung tâm">Chi nhánh trung tâm</option>
          <option value="Chi nhánh khác">Chi nhánh khác</option>
        </select>
      </div>

      <div className="radio-group">
        <label>
          <input
            type="radio"
            value="active"
            checked={status === "active"}
            onChange={(e) => handleChangeStatus(e)}
          />{" "}
          Đang kinh doanh
        </label>
        <label>
          <input
            type="radio"
            value="inactive"
            checked={status === "inactive"}
            onChange={(e) => handleChangeStatus(e)}
          />{" "}
          Ngừng kinh doanh
        </label>
        <label>
          <input
            type="radio"
            value="all"
            checked={status === "all"}
            onChange={(e) => handleChangeStatus(e)}
          />{" "}
          Tất cả
        </label>
      </div>

      <div className="tab-header">
        <div className="tabs">
          <button
            className={tab === 0 ? "tab active" : "tab"}
            onClick={() => setTab(0)}
          >
            Hạng phòng
          </button>
          <button
            className={tab === 1 ? "tab active" : "tab"}
            onClick={() => setTab(1)}
          >
            Danh sách phòng
          </button>
        </div>
        <div className="add-button-container">
          <button
            className="add-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            + Thêm mới
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button
                className="dropdown-item"
                onClick={() => handleAddNew("roomType")}
              >
                + Thêm loại phòng
              </button>
              <button
                className="dropdown-item"
                onClick={() => handleAddNew("room")}
              >
                + Thêm phòng
              </button>
            </div>
          )}
        </div>
      </div>

      {tab === 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên hạng phòng</th>
              <th>Giá giờ</th>
              <th>Giá cả ngày</th>
              <th>Giá qua đêm</th>
              <th>Trạng thái</th>
              <th>Chi nhánh</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {roomTypeData.map((roomType, idx) => (
              <tr key={roomType.roomTypeId}>
                <td>{idx + 1}.</td>
                <td>{roomType.roomTypeName}</td>
                <td>{roomType.priceByHour}</td>
                <td>{roomType.priceByDay}</td>
                <td>{roomType.priceOvernight}</td>
                <td>
                  {roomType.status === 1
                    ? "Đang kinh doanh"
                    : "Ngừng kinh doanh"}
                </td>
                <td>{branch}</td>
                <td>
                  <button
                    className="action-button edit-button"
                    onClick={() => handleEditRoomType(roomType)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="action-button delete-button"
                    onClick={() =>
                      handleChangeStatusRoomType(
                        roomType.roomTypeId,
                        roomType.status
                      )
                    }
                  >
                    {roomType.status === 1 ? (
                      <i class="fa-solid fa-lock"></i>
                    ) : (
                      <i
                        class="fa-solid fa-lock-open"
                        style={{ color: "#1976d2" }}
                      ></i>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên phòng</th>
              <th>Loại phòng</th>
              <th>Giá giờ</th>
              <th>Giá cả ngày</th>
              <th>Giá qua đêm</th>
              <th>Trạng thái</th>
              <th>Chi nhánh</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {roomData.map((room, idx) => (
              <tr key={room.roomId}>
                <td>{idx + 1}.</td>

                <td>{room.roomName}</td>
                <td>{room.roomType.roomTypeName}</td>
                <td>{room.roomType.priceByHour}</td>
                <td>{room.roomType.priceByDay}</td>
                <td>{room.roomType.priceOvernight}</td>
                <td>
                  {room.status === 1 ? "Đang kinh doanh" : "Ngừng kinh doanh"}
                </td>
                <td>{branch}</td>
                <td>
                  <button
                    className="action-button edit-button"
                    onClick={() => handleEditRoom(room)}
                  >
                    <i className="fas fa-edit"></i> {/* Icon Edit */}
                  </button>
                  <button
                    className="action-button delete-button"
                    onClick={() =>
                      handleChangeStatusRoom(room.roomId, room.status)
                    }
                  >
                    {room.status === 1 ? (
                      <i class="fa-solid fa-lock"></i>
                    ) : (
                      <i
                        class="fa-solid fa-lock-open"
                        style={{ color: "#1976d2" }}
                      ></i>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isConfirmDialogOpen && (
        <div className="confirm-dialog">
          <div className="dialog-content">
            <p>Bạn có chắc chắn muốn thay đổi trạng thái của hạng phòng </p>
            <div className="dialog-actions">
              <button
                className="cancel-button"
                onClick={() => setIsConfirmDialogOpen(false)}
              >
                Hủy
              </button>
              <button
                className="confirm-button"
                onClick={() =>
                  handleConfirmChangeStatus(tab === 0 ? "room-type" : "room")
                }
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {isRoomTypeModalOpen && (
        <RoomTypeModal
          roomType={roomType}
          setRoomType={setRoomType}
          onClose={() => setIsRoomTypeModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {isRoomModalOpen && (
        <RoomModal
          isOpen={isRoomModalOpen}
          room={room}
          setRoom={setRoom}
          onClose={() => setIsRoomModalOpen(false)}
          onSave={handleSaveRoom}
        />
      )}
    </div>
  );
};

export default RoomManagement;
