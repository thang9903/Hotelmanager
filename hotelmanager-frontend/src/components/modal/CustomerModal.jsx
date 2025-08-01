import React, { useEffect } from "react";
import "../../styles/modal/CustomerModal.css";

const CustomerModal = ({ isOpen, onClose, custommer, setCustomer }) => {
  useEffect(() => {
    console.log("customer", custommer);
  }, [custommer]);

  const handleSubmit = () => {
    // Xử lý lưu thông tin khách hàng
    onClose();
  };

  const handleCloseModal = () => {
    // setCustomer({ customerName: "", customerPhone: "", cccd: "" });
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };
  if (!isOpen) return null;
  return (
    <div className="modal-overlay customer-modal">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Thêm mới khách hàng</h2>
          <button className="modal-close" onClick={handleCloseModal}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Nội dung */}
        <div className="modal-content">
          {/* Thông tin cơ bản */}
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="customerName">Tên khách hàng</label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  className="form-input"
                  placeholder="Nhập tên khách hàng"
                  value={custommer.customerName}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  type="text"
                  id="phone"
                  name="customerPhone"
                  className="form-input"
                  placeholder="Nhập số điện thoại"
                  value={custommer.customerPhone}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="Nhập email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="birthDate">Ngày sinh</label>
                <input type="date" id="birthDate" className="form-input" />
              </div>
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="address">Căn cước công dân</label>
                <input
                  type="text"
                  id="cccd"
                  name="cccd"
                  className="form-input"
                  placeholder="Số căn cước công dân, hộ chiếu"
                  value={custommer.cccd}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="province">Tỉnh/Thành phố</label>
                <input
                  type="text"
                  id="province"
                  className="form-input"
                  placeholder="Nhập tỉnh/thành phố"
                />
              </div>
              <div className="form-group">
                <label htmlFor="district">Phường/Xã</label>
                <input
                  type="text"
                  id="district"
                  className="form-input"
                  placeholder="Nhập phường/xã"
                />
              </div>
              <div className="form-group">
                <label htmlFor="nationality">Quốc tịch</label>
                <select id="nationality" className="form-select">
                  <option value="">Chọn quốc tịch</option>
                  <option value="vietnam">Việt Nam</option>
                  <option value="usa">Mỹ</option>
                  <option value="japan">Nhật Bản</option>
                </select>
              </div>
            </div>
          </div>

          {/* Ghi chú */}
          <div className="form-section">
            <h3 className="section-title">Khác</h3>
            <div className="form-group">
              <label htmlFor="notes">Ghi chú</label>
              <textarea
                id="notes"
                className="form-textarea"
                placeholder="Nhập ghi chú..."
              ></textarea>
            </div>
            <div className="form-checkbox">
              <input
                type="checkbox"
                id="isResident"
                className="checkbox-input"
              />
              <label htmlFor="isResident">
                Khách hàng đồng thời là khách lưu trú
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Bỏ qua
          </button>
          <button className="btn-save" onClick={handleSubmit}>
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;
