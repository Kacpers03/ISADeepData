// frontend/src/components/map/ui/ToastNotification.tsx
import React from 'react';
import styles from '../../../styles/map/base.module.css';

interface ToastNotificationProps {
  message: string;
  onClose: () => void;
  duration?: number; // Auto-close duration in ms (optional)
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ 
  message, 
  onClose, 
  duration = 5000 // Default 5 seconds
}) => {
  // Auto-close after duration
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={styles.toast}>
      <span>{message}</span>
      <button 
        onClick={onClose}
        className={styles.toastCloseButton}
      >
        ×
      </button>
    </div>
  );
};

export default ToastNotification;