import { createContext, useContext, useEffect, useState } from "react";
import { customToast } from "../utils/customToast";
import { v4 as uuidv4 } from "uuid";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("timewelltasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("timewelltasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };
  const removeTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    customToast.success("Task Deleted!");
  };
  const updateTask = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };
  const duplicateTask = (taskId) => {
    setTasks((prevTasks) => {
      const taskToDuplicate = prevTasks.find((task) => task.id === taskId);
      if (taskToDuplicate) {
        const newTask = {
          ...taskToDuplicate,
          id: uuidv4(),
          title: `(Copy) of ${taskToDuplicate.title}`,
          taskStatus: "Pending",
          totalTaskTime: 0,
          taskProductivity: 0,
        };
        return [...prevTasks, newTask];
      }
      return prevTasks;
    });
    customToast.success("Task Duplicated!");
  };

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, removeTask, duplicateTask, updateTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
