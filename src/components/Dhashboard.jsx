import { useState } from "react";
import TaskAnalytics from "./TaskAnalytics";
import TaskTable from "./TaskTable";
import { AiOutlineTable, AiOutlineBarChart } from "react-icons/ai";
import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("analytics");
  const navigate = useNavigate();

  const tabs = [
    { name: "analytics", icon: <AiOutlineBarChart /> },
    { name: "overview", icon: <AiOutlineTable /> },
  ];

  const handleTab = (tab) => {
    setActiveTab(tab);
    navigate(`/app/dashboard/${tab}`);
  };

  return (
    <div className={styles.dashboard}>
      <ul className={styles.tabList}>
        {tabs.map((tab) => (
          <li
            key={tab.name}
            className={`${styles.tabItem} ${
              activeTab === tab.name ? styles.activeTab : ""
            }`}
            onClick={() => handleTab(tab.name)}
          >
            {tab.icon} {tab.name}
          </li>
        ))}
      </ul>
      {activeTab === "analytics" && <TaskAnalytics />}
      {activeTab === "overview" && <TaskTable />}
    </div>
  );
}
