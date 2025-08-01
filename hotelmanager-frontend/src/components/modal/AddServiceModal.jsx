// AddServiceModal.jsx
import React from "react";
import "../../styles/modal/AddProductModal.css";
const serviceGroups = ["--Lựa chọn--", "Đồ ăn", "Đồ uống", "Dịch vụ"];
const AddServiceModal = ({ isOpen, onClose, product, setProduct, onSave }) => {
  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === "number" ? Number(value) : value;

    setProduct((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleClickSave = () => {
    onSave();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Thêm dịch vụ</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="tabs">
          <button className="tab active">Thông tin</button>
          <button className="tab">Mô tả chi tiết</button>
        </div>

        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label>Mã dịch vụ </label>
              <input placeholder="Mã hàng tự động" disabled />
            </div>

            <div className="form-group">
              <label>Tên dịch vụ</label>
              <input
                name="name"
                value={product.name}
                onChange={(e) => {
                  handleInputChange(e);
                }}
                onFocus={(e) => {
                  e.target.select();
                }}
              />
            </div>

            <div className="form-group">
              <label>Nhóm hàng</label>
              <select
                name="type"
                value={product.type}
                onChange={(e) => {
                  handleInputChange(e);
                }}
              >
                {serviceGroups.map((serviceGroup, index) => (
                  <option key={index} value={serviceGroup}>
                    {serviceGroup}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Giá vốn</label>
              <input
                name="costPrice"
                type="number"
                value={product.costPrice}
                onChange={(e) => {
                  handleInputChange(e);
                }}
                onFocus={(e) => {
                  e.target.select();
                }}
              />
            </div>

            <div className="form-group">
              <label>Giá bán</label>
              <input
                name="sellPrice"
                type="number"
                value={product.sellPrice}
                onChange={(e) => {
                  handleInputChange(e);
                }}
                onFocus={(e) => {
                  e.target.select();
                }}
              />
            </div>

            <div className="form-group">
              <label>Đơn vị</label>
              <input
                name="unit"
                value={product.unit}
                onChange={(e) => {
                  handleInputChange(e);
                }}
                onFocus={(e) => {
                  e.target.select();
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              Ghi chú
            </label>
            <textarea
              id="notes"
              name="description"
              className="input-field"
              value={product.description}
              onChange={handleInputChange}
              placeholder="Nhập ghi chú"
            ></textarea>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn cancel" onClick={onClose}>
            Hủy
          </button>
          <button className="btn save" onClick={handleClickSave}>
            Lưu
          </button>
          {/* <button className="btn save">Lưu & Thêm mới</button> */}
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal;
