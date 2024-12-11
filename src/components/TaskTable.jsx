import { useTasks } from "../contexts/TaskContext";
import styles from "./TaskTable.module.css"; 
import { downloadCSV, formatDate, ToTime, truncateString } from "../utils/utility";
import { useEffect, useState } from "react";
import ActionMenu from "./ActionMenu";

export default function TaskTable() {
  const { tasks} = useTasks();
  const [bTab, setBTab] = useState("All");
  const [activeTasks, setActiveTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
   const [activeMenuId, setActiveMenuId] = useState(null);


  const itemsPerPage = 10;
  const totalPages = Math.ceil(activeTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTasks = activeTasks.slice(startIndex, startIndex + itemsPerPage);


  const bTabs = ["All", "Sort by status", "Sort by priority"];
  const statusOrder = ["Pending", "In-Progress", "Working", "Completed"];
  const priorityOrder = [ "severe", "high", "medium", "low",];
  
  
  useEffect(() => {
    setActiveTasks(tasks);
  }, [tasks]);
 

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1)); 
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages)); 
  };



  const handlebTabs = (tab) => {
    setBTab(tab);

    if (tab === "Sort by status") {
      const sortedByStatus = [...tasks].sort((a, b) => {
        const statusA = a.taskStatus.trim(); 
        const statusB = b.taskStatus.trim();

        return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB);
      });
      setActiveTasks(sortedByStatus); 
    } else if (tab === "Sort by priority") {
      const sortedByPriority = [...tasks].sort(
        (a, b) =>
          priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
      );
      setActiveTasks(sortedByPriority);
    } else {
      setActiveTasks(tasks); 
    }
  };

  const handleDownload = () => {
    downloadCSV(tasks)
  }

  const handleMenuToggle = (taskId) => {
    setActiveMenuId((prevId) => (prevId === taskId ? null : taskId));
  };

 

  return (
    <div className={styles.taskTableContainer}>
      {activeTasks.length !== 0 && (
        <div className={styles.subMenu}>
          <ul>
            {bTabs.map((tab) => (
              <li
                className={`${styles.subMenuItem} ${
                  bTab === tab ? styles.activeTab : ""
                }`}
                onClick={() => handlebTabs(tab)}
                key={tab}
              >
                {tab}
              </li>
            ))}
            <li
              className={styles.subMenuItem}
              onClick={handleDownload}
              title="Download Task Data"
            >
              Download Table
            </li>
          </ul>
        </div>
      )}
      <table className={styles.taskTable}>
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Date</th>
            <th>Priority</th>
            <th>Time</th>
            <th>Status</th>
            <th>Productive Time</th>
            <th>Total Allocated Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTasks.length > 0 ? (
            currentTasks.map((task) => (
              <tr key={task.id}>
                <td>{truncateString(task.title, 30)}</td>
                <td>{formatDate(task.date)}</td>
                <td>{task.priority.toUpperCase()}</td>
                <td>{task.time}</td>
                <td>{task.taskStatus.toUpperCase()}</td>
                <td>{ToTime(task.taskProductivity)}</td>
                <td>{ToTime(task.totalTaskTime)}</td>
                <td>
                  <ActionMenu
                    task={task}
                    isOpen={activeMenuId === task.id}
                    onToggle={() => handleMenuToggle(task.id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No tasks available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {activeTasks.length !== 0 && (
        <div className={styles.pagination}>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            Previous
          </button>
          <span className={styles.paginationText}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
