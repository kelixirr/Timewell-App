import { createContext, useState, useContext, useRef, useEffect} from "react";
import Timer from "../utils/timerClass";
import { usePanel } from "./PanelContext";
import { calcTotalDurationInSeconds } from "../utils/utility";
import { useTasks } from "./TaskContext";

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [remainingTime, setRemainingTime] = useState({});
  const [totalTime, setTotalTime] = useState({});
  const [timers, setTimers] = useState({});
  const [isRunning, setIsRunning] = useState({});
  const [activeTask, setActiveTask] = useState(null);
  const [isCompleted, setIsCompleted] = useState({});

  const remainingTimeRef = useRef(remainingTime);
  const totalTimeRef = useRef(totalTime);

   useEffect(() => {
     remainingTimeRef.current = remainingTime;
     totalTimeRef.current = totalTime;
   }, [remainingTime, totalTime]);

  const { taskDuration, extraSeconds, setExtraSeconds} = usePanel();
  const { tasks, updateTask } = useTasks();

  const durationInSeconds = calcTotalDurationInSeconds(taskDuration);

  const handleStart = (taskId) => {
    if (activeTask && activeTask !== taskId) {
      handlePause(activeTask);
    }
    setActiveTask(taskId);

    if (!timers[taskId]) {
      const newTimer = new Timer(
        durationInSeconds,
        (time) => {
          setRemainingTime((prev) => ({ ...prev, [taskId]: time }));
        },
        () => {
          handleTimerComplete(taskId);
        },
        (isRunning) =>
          setIsRunning((prev) => ({ ...prev, [taskId]: isRunning }))
      );
      setTimers((prev) => ({ ...prev, [taskId]: newTimer }));
      setTotalTime((prev) => ({ ...prev, [taskId]: durationInSeconds }));
       setIsCompleted((prev) => ({...prev, [taskId]: false}));
      newTimer.start();
      setIsRunning((prev) => ({ ...prev, [taskId]: true }));
    } else {
      timers[taskId].start();
      setIsRunning((prev) => ({ ...prev, [taskId]: true }));
    }
  };

  const handlePause = (taskId) => {
    if (timers[taskId]) {
      timers[taskId].pause();
      setIsRunning((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  const handleStop = (taskId) => {
    if (timers[taskId]) {
      timers[taskId].stop();
      setRemainingTime((prev) => ({ ...prev, [taskId]: 0 }));
      setIsRunning((prev) => ({ ...prev, [taskId]: false }));
      setTimers((prev) => {
        const newTimers = { ...prev };
        delete newTimers[taskId];
        return newTimers;
      });
    }
  };

  const handleExtend = (taskId, extraSeconds) => {
    if (timers[taskId]) {
      timers[taskId].extend(extraSeconds);
      const newRemainingTime = timers[taskId].getTime();
      const newTotalTime = totalTime[taskId] + extraSeconds;

      setRemainingTime((prev) => ({ ...prev, [taskId]: newRemainingTime }));
      setTotalTime((prev) => ({ ...prev, [taskId]: newTotalTime }));
    }
  };

  const handleTimerComplete = (taskId) => {
    const task = tasks.find((task) => task.id === taskId);
    if (task) {
      const updatedTask = {
        ...task,
        taskStatus: "In-Progress",
        totalTaskTime: durationInSeconds + task.totalTaskTime + extraSeconds,
        taskProductivity: task.taskProductivity + productivityTime(task.id),
      };
      updateTask(updatedTask);
    }

    setRemainingTime((prev) => ({ ...prev, [taskId]: 0 }));
    setIsRunning((prev) => ({ ...prev, [taskId]: false }));
    setIsCompleted((prev) => ({ ...prev, [taskId]: true }));
    setExtraSeconds(0);
  
    setTimers((prev) => {
      const newTimers = { ...prev };
      delete newTimers[taskId];
      return newTimers;
    });
  };

  const productivityTime = (taskId) => {
    const total = totalTimeRef.current[taskId] ?? 0;
    const remaining = remainingTimeRef.current[taskId] ?? 0;
    return total - remaining > 0 ? total - remaining : 0;
  };

  return (
    <TimerContext.Provider
      value={{
        remainingTime,
        setRemainingTime,
        isRunning,
        setIsRunning,
        handleStart,
        handlePause,
        handleStop,
        totalTime,
        productivityTime,
        handleExtend,
        timers,
        setTimers,
        isCompleted,
        setIsCompleted,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
