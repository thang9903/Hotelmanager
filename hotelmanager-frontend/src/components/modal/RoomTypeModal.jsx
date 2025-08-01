import React from "react";
import "../../styles/modal/RoomTypeModal.css";

const RoomTypeModal = ({ roomType, setRoomType, onClose, onSave }) => {
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setRoomType((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  return (
    <div className="modal-overlay room-type-modal">
      <div className="modal">
        <h3>Thêm hạng phòng</h3>
        <div className="modal-body">
          <div className="form-group">
            <label>Mã hạng phòng</label>
            <input
              type="text"
              value={roomType.code}
              readOnly
              className="input-field"
              placeholder="Mã phòng tự động"
            />
          </div>
          <div className="form-group">
            <label>Tên hạng phòng</label>
            <input
              type="text"
              name="roomTypeName"
              value={roomType.roomTypeName}
              className="input-field"
              placeholder="Nhập tên hạng phòng"
              onChange={handleInputChange}
              tabIndex={1}
            />
          </div>
          <div className="form-group">
            <label>Giá giờ</label>
            <input
              type="number"
              name="priceByHour"
              value={roomType.priceByHour}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Nhập giá giờ"
              onFocus={handleFocus}
              tabIndex={2}
            />
          </div>
          <div className="form-group">
            <label>Giá cả ngày</label>
            <input
              type="number"
              name="priceByDay"
              value={roomType.priceByDay}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Nhập giá cả ngày"
              onFocus={handleFocus}
              tabIndex={3}
            />
          </div>
          <div className="form-group">
            <label>Giá qua đêm</label>
            <input
              type="number"
              name="priceOvernight"
              value={roomType.priceOvernight}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Nhập giá qua đêm"
              onFocus={handleFocus}
              tabIndex={4}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="cancel-button"
            onClick={() => {
              setRoomType({
                roomTypeName: "",
                priceByDay: 0,
                priceByHour: 0,
                priceOvernight: 0,
              });
              onClose();
            }}
          >
            Hủy
          </button>
          <button className="save-button" onClick={onSave}>
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomTypeModal;
