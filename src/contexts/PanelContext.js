import { createContext, useContext, useState } from "react";

const PanelContext = createContext();

export const PanelProvider = ({ children }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDuration, setTaskDuration] = useState({
    hours: 0,
    minutes: 0,
  });
  const [extraSeconds, setExtraSeconds] = useState(0);

  return (
    <PanelContext.Provider
      value={{
        taskName,
        setTaskName,
        taskDuration,
        setTaskDuration,
        extraSeconds,
        setExtraSeconds,
      }}
    >
      {children}
    </PanelContext.Provider>
  );
};

export const usePanel = () => useContext(PanelContext);
