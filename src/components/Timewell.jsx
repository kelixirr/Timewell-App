import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import Sidebar from "./Sidebar";
import styles from "./Timewell.module.css";
import { useState } from "react";
import AppFooter from "./AppFooter";

export default function Timewell() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div
      className={`${styles.TimewellContainer} ${
        isSidebarCollapsed ? styles.collapsed : ""
      }`}
    >
      <Sidebar toggleSidebar={toggleSidebar} isCollapsed={isSidebarCollapsed} />
      <div className={styles.TimewellMainDiv}>
        <AppHeader
          toggleSidebar={toggleSidebar}
          isCollapsed={isSidebarCollapsed}
        />
        <div className={styles.TimewellFormContainer}>
          <Outlet />
        </div>
        <AppFooter />
      </div>
    </div>
  );
}
