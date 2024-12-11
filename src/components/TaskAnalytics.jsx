import React, { useState } from "react";
import { useTasks } from "../contexts/TaskContext";
import {
  FaClock,
  FaBolt,
  FaCalendarCheck,
  FaTasks,
  FaClipboardCheck,
  FaFlag,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import styles from "./TaskAnalytics.module.css";
import {
  formatPlotDate,
  getDailyProductivityData,
  groupTasksByDate,
  ToTime,
} from "../utils/utility";

export default function Analytics() {
  const { tasks } = useTasks();
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "7 Days", "30 Days", "90 Days"];

  const totalProductiveTime = tasks.reduce(
    (acc, task) => acc + task.taskProductivity,
    0
  );
  const totalAllocatedTime = tasks.reduce(
    (acc, task) => acc + task.totalTaskTime,
    0
  );

  const productivityToday = tasks
    .filter(
      (task) => new Date(task.date).toDateString() === new Date().toDateString()
    )
    .reduce((acc, task) => acc + task.taskProductivity, 0);

  const totalTasks = tasks.length;

  const taskStatusCount = tasks.reduce((acc, task) => {
    acc[task.taskStatus] = (acc[task.taskStatus] || 0) + 1;
    return acc;
  }, {});

  const taskStatusData = Object.keys(taskStatusCount).map((status) => ({
    name: status,
    value: taskStatusCount[status],
  }));

  const taskPriorityCount = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {});

  const tasksByDate = tasks.reduce((acc, task) => {
    const taskDate = formatPlotDate(task.date);
    acc[taskDate] = (acc[taskDate] || 0) + 1;
    return acc;
  }, {});

  const handleTab = (tab) => {
    setActiveTab(tab);
  };

  const tasksDateData = Object.keys(tasksByDate).map((date) => ({
    name: date,
    count: tasksByDate[date],
  }));

  const taskMap = groupTasksByDate(tasks);

  const productivity7Days = getDailyProductivityData(7, taskMap);
  const productivity30Days = getDailyProductivityData(30, taskMap);
  const productivity90Days = getDailyProductivityData(90, taskMap);

  return (
    <div className={styles.analyticsContainer}>
      <div className={styles.summaryStats}>
        <div className={styles.statCard}>
          <FaClock className={styles.statIcon} />
          <div className={styles.statContent}>
            <h4>Total Time</h4>
            <p>{ToTime(totalAllocatedTime)}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <FaBolt className={styles.statIcon} />
          <div className={styles.statContent}>
            <h4>Total Productivity</h4>
            <p>{ToTime(totalProductiveTime)}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <FaCalendarCheck className={styles.statIcon} />
          <div className={styles.statContent}>
            <h4>Productivity Today</h4>
            <p>{ToTime(productivityToday)}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <FaTasks className={styles.statIcon} />
          <div className={styles.statContent}>
            <h4>Total Tasks</h4>
            <p>{totalTasks}</p>
          </div>
        </div>
      </div>

      <div className={styles.summaryDetails}>
        <div className={styles.detailBox}>
          <h4>Task Status</h4>
          <ul className={styles.detailList}>
            {Object.entries(taskStatusCount).map(([status, count]) => (
              <li key={status}>
                <FaClipboardCheck color="#4CAF50" />
                <span>
                  {status}: {count}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.detailBox}>
          <h4>Task Priority</h4>
          <ul className={styles.detailList}>
            {Object.entries(taskPriorityCount).map(([priority, count]) => (
              <li key={priority}>
                <FaFlag color="#f44336" />
                <span>
                  {priority}: {count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.chartWrapper}>
          <div className={styles.chartHeader}>
            <h3>Tasks Created by Date</h3>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={tasksDateData}
              margin={{ left: -40, right: 0, top: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {tasksDateData.length === 0 ? (
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#a35028"
                  fontSize="1.2rem"
                >
                  No Data to Show
                </text>
              ) : (
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartWrapper}>
          <div className={styles.chartHeader}>
            <h3>Productivity</h3>
            <div className={styles.chartTabs}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTab(tab)}
                  className={activeTab === tab ? styles.activeTab : ""}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={
                activeTab === "7 Days"
                  ? productivity7Days
                  : activeTab === "30 Days"
                  ? productivity30Days
                  : productivity90Days
              }
              margin={{ left: -40, right: 0, top: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {(activeTab === "7 Days"
                ? productivity7Days
                : activeTab === "30 Days"
                ? productivity30Days
                : productivity90Days
              ).length === 0 ? (
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#a35028"
                  fontSize="1.2rem"
                >
                  No Productivity Data
                </text>
              ) : (
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartWrapper}>
          <div className={styles.chartHeader}>
            <h3>Tasks by Status</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              {taskStatusData.length === 0 ? (
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#a35028"
                  fontSize="1.2rem"
                >
                  No Task Status Data
                </text>
              ) : (
                <>
                  <Pie
                    data={taskStatusData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index % 2 === 0 ? "#4CAF50" : "#f44336"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </>
              )}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
