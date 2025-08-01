import React from "react";
import "../../styles/modal/Drawer.css";

const Drawer = ({ isOpen, onClose, title, children }) => {
  return (
    <div className={`drawer-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
      <div
        className={`drawer-content ${isOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="drawer-body">{children}</div>
      </div>
    </div>
  );
};

export default Drawer;
