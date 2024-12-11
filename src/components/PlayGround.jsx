import { useNavigate, useParams } from "react-router-dom";
import styles from "./PlayGround.module.css";
import TaskCard from "./TaskCard";
import TimePanel from "./TimePanel";
import { useTasks } from "../contexts/TaskContext";
import { useEffect } from "react";
import TaskLog from "./TaskLog";

export default function PlayGround() {
  const { id } = useParams();
  const { tasks} = useTasks();
  const navigate = useNavigate();
  const task = tasks.find((t) => t.id === id);

  useEffect(() => {
    if (!task) {
      navigate("/app", { replace: true });
    }
  }, [task, navigate]);

  if (!task) {
    return null; }

  return (
    <div className={styles.PGContainer}>
      <TaskCard task={task} />
      <TimePanel task={task} />
      <TaskLog task={task} />
    </div>
  );
}
