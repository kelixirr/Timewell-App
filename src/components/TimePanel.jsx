import { useTimer } from "../contexts/TimerContext";
import styles from "./PlayGround.module.css";
import { usePanel } from "../contexts/PanelContext";
import { calcTotalDurationInSeconds } from "../utils/utility";
import toast from "react-hot-toast";

export default function TimePanel({ task }) {
  const { setRemainingTime, timers } = useTimer();

  const {
    setTaskName,
    taskDuration,
    setTaskDuration,
  } = usePanel();

  const handleSubmit = (e) => {
    const hours = Number(taskDuration.hours) + Number(taskDuration.minutes / 60);

    if (hours > 10) {
      toast.error(
        "Task Duration Can't Exceed 10 Hours In One Go. You Can Always Add More"
      );
    } else {
      const durationInSeconds = calcTotalDurationInSeconds(taskDuration);
      setTaskName(task.title);
      setRemainingTime((prev) => ({ ...prev, [task.id]: durationInSeconds }));
    }
  };

  return (
    <div className={styles.TimerSelectionPanelDiv}>
      <div className={styles.TimerSelectionPanel}>
        <h2 className={styles.TimerPanelTitle}>Timer Management</h2>
        <div className={styles.TimerConfiguration}>
          <div className={styles.TaskTimerConfig}>
            <div className={styles.TimerInputGroup}>
              <label>Current Task</label>
              <div className={styles.TimeInputs}>
                <input
                  id="task-selection"
                  value={task ? task.title : "No task selected"}
                  disabled
                />
              </div>
            </div>
            <div className={styles.TimerInputGroup}>
              <label>Task Duration</label>
              <div className={styles.TimeInputs}>
                <input
                  type="number"
                  placeholder="Hours"
                  min="0"
                  max="10"
                  value={taskDuration.hours === 0 ? "" : taskDuration.hours}
                  onChange={(e) => {
                    const hours = parseInt(e.target.value, 10);
                    setTaskDuration({
                      ...taskDuration,
                      hours: isNaN(hours) ? 0 : hours,
                    });
                  }}
                />
                <input
                  type="number"
                  placeholder="Minutes"
                  min="0"
                  max="59"
                  value={taskDuration.minutes === 0 ? "" : taskDuration.minutes}
                  onChange={(e) => {
                    const mins = parseInt(e.target.value, 10);
                    setTaskDuration({
                      ...taskDuration,
                      minutes: isNaN(mins) ? 0 : mins,
                    });
                  }}
                />
              </div>
            </div>
          </div>

          <button
            className={`${styles.StartTimerButton} ${timers[task.id] ? styles.disabled : ""}`}
            onClick={handleSubmit}
            disabled={timers[task.id]}
          >
            Allocate Time
          </button>
        </div>
      </div>
    </div>
  );
}
