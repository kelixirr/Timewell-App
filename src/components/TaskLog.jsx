import styles from "./TaskLog.module.css";
import { FaPlay, FaPause, FaStop, FaPlus, FaClock} from "react-icons/fa";
import { useTimer } from "../contexts/TimerContext";
import { useTasks } from "../contexts/TaskContext";
import { useState } from "react";
import { usePanel } from "../contexts/PanelContext";
import { calcTotalDurationInSeconds } from "../utils/utility";
import { customToast } from "../utils/customToast";

export default function TaskLog({task}) {
  const { updateTask } = useTasks();
  const [extension, setExtension] = useState(5)

   const { taskDuration, setExtraSeconds, extraSeconds } = usePanel();
   const durationInSeconds = calcTotalDurationInSeconds(taskDuration);

   const {
     remainingTime,
     isRunning,
     timers,
     handleStart,
     handlePause,
     handleStop,
     productivityTime,
     handleExtend,
   } = useTimer();


  const handleStartTask = () => {
    const updatedTask = {
      ...task,
      taskStatus: "Working",
      taskRemainingTime: remainingTime[task.id] ?? 0,
    };
    updateTask(updatedTask);
    handleStart(task.id);
  }

  const handlePauseTask = () => {
    const updatedTask = {
      ...task,
      taskStatus: "In-Progress",
    };
    updateTask(updatedTask);
    handlePause(task.id);
  }

  const handleStopTask = () => {
    const updatedTask = {
      ...task,
      taskStatus: "Completed",
      totalTaskTime: durationInSeconds + task.totalTaskTime + extraSeconds,
      taskProductivity: task.taskProductivity + productivityTime(task.id),
    };
    updateTask(updatedTask);
    handleStop(task.id);
    customToast.taskCompleted(`${task.title}`);
    customToast.congratulate("Great job!!");
  }

  const handleExtendTask = () => {
    if(extension > 0 ) {
      handleExtend(task.id, 1800)
      setExtraSeconds(1800);
      setExtension((prev) => prev - 1)
    }
    else {
      setExtension(5)
    }
  }

  

  return (
    <div className={styles.container}>
      <div className={styles.TimerModeSelector}>
        <div className={`${styles.TimerModeDiv}`}>
          <FaClock />
          <div className={styles.TimerModeDetails}>
            <span className={styles.TimerModeLabel}>Task Timer</span>
            <p className={styles.TimerModeDescription}>Focus on current task</p>
          </div>
        </div>
      </div>

      <div className={styles.timerWrapper}>
        <h4 className={styles.taskName}>
          {task.title.split(" ").slice(0, 3).join(" ") + "..."}
        </h4>
        <p className={styles.timerLabel}>Time Remaining</p>
        <div className={styles.timer}>
          <div className={styles.timeUnit}>
            <div className={styles.timeValue}>
              {(Math.floor(remainingTime[task.id] / 3600) || 0)
                .toString()
                .padStart(2, "0")}
            </div>
            <span className={styles.timeLabel}>Hours</span>
          </div>

          <span className={styles.timeSeparator}>:</span>

          <div className={styles.timeUnit}>
            <div className={styles.timeValue}>
              {(Math.floor((remainingTime[task.id] % 3600) / 60) || 0)
                .toString()
                .padStart(2, "0")}
            </div>
            <span className={styles.timeLabel}>Minutes</span>
          </div>

          <span className={styles.timeSeparator}>:</span>

          <div className={styles.timeUnit}>
            <div className={styles.timeValue}>
              {(remainingTime[task.id] % 60 || 0).toString().padStart(2, "0")}
            </div>
            <span className={styles.timeLabel}>Seconds</span>
          </div>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button
          className={`${styles.button} ${
            isRunning[task.id] ? styles.disabled : styles.start
          }`}
          onClick={handleStartTask}
          disabled={
            isRunning[task.id] ||
            remainingTime[task.id] === 0 ||
            remainingTime[task.id] === undefined
          }
          title={!isRunning[task.id] ? "Start Working" : ""}
        >
          <FaPlay className={styles.buttonIcon} />
          {!timers[task.id] ? "Start" : "Resume"}
        </button>

        <button
          className={`${styles.button} ${
            !isRunning[task.id] ? styles.disabled : styles.pause
          }`}
          onClick={handlePauseTask}
          disabled={!isRunning[task.id]}
          title="Stop Working"
        >
          <FaPause className={styles.buttonIcon} /> Pause
        </button>

        <button
          className={`${styles.button} ${
            !isRunning[task.id] ? styles.disabled : styles.stop
          }`}
          onClick={handleStopTask}
          disabled={!isRunning[task.id]}
          title="Mark Task As Complete"
        >
          <FaStop className={styles.buttonIcon} /> Complete
        </button>
      </div>

      {extension !== 0 && (
        <div className={styles.extendSection}>
          <button
            className={`${styles.button} ${
              !timers[task.id] ? styles.disabled : styles.extend
            }`}
            onClick={handleExtendTask}
            disabled={!timers[task.id]}
            title="Extend Time"
          >
            <FaPlus className={styles.buttonIcon} /> Extend time by 30 minutes -
            {extension}/5 extends left
          </button>
        </div>
      )}

      {isRunning[task.id] && (
        <p className={styles.motivationalText}>
          Stay focused and crush your goals!
        </p>
      )}
    </div>
  );
}
