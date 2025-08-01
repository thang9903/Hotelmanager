import React, { useState, useEffect } from "react";
import "../../styles/modal/ImportProductModal.css";
import { importProduct, searchService } from "../../services/service";

const ImportProductModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("Đồ ăn");
  const [products, setProducts] = useState([]);
  const [importItems, setImportItems] = useState([]);

  const productTypes = [
    { name: "Đồ ăn", icon: "fa-solid fa-utensils" },
    { name: "Đồ uống", icon: "fa-solid fa-mug-hot" },
  ];

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedType]);

  const fetchProducts = async () => {
    const result = await searchService({
      name: searchQuery,
      type: selectedType === "Tất cả" ? "" : selectedType,
      status: 1,
    });
    setProducts(result);
  };

  const handleAddToImport = (product) => {
    const existingItem = importItems.find((item) => item.id === product.id);
    if (existingItem) {
      setImportItems(
        importItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setImportItems([
        ...importItems,
        {
          id: product.id,
          name: product.name,
          type: product.type,
          unit: product.unit,
          quantity: 1,
        },
      ]);
    }
  };

  const handleRemoveFromImport = (productId) => {
    setImportItems(importItems.filter((item) => item.id !== productId));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      setImportItems(
        importItems.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }

    console.log(importItems);
  };

  const handleSave = async () => {
    // onSave(importItems);
    const result = await importProduct(importItems);
    if (result) {
      setImportItems([]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="import-product-modal">
        <div className="modal-header">
          <h2>Nhập hàng hóa</h2>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <div className="search-section">
            <div className="search-bar">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Tìm kiếm hàng hóa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="type-filter">
              {productTypes.map((type) => (
                <button
                  key={type.name}
                  className={`type-button ${
                    selectedType === type.name ? "active" : ""
                  }`}
                  onClick={() => setSelectedType(type.name)}
                >
                  <i className={type.icon}></i>
                  <span>{type.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="content-section">
            <div className="products-list">
              <h3>Danh sách hàng hóa</h3>
              <div className="products-grid">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="product-card"
                    onClick={() => handleAddToImport(product)}
                  >
                    <i
                      className={
                        product.type === "Dịch vụ"
                          ? "fa-solid fa-hand-holding-heart"
                          : product.type === "Đồ ăn"
                          ? "fa-solid fa-utensils"
                          : "fa-solid fa-mug-hot"
                      }
                    ></i>
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p>
                        {product.quantityInStock} {product.unit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="import-list">
              <h3>Hàng hóa nhập kho</h3>
              <div className="import-items">
                {importItems.map((item) => (
                  <div key={item.id} className="import-item">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-type">{item.type}</span>
                    </div>
                    <div className="item-quantity">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.id,
                            parseInt(e.target.value)
                          )
                        }
                        min="1"
                      />
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                      <span className="item-unit">{item.unit}</span>
                    </div>
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveFromImport(item.id)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="cancel-button"
            onClick={() => {
              setImportItems([]);
              onClose();
            }}
          >
            Hủy
          </button>
          <button
            className="save-button"
            onClick={handleSave}
            disabled={importItems.length === 0}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportProductModal;
