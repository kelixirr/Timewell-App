import { toast } from "react-hot-toast";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaRegGrinBeam,
  FaTasks,
} from "react-icons/fa"; 

export const customToast = {
  success: (message) => {
    return toast.success(message, {
      style: {
        background: "#4CAF50",
        color: "white",
        border: "1px solid #45a049", 
      },
      icon: <FaCheckCircle style={{ color: "white" }} />, 
      iconTheme: {
        primary: "white",
        secondary: "#4CAF50",
      },
    });
  },

  congratulate: (message) => {
    return toast(message, {
      style: {
        background: "#03A9F4", 
        color: "white",
        border: "1px solid #0288D1", 
      },
      icon: <FaRegGrinBeam style={{ color: "white" }} />,
      iconTheme: {
        primary: "white",
        secondary: "#03A9F4", 
      },
      duration: 6000, 
    });
  },

  taskCompleted: (taskName) => {
    return toast(`Task Completed: ${taskName}`, {
      style: {
        background: "#4CAF50", 
        color: "white",
        border: "1px solid #388E3C", 
      },
      icon: <FaTasks style={{ color: "white" }} />, 
      iconTheme: {
        primary: "white",
        secondary: "#4CAF50",
      },
      duration: 5000, 
    });
  },

  error: (message) => {
    return toast.error(message, {
      style: {
        background: "#F44336", 
        color: "white",
        border: "1px solid #D32F2F", 
      },
      icon: <FaExclamationTriangle style={{ color: "white"}} />, 
      iconTheme: {
        primary: "white",
        secondary: "#F44336",
      },
    });
  },
};