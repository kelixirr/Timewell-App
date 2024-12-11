import Home from "./components/Home";
import { Navigate, Route, Routes } from "react-router-dom";
import Timewell from "./components/Timewell";
import NotFoundPage from "./components/NotFoundPage";
import PlayGround from "./components/PlayGround";
import { TaskProvider } from "./contexts/TaskContext";
import { PanelProvider } from "./contexts/PanelContext";
import { TimerProvider } from "./contexts/TimerContext";
import AddTask from "./components/AddTask";
import AppToaster from "./components/AppToaster";
import Dhashboard from "./components/Dhashboard";
import { UserProvider } from "./contexts/UserContext";

export default function App() {
  return (
    <UserProvider>
      <TaskProvider>
        <PanelProvider>
          <TimerProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/app" element={<Timewell />}>
                <Route index element={<AddTask />} />
                <Route path="dashboard/" element={<Navigate to="/app/dashboard/analytics" replace />} />
                <Route path="dashboard/:tab" element={<Dhashboard />} />
                <Route path="t/:id" element={<PlayGround />} />
                <Route path="t" element={<Navigate to="/app" replace />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <AppToaster />
          </TimerProvider>
        </PanelProvider>
      </TaskProvider>
    </UserProvider>
  );
}
