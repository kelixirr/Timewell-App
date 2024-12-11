import { customToast } from "./customToast";

export function formatTime(durationInSeconds) {
  const hours = Math.floor(durationInSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((durationInSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (durationInSeconds % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

export function calcTotalDurationInSeconds(taskDuration) {
  const { hours, minutes } = taskDuration;
  return hours * 3600 + minutes * 60;
}

export function truncateString(str, maxLength){
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + "...";
  }
  return str;
};

export function groupedTaskByDate(tasks) {
  return tasks.reduce((acc, task) => {
    const taskDate = new Date(task.date)
      .toLocaleDateString()
      .split("T")[0];
    if (!acc[taskDate]) {
      acc[taskDate] = [];
    }
    acc[taskDate].push(task);
    return acc;
  }, {});
}

export function formatDate(datetime){
  const taskDate = new Date(datetime);
  const formattedDate = taskDate.toLocaleDateString("en-US", {
       year: "numeric",
       month: "long",
       day: "numeric",
     });

  return formattedDate
}

export function formatPlotDate(datetime) {
  const taskDate = new Date(datetime);
  const formattedDate = taskDate.toISOString().split("T")[0]; 
  return formattedDate;
}



export function ToTime(timeInSeconds, toHours = false) {
  if (
    typeof timeInSeconds !== "number" ||
    isNaN(timeInSeconds) ||
    timeInSeconds <= 0
  ) {
    return 0;
  }

  if(toHours){
     if (timeInSeconds < 60) {
       return timeInSeconds;
     }
     if (timeInSeconds < 3600) {
       return (timeInSeconds / 60).toFixed(2);
     }
     else{
     return (timeInSeconds / 3600).toFixed(2)};
  }

  if (timeInSeconds < 60) {
    return timeInSeconds + " s";
  }
  if (timeInSeconds < 3600) {
    return (timeInSeconds / 60).toFixed(2) + " m";
  }
  return (timeInSeconds / 3600).toFixed(2) + " h";
}

export function groupTasksByDate(tasks) {
  return tasks.reduce((acc, task) => {
    const taskDate = formatPlotDate(task.date); 
    if (!acc[taskDate]) {
      acc[taskDate] = [];
    }
    acc[taskDate].push(task); 
    return acc;
  }, {});
}

export function getDailyProductivityData(days, taskMap) {
  const data = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = formatPlotDate(date); 

    const totalProductivityForDay = taskMap[dateString]
      ? taskMap[dateString].reduce(
          (acc, task) => acc + parseFloat(ToTime(task.taskProductivity, true)),
          0
        )
      : 0;

    data.unshift({
      name: dateString,
      value: totalProductivityForDay,
    }); 
  }

  return data;
}


export const downloadCSV = (data, filename = "data.csv") => {
  const headers = [
    "id",
    "title",
    "date",
    "longDescription",
    "priority",
    "shortDescription",
    "taskProductivity",
    "taskStatus",
    "time",
    "totalTaskTime",
  ];
 
 const headerRow = headers.join(",");
 const rows = data.map(
   (item) => headers.map((header) => item[header] || "").join(",") 
 );
 const csvContent = [headerRow, ...rows].join("\n");
 const blob = new Blob([csvContent], { type: "text/csv" });
 const link = document.createElement("a");
 link.href = URL.createObjectURL(blob);
 link.download = filename;
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
customToast.success("Tasks Exported");
};
