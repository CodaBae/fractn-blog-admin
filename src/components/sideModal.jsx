import React, { useState } from 'react';
import { createPortal } from 'react-dom';

const SideModal = ({ isOpen, onClose, children }) => {
  // Ensure body doesn't scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex bg-[#000] bg-opacity-10  justify-end">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-none"
        onClick={onClose}
      ></div>

      {/* Modal content overflow-y-auto*/}
      <div className="relative w-3/4 md:w-[640px] bg-white h-full shadow-lg  transition-transform transform translate-x-0">
        {/* Close Button */}
            <button
                className="absolute top-4 right-4 text-[#EA3A3D] text-[21px] hover:text-gray-800"
                onClick={onClose}
            >
            &#10005;
            </button>

        {/* Modal Body */}
        <div className="p-6 mt-[30px]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SideModal;
