import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isDismissable?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, isDismissable = true }) => {
  if (!isOpen) return null;

  useEffect(() => {
    if (!isOpen || !isDismissable) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDismissable, onClose]);


  return ReactDOM.createPortal(
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-40 backdrop-blur-sm" 
        onClick={isDismissable ? onClose : undefined} 
        aria-hidden="true"
      ></div>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg m-auto transform transition-all scale-95 opacity-0 animate-fade-in-scale overflow-hidden">
          <div className="flex items-start justify-between p-5 border-b border-gray-200">
            <h3 id="modal-title" className="text-lg font-semibold text-gray-900 leading-6">{title}</h3>
            {isDismissable && (
               <button
                  type="button"
                  className="p-1 -m-1 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  onClick={onClose}
                  aria-label="Cerrar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
            )}
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.2s ease-out forwards;
        }
      `}</style>
    </>,
    document.body
  );
};

export default Modal;