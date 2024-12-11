import { useState } from "react";
import DOMPurify from "dompurify";
import styles from "./TaskCard.module.css";
import {
  FaEdit,
  FaTrash,
  FaCheck,
  FaClock,
  FaCalendarAlt,
  FaBolt,
} from "react-icons/fa";
import { useTimer } from "../contexts/TimerContext";
import {
  calcTotalDurationInSeconds,
  formatDate,
  formatTime,
  truncateString,
} from "../utils/utility";
import { useTasks } from "../contexts/TaskContext";
import AddTask from "./AddTask";
import { usePanel } from "../contexts/PanelContext";
import { BiTime } from "react-icons/bi";
import { MdOutlineTaskAlt } from "react-icons/md";
import { customToast } from "../utils/customToast";

export default function TaskCard({ task }) {
  const { remainingTime, handleStop, timers, isCompleted, productivityTime } =
    useTimer();
  const [isEditing, setIsEditing] = useState(false);
  const { removeTask, updateTask } = useTasks();
  const { taskDuration, extraSeconds } = usePanel();
  const durationInSeconds = calcTotalDurationInSeconds(taskDuration);

  const handleDelete = () => {
    removeTask(task.id);
    handleStop(task.id);
  };

  const handleEdit = (updatedTask) => {
    updateTask(updatedTask);
    setIsEditing(false);
  };

  const handleComplete = () => {
    let updatedTask;

    if (isCompleted[task.id]) {
      updatedTask = {
        ...task,
        taskStatus: "Completed",
      };
    } else {
      updatedTask = {
        ...task,
        taskStatus: "Completed",
        totalTaskTime: durationInSeconds + task.totalTaskTime + extraSeconds,
        taskProductivity: task.taskProductivity + productivityTime(task.id),
      };
    }
    updateTask(updatedTask);
    handleStop(task.id);
    customToast.taskCompleted(`${task.title}`);
    customToast.congratulate("Great job!!");
  };

  if (isEditing) {
    return <AddTask task={task} onSubmit={handleEdit} />;
  }

  return (
    <div className={styles.PGTaskCard}>
      <div className={styles.TaskTags}>
        <div className={styles.spanDiv}>
          <span className={styles.DateTag} title="Task Date">
            <FaCalendarAlt style={{ marginRight: "5px", color: "#8c3e22" }} />
            {formatDate(task.date)}
          </span>

          <span className={styles.TimeTag} title="Task Time">
            <FaClock style={{ marginRight: "5px", color: "#2a9d8f" }} />
            {task.time}
          </span>
          <span
            className={`${styles.PriorityTag} ${
              styles[
                `Priority${
                  task.priority.charAt(0).toUpperCase() +
                  task.priority.slice(1).toLowerCase()
                }`
              ]
            }`}
            title="Task Priority"
          >
            {task.priority}
          </span>
        </div>
        <div className={styles.spanDiv}>
          <span
            className={`${styles.PriorityTag} ${styles.StatusCompleted}`}
            title="Task Status"
          >
            <MdOutlineTaskAlt
              style={{ marginRight: "5px", color: "#264653" }}
            />
            {task.taskStatus}
          </span>
          <span className={styles.RightAligned} title="Total Time">
            <BiTime />
            {formatTime(task.totalTaskTime || 0)}
          </span>
          <span className={styles.RightAligned} title="Total Productivity">
            <FaBolt />
            {formatTime(task.taskProductivity || 0)}
          </span>
        </div>
      </div>

      <div className={styles.TaskContent}>
        <h2 className={styles.TaskTitle}>{truncateString(task.title, 50)}</h2>

        <div className={styles.TaskDescriptions}>
          <p className={styles.ShortDescription}>{task.shortDescription}</p>
          <p
            className={styles.LongDescription}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(task.longDescription || ""),
            }}
          ></p>
        </div>
      </div>

      <div className={styles.TaskActions}>
        <button
          className={styles.ActionButton}
          title="Edit Task"
          onClick={() => setIsEditing(true)}
        >
          <FaEdit />
          <span>Edit</span>
        </button>
        <button
          className={styles.ActionButton}
          title="Delete Task"
          onClick={handleDelete}
        >
          <FaTrash />
          <span>Delete</span>
        </button>
      </div>

      <div className={styles.TaskTimerTracking}>
        {timers[task.id] ? (
          <div className={styles.TimerTrackingInfo}>
            <span>Task in Progress</span>
            <span>Time Elapsed: {formatTime(remainingTime[task.id] || 0)}</span>
          </div>
        ) : task.taskStatus === "Completed" ? (
          <span>Good Job!!</span>
        ) : (
          <span>Let's start working!</span>
        )}
        <div className={styles.TimerTrackingActions}>
          <button
            className={`${
              task.taskStatus === "Completed"
                ? styles.disabled
                : styles.CompleteTaskButton
            }`}
            onClick={handleComplete}
          >
            <FaCheck /> Mark Complete
          </button>
        </div>
      </div>
    </div>
  );
}
