import React, { useCallback, useEffect, useState } from "react";
import "../styles/ServiceManagement.css";
import RoomTypeModal from "../components/modal/RoomTypeModal";
import {
  createRoomType,
  searchRoomType,
  updateRoomType,
} from "../services/room-type";
import { debounce } from "lodash";

import {
  createService,
  searchService,
  updateService,
} from "../services/service";
import AddProductModal from "../components/modal/AddProductModal";
import AddServiceModal from "../components/modal/AddServiceModal";
import ImportProductModal from "../components/modal/ImportProductModal";
const serviceGroups = [
  { name: "Tất cả", icon: "fa-solid fa-border-all" },
  { name: "Dịch vụ", icon: "fa-solid fa-hand-holding-heart" },
  { name: "Đồ ăn", icon: "fa-solid fa-utensils" },
  { name: "Đồ uống", icon: "fa-solid fa-mug-hot" },
];

const InventoryStatus = [
  { name: "Tất cả", icon: "fa-solid fa-border-all" },
  { name: "Hết hàng trong kho", icon: "fa-solid fa-box-open" },
  { name: "Còn hàng trong kho", icon: "fa-solid fa-boxes-stacked" },
  { name: "Dưới định mức", icon: "fa-solid fa-truck-ramp-box" },
];
const ServiceManagement = () => {
  const [tab, setTab] = useState(0);
  const [searchData, setSearchData] = useState("");
  const [status, setStatus] = useState("active");
  const [branch, setBranch] = useState("Chi nhánh trung tâm");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRoomTypeModalOpen, setIsRoomTypeModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [services, setServices] = useState([]);
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

  const [openGroupServices, setOpenGroupServices] = useState(false);
  const [openInventoryServices, setOpenInventoryServices] = useState(false);
  const [isOpenImportModal, setIsOpenImportModal] = useState(false);
  const [product, setProduct] = useState({
    id: "",
    name: "",
    type: "",
    unit: "",
    sellPrice: 0,
    costPrice: 0,
    quantityInStock: null,
    minimumStock: null,
    description: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [selectedServiceGroup, setSelectedServiceGroup] = useState("Tất cả");
  const [searchServiceName, setSearchServiceName] = useState(null);
  const [selectedInventoty, setSelectInventory] =
    useState("Còn hàng trong kho");

  const handleChangeStatusProduct = (id, status) => {
    setIsConfirmDialogOpen(true);
    console.log("productId::::", id, status);
    setProduct((prev) => ({ ...prev, id, status }));
  };

  const handleEditProduct = (product) => {
    console.log("Chỉnh sửa product:", product);
    setProduct({ ...product });
    setIsEdit(true);
    if ((product.type = "Dịch vụ")) {
      setIsServiceModalOpen(true);
    } else {
      setIsProductModalOpen(true);
    }
  };

  const handleSaveProduct = async () => {
    console.log("Dữ liệu mới:", product);
    if (!isEdit) {
      const newProduct = await createService(product);
      if (newProduct) {
        setServices((prev) => [newProduct, ...prev]);
      }
    } else {
      console.log("update room");
      const updatedProduct = await updateService(product.id, product);

      if (updatedProduct) {
        setServices((prev) =>
          prev.map((item) =>
            item.id === updatedProduct.id ? updatedProduct : item
          )
        );
      }
    }
    setProduct({
      id: "",
      name: "",
      type: "",
      unit: "",
      sellPrice: 0,
      costPrice: 0,
      quantityInStock: null,
      minimumStock: null,
      description: "",
    });
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

  const updateStatus = async () => {
    const updatedProduct = await updateService(product.id, {
      status: product.status === 1 ? 0 : 1,
    });

    if (updatedProduct) {
      setServices((prev) =>
        prev.map((item) =>
          item.id === updatedProduct.id ? updatedProduct : item
        )
      );

      setProduct({
        id: "",
        name: "",
        type: "",
        unit: "",
        sellPrice: 0,
        costPrice: 0,
        quantityInStock: null,
        minimumStock: null,
        description: "",
      });
    }
  };

  const handleConfirmChangeStatus = () => {
    updateStatus();
    setIsConfirmDialogOpen(false);
  };

  const handleAddNew = (type) => {
    if (type === "product") {
      console.log("Thêm SP");
      setIsProductModalOpen(true); // Mở modal thêm hạng phòng
      // Logic thêm phòng
    } else if (type === "service") {
      // console.log("Thêm loại phòng");
      setIsServiceModalOpen(true); // Mở modal thêm hạng phòng
    }
    setIsDropdownOpen(false);
  };

  const debouncedSearch = useCallback(
    debounce(async (name, type, inventory, status) => {
      try {
        const services = await searchService({ name, type, inventory, status });

        setServices(services);

        console.log("Kết quả tìm kiếm:", services);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
      }
    }, 1000),
    []
  );

  const handleChangeSearchName = (e) => {
    const newValue = e.target.value;
    setSearchServiceName(e.target.value);
    debouncedSearch(newValue, selectedServiceGroup, selectedInventoty, status);
  };

  const handleChangeStatus = (e) => {
    const newValue = e.target.value;
    setStatus(newValue);
    fetchServices(
      searchServiceName,
      selectedServiceGroup,
      selectedInventoty,
      newValue
    );
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

  const fetchServices = async (name, type, inventory, status) => {
    const services = await searchService({ name, type, inventory, status });
    setServices(services);
  };
  useEffect(() => {
    if (!isOpenImportModal) {
      fetchRoomTypes(searchData, status);
      fetchServices(
        searchServiceName,
        selectedServiceGroup,
        selectedInventoty,
        status
      );
    }
  }, [isOpenImportModal]);

  return (
    <div className="container service-management">
      <h2 style={{ paddingBottom: "16px" }}>Hàng hóa & dịch vụ</h2>

      <div className="filter-section">
        <input
          type="text"
          placeholder="Lọc theo tên dịch vụ"
          value={searchServiceName}
          onChange={(e) => handleChangeSearchName(e)}
          className="filter-input"
        />
        <div className="service-group-dropdown">
          <div
            className="group-selected"
            onClick={() => setOpenGroupServices(!openGroupServices)}
          >
            <i
              className={
                serviceGroups.find((ch) => ch.name === selectedServiceGroup)
                  ?.icon
              }
            ></i>
            <span>{selectedServiceGroup}</span>
          </div>
          {openGroupServices && (
            <div className="channel-options">
              {serviceGroups.map((serviceGroup) => (
                <div
                  key={serviceGroup.name}
                  className="channel-option"
                  onClick={() => {
                    setSelectedServiceGroup(serviceGroup.name);
                    fetchServices(
                      searchServiceName,
                      serviceGroup.name,
                      selectedInventoty,
                      status
                    );
                    setOpenGroupServices(false);
                  }}
                >
                  <i className={serviceGroup.icon}></i>
                  <span>{serviceGroup.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="service-group-dropdown">
          <div
            className="group-selected"
            onClick={() => setOpenInventoryServices(!openInventoryServices)}
          >
            <i
              className={
                InventoryStatus.find((ch) => ch.name === selectedInventoty)
                  ?.icon
              }
            ></i>
            <span>{selectedInventoty}</span>
          </div>
          {openInventoryServices && (
            <div className="channel-options">
              {InventoryStatus.map((inventory) => (
                <div
                  key={inventory.name}
                  className="channel-option"
                  onClick={() => {
                    setSelectInventory(inventory.name);
                    fetchServices(
                      searchServiceName,
                      selectedServiceGroup,
                      inventory.name,
                      status
                    );
                    setOpenInventoryServices(false);
                  }}
                >
                  <i className={inventory.icon}></i>
                  <span>{inventory.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* <div
          className="add-button-container"
          style={{ marginLeft: "auto" }}
        ></div> */}

        <div className="add-button-container" style={{ marginLeft: "auto" }}>
          <button
            className="import-button"
            style={{ backgroundColor: "#1976d2" }}
            onClick={() => setIsOpenImportModal(!isOpenImportModal)}
          >
            + Nhập hàng
          </button>
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
                onClick={() => handleAddNew("product")}
              >
                + Thêm hàng hóa
              </button>
              <button
                className="dropdown-item"
                onClick={() => handleAddNew("service")}
              >
                + Thêm dịch vụ
              </button>
            </div>
          )}
        </div>
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

      <div className="tab-header"></div>

      <table className="data-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên Hàng</th>
            <th>Nhóm hàng</th>
            <th>Giá bán</th>
            <th>Giá vốn</th>
            <th>Tồn kho</th>
            <th>Định mức tồn ít nhất</th>
            <th>Đơn vị</th>
            <th>Trạng thái</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {services.map((service, idx) => (
            <tr key={service.id}>
              <td>{idx + 1}.</td>

              <td>{service.name}</td>
              <td>{service.type}</td>
              <td>{service.sellPrice ? service.sellPrice : "---"}</td>
              <td>{service.costPrice ? service.costPrice : "---"}</td>
              <td>
                {service.quantityInStock ? service.quantityInStock : "---"}
              </td>
              <td style={{ textAlign: "center" }}>
                {service.minimumStock ? service.minimumStock : "---"}
              </td>
              <td>{service.unit ? service.unit : "---"} </td>
              <td>
                {service.status === 1 ? "Đang kinh doanh" : "Ngừng kinh doanh"}
              </td>
              <td>
                <button
                  className="action-button edit-button"
                  onClick={() => handleEditProduct(service)}
                >
                  <i className="fas fa-edit"></i> {/* Icon Edit */}
                </button>
                <button
                  className="action-button delete-button"
                  onClick={() =>
                    handleChangeStatusProduct(service.id, service.status)
                  }
                >
                  {service.status === 1 ? (
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

      {isConfirmDialogOpen && (
        <div className="confirm-dialog">
          <div className="dialog-content">
            <p>Bạn có chắc chắn muốn thay đổi trạng thái của sản phẩm </p>
            <div className="dialog-actions">
              <button
                className="cancel-button"
                onClick={() => setIsConfirmDialogOpen(false)}
              >
                Hủy
              </button>
              <button
                className="confirm-button"
                onClick={() => handleConfirmChangeStatus()}
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

      <AddProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        product={product}
        setProduct={setProduct}
      />

      <AddServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        onSave={handleSaveProduct}
        product={product}
        setProduct={setProduct}
      />

      <ImportProductModal
        isOpen={isOpenImportModal}
        onClose={() => setIsOpenImportModal(false)}
      />
    </div>
  );
};

export default ServiceManagement;
