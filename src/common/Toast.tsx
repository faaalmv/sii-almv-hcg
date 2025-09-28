
import React, { useEffect } from 'react';
import Icon from './icons/Icon';

interface ToastProps {
  message: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  onClose: () => void;
}

const theme = {
  success: {
    bg: 'bg-white',
    text: 'text-gray-900',
    icon: <Icon.CheckCircle className="h-6 w-6 text-green-400" aria-hidden="true" />,
    closeButton: 'bg-white text-gray-400 hover:text-gray-500 focus:ring-indigo-500',
    container: 'bg-white shadow-lg ring-1 ring-black ring-opacity-5',
    position: 'top-5 right-5',
  },
  warning: {
    bg: 'bg-amber-500',
    text: 'text-white',
    icon: <Icon.Warning className="w-6 h-6" />,
    closeButton: 'bg-transparent text-white hover:bg-white/20 focus:ring-white/50',
    container: 'bg-amber-500 shadow-2xl',
    position: 'bottom-8 right-8',
  },
  error: { bg: 'bg-red-500', text: 'text-white', icon: <Icon.XCircle className="w-6 h-6" />, closeButton: 'bg-transparent text-white hover:bg-white/20 focus:ring-white/50', container: 'bg-red-500 shadow-2xl', position: 'bottom-8 right-8' },
  info: { bg: 'bg-blue-500', text: 'text-white', icon: <Icon.InformationCircle className="w-6 h-6" />, closeButton: 'bg-transparent text-white hover:bg-white/20 focus:ring-white/50', container: 'bg-blue-500 shadow-2xl', position: 'bottom-8 right-8' },
};

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Auto-close after 4 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const currentTheme = theme[type];

  return (
    <div 
      className={`fixed ${currentTheme.position} z-50 flex items-center p-4 pr-10 space-x-4 ${currentTheme.text} ${currentTheme.container} rounded-xl animate-fade-in-up transition-transform transform`} 
      role="alert"
    >
      <div className="flex-shrink-0">
        {currentTheme.icon}
      </div>
      <div className="text-sm font-semibold">{message}</div>
      <button
        type="button"
        className={`absolute top-1 right-1 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 ${currentTheme.closeButton}`}
        onClick={onClose}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
      </button>
    </div>
  );
};

export default Toast;
