// src/components/common/Modal.js

import React from "react";
import "./Modal.css";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`modal-overlay ${isOpen ? "is-open" : ""}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-content">
        <button
          className="modal-close-button"
          onClick={onClose}
          aria-label="모달 닫기"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
