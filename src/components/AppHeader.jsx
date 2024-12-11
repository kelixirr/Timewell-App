import React, { useEffect, useState } from "react";
import { HiOutlineMenuAlt2, HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { MdOutlineAddTask, MdDashboard, MdFeedback } from "react-icons/md";
import { FaProductHunt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./AppHeader.module.css";
import HelpModal from "./HelpModal";

export default function AppHeader({ toggleSidebar, isCollapsed }) {
  const navigate = useNavigate();

  const [isActive, setIsActive] = useState("")

  const savedTheme = localStorage.getItem("theme");
  const [theme, setTheme] = useState(savedTheme || "light");


  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); 
  };

  useEffect(() => {
    document.body.className = theme; 
  }, [theme]);

  const handleNavigation = (path) => {
    setIsActive(path);
    navigate(path);
  };

  return (
    <div className={styles.AppHeaderContainer}>
      <ul className={styles.AppHeaderLogoSide}>
        {isCollapsed && (
          <li>
            <HiOutlineMenuAlt2
              className={styles.SidebarToggleButton}
              onClick={toggleSidebar}
              title="Open Sidebar"
            />
          </li>
        )}
        <li className={styles.BetaTag}>BETA</li>
        <li
          onClick={() =>
            window.open("https://www.producthunt.com/posts/timewell", "_blank")
          }
        >
          <FaProductHunt title="Product Hunt" />
        </li>
        <li
          onClick={() =>
            window.open(
              "https://discord.com/channels/1009694332074328165/1316415632383803432",
              "_blank"
            )
          }
        >
          <MdFeedback title="Community and Feedback" />
        </li>
      </ul>

      <ul className={styles.AppHeaderUl}>
        <li
          className={`${isActive === "/app" ? styles.active : ""}`}
          onClick={() => handleNavigation("/app")}
          title="Add Task"
        >
          <span>Add Task</span> <MdOutlineAddTask />
        </li>
        <li
          className={`${isActive === "/app/dashboard" ? styles.active : ""}`}
          onClick={() => handleNavigation("/app/dashboard")}
          title="Task Dashboard"
        >
          <span>Dashboard</span> <MdDashboard />
        </li>
        <li title="Help">
          <HelpModal />
        </li>
        <li className={styles.themeIcon}>
          {theme === "light" ? (
            <HiOutlineMoon
              title="Dark Mode"
              onClick={toggleTheme}
              className={`${styles.icon} ${
                theme === "light" ? "icon-entering" : "icon-leaving"
              }`}
            />
          ) : (
            <HiOutlineSun
              title="Light Mode"
              onClick={toggleTheme}
              className={`${styles.icon} ${
                theme === "dark" ? "icon-entering" : "icon-leaving"
              }`}
            />
          )}
        </li>
      </ul>
    </div>
  );
}
