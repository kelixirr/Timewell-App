import { HiOutlineLogout, HiOutlineMenuAlt2 } from "react-icons/hi";
import styles from "./Sidebar.module.css";
import TaskList from "./TaskList";
import { useCallback, useEffect, useRef, useState } from "react";
import ProfileModal from "./ProfileModal";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ toggleSidebar, isCollapsed }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);
  const sidebarRef = useRef(null);

  const handleClickOutside = useCallback(
    (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !isCollapsed &&
        window.innerWidth <= 800
      ) {
        toggleSidebar();
        setModalOpen(false);
      }
    },
    [isCollapsed, toggleSidebar]
  );

  useEffect(() => {
    if (window.innerWidth <= 800 && !isCollapsed) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isCollapsed, handleClickOutside]);

  return (
    <div
      className={`${styles.SidebarContainer} ${
        isCollapsed ? styles.collapsed : ""
      }`}
      ref={sidebarRef}
    >
      <HiOutlineMenuAlt2
        className={styles.SidebarMenu}
        onClick={toggleSidebar}
        title="Collapse Sidebar"
      />
      <TaskList />
      <ul className={styles.SidebarUser}>
        <li
          className={styles.SidebarUserProfile}
          onClick={() => setModalOpen(true)}
        >
          <img src={user.image} alt="Profile" />
          <p>Hello {user.name}</p>
        </li>
        <ProfileModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
        />
        <li onClick={() => navigate("/")}>
          <HiOutlineLogout title="End Session" />
        </li>
      </ul>
    </div>
  );
}
