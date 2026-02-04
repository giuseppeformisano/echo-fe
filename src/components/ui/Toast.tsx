import React, { useEffect } from "react";
import "./Toast.css";
import { Info, CheckCircle, XCircle, X } from "lucide-react";

type ToastType = "info" | "success" | "error";

interface ToastProps {
  type?: ToastType;
  title: string;
  message: string;
  onClose: () => void;
}

const icons = {
  info: <Info />,
  success: <CheckCircle />,
  error: <XCircle />,
};

export const Toast: React.FC<ToastProps> = ({
  type = "info",
  title,
  message,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast-container toast-${type}`}>
      <div className="toast-icon">{icons[type]}</div>
      <div className="toast-content">
        <h3 className="toast-title">{title}</h3>
        <p className="toast-message">{message}</p>
      </div>
      <button className="toast-close" onClick={onClose}>
        <X size={20} />
      </button>
    </div>
  );
};