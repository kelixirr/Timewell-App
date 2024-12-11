import { HiOutlineLogout, HiOutlineMenuAlt2, } from "react-icons/hi";
import styles from "./Sidebar.module.css";
import TaskList from "./TaskList";
import { useState } from "react";
import ProfileModal from "./ProfileModal";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ toggleSidebar, isCollapsed }) {
  const navigate = useNavigate()
   const { user } = useUser();
   const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div
      className={`${styles.SidebarContainer} ${
        isCollapsed ? styles.collapsed : ""
      }`}
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
          <img src={user.image} alt="Profile"/>
          <p>Hello {user.name}</p>
        </li>
        <ProfileModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
        />
        <li onClick={() => navigate("/")}>
          <HiOutlineLogout title="End Session"/>
        </li>
      </ul>
    </div>
  );
}
