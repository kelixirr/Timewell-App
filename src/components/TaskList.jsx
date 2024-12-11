import styles from "./TaskList.module.css";
import { useTasks } from "../contexts/TaskContext";
import { formatDate, groupedTaskByDate } from "../utils/utility";
import { useNavigate } from "react-router-dom";
import styles2 from "./TaskCard.module.css";
import { useState } from "react";
import ActionMenu from "./ActionMenu";

export default function TaskList() {
  const { tasks } = useTasks();
  const navigate = useNavigate();
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);

  const groupedTasks = groupedTaskByDate(tasks);
  const sortedDates = Object.keys(groupedTasks).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const handleTaskClick = (taskId) => {
    if (activeMenuId === taskId) {
      setActiveMenuId(null);
    }
    setActiveTaskId((prevId) => (prevId === taskId ? null : taskId));
    navigate(`t/${taskId}`);
  };

  const handleMenuToggle = (taskId) => {
    setActiveMenuId((prevId) => (prevId === taskId ? null : taskId));
  };
 
  const hasTasks = sortedDates.length > 0;

  return (
    <div className={styles.TaskListContainer}>
      {hasTasks ? (
        sortedDates.map((date) => (
          <div className={styles.TaskListItemDiv} key={date}>
            <h4 className={styles.TaskListHeading}>{formatDate(date)}</h4>
            <ul className={styles.TaskListUl}>
              {groupedTasks[date].map((task) => (
                <li
                  className={`${styles.TaskItem} ${
                    task.id === activeTaskId ? styles.ActiveTask : ""
                  }`}
                  key={task.id}
                  onClick={() => handleTaskClick(task.id)}
                  style={{
                    textDecoration:
                      task.taskStatus === "Completed" ? "line-through" : "none",
                    color: task.taskStatus === "Completed" ? "gray" : "",
                  }}
                >
                  <p className={styles.TaskItemP} title={task.title}>
                    {task.title.split(" ").slice(0, 3).join(" ")}
                  </p>

                  <p
                    className={`${styles2.PriorityTag} ${
                      styles2[
                        `Priority${
                          task.priority.charAt(0).toUpperCase() +
                          task.priority.slice(1).toLowerCase()
                        }`
                      ]
                    }`}
                    title="Task Priority"
                  >
                    {task.priority.toUpperCase()}
                  </p>
                  <div
                    className="ActionMenu"
                  >
                    <ActionMenu
                      task={task}
                      isOpen={activeMenuId === task.id}
                      onToggle={() => handleMenuToggle(task.id)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p className={styles.NoTasksMessage}>
          No tasks available, add some tasks!
        </p>
      )}
    </div>
  );
}
