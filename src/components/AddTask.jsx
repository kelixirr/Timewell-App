import React, { useMemo, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import styles from "./AddTask.module.css";
import { v4 as uuidv4 } from "uuid";
import { useTasks } from "../contexts/TaskContext";
import { customToast } from "../utils/customToast";

export default function AddTask({ task = {}, onSubmit }) {
  const [title, setTitle] = useState(task.title || "");
  const [datetime, setDateTime] = useState(
    task.date ? new Date(task.date).toISOString().slice(0, 16) : ""
  );
  const [priority, setPriority] = useState(task.priority || "");
  const [shortDescription, setShortDescription] = useState(
    task.shortDescription || ""
  );
  const [longDescription, setLongDescription] = useState(
    task.longDescription || ""
  );

  const { addTask } = useTasks();

  const validate = () => {
    const errors = [];
    let isValid = true;

    if (!title) errors.push("Title");
    if (!datetime) errors.push("Date and Time");
    if (!priority) errors.push("Priority");
    if (!shortDescription) errors.push("Short Description");

    if (errors.length > 0) {
      isValid = false;
      customToast.error(`A Task Can't Be Without: ${errors.join(", ")}`);
    }

    return isValid;
  };

  function handleSubmit(e) {
    e.preventDefault();

    if (validate()) {
      const taskId = task.id || uuidv4();
      const taskDate = new Date(datetime);
      const isoDate = taskDate.toISOString();

      const formattedTime = taskDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const newTask = {
        id: taskId,
        title: title,
        date: isoDate,
        time: formattedTime,
        priority: priority,
        shortDescription: shortDescription,
        longDescription: longDescription,
        taskStatus: task.taskStatus || "Pending",
        totalTaskTime: task.toalTime || 0,
        taskProductivity: task.taskProductivity || 0,
      };

      if (task.id) {
        onSubmit(newTask);
        customToast.success("Task updated successfully!");
      } else {
        addTask(newTask);
        customToast.success("Task created successfully!");
        setTitle("");
        setDateTime("");
        setPriority("");
        setShortDescription("");
        setLongDescription("");
      }
    }
  }

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: "1" }, { header: "2" }],
        ["bold", "italic", "underline", "strike"],
        [{ align: [] }],
        ["blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["code"],
        ["clean"],
      ],
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  return (
    <div className={styles.addTaskContainer}>
      <form className={styles.addTaskForm}>
        <fieldset className={styles.addTaskFieldset}>
          <legend className={styles.addTaskLegend}>
            {task.id ? "Edit Task" : "New Task"}
          </legend>
          <div className={styles.inputMainGroup}>
          
            <div className={styles.inputGroup}>
              <label htmlFor="task-title" className={styles.inputLabel}>
                Title
              </label>
              <input
                id="task-title"
                type="text"
                className={styles.inputText}
                placeholder="Add a title in a few words"
                maxLength={50}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

         
            <div className={styles.inputGroup}>
              <label htmlFor="task-date-time" className={styles.inputLabel}>
                Date & Time
              </label>
              <input
                id="task-date-time"
                type="datetime-local"
                className={styles.inputDate}
                value={datetime}
                onChange={(e) => setDateTime(e.target.value)}
                required
              />
            </div>

          
            <div className={styles.inputGroup}>
              <label htmlFor="priority" className={styles.inputLabel}>
                Priority
              </label>
              <select
                id="priority"
                className={styles.inputSelect}
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select priority
                </option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="severe">Severe</option>
              </select>
            </div>
          </div>
          <div>
            <div className={styles.inputGroup}>
              <label htmlFor="small-desc" className={styles.inputLabel}>
                Short description
              </label>
              <textarea
                id="small-desc"
                className={`${styles.inputTextAreaSmallDesc} ${styles.inputTextArea}`}
                placeholder="Add a small description"
                required
                rows="1"
                minLength={20}
                maxLength={300}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="detailed-desc" className={styles.inputLabel}>
                Full description
              </label>
              <p className={styles.inputLabelText}>optional</p>
              <ReactQuill
                id="detailed-desc"
                className={styles.quillEditor}
                placeholder="Add detailed description with formatting, headings, or lists...select the text to format."
                theme="bubble"
                modules={modules}
                value={longDescription}
                onChange={(content) => setLongDescription(content)}
              />
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.submitButton}
              onClick={handleSubmit}
              title={task.id ? "Update Task" : "Add Task"}
            >
              {task.id ? "Update Task" : "Add Task"}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
