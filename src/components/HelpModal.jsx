import React, { useState } from "react";
import styles from "./HelpModal.module.css";
import { HiOutlineQuestionMarkCircle, HiX } from "react-icons/hi";

export default function HelpModal() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <HiOutlineQuestionMarkCircle
        onClick={toggleModal}
        title="Help"
        className={styles.helpIcon}
      />

      {isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>App Help & Guidelines</h2>
              <button onClick={toggleModal} className={styles.closeButton}>
                <HiX />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.section}>
                <h3>⚠️ Important Notice</h3>
                <p>
                  Timewell is free to use and works well if you work in single
                  browser and download your tasks data at regular intervals.
                  This is not a full-stack app yet. Your data may not be
                  permanently saved. I'll will not be responsible for your tasks
                  data loss :). Want a full stack version or support this
                  project or leave your feedback or contribute in development? Plz connect!
                </p>
              </div>

              <div className={styles.section}>
                <h3>📝 How to Use the App</h3>
                <ul>
                  <li>
                    <strong>Adding Tasks:</strong>
                    Click on the "Add Task" button to create new tasks.
                  </li>
                  <li>
                    <strong>While Working:</strong>
                    Choose a task, allocate time, and run the timer.
                  </li>
                  <li>
                    <strong>Managing Tasks:</strong>
                    Use the dashboard to analyse productivity and manage tasks.
                  </li>
                  <li>
                    <strong>Data Preservation:</strong>
                    Regularly download and backup your task data.
                  </li>
                  <li>
                    <strong>Browser:</strong>
                    Use any one browser as your tasks data is saved locally for
                    future!
                  </li>
                </ul>
              </div>

              <div className={styles.section}>
                <h3>💡 Pro Tips</h3>
                <ul>
                  <li>Use descriptive titles for better task tracking</li>
                  <li>Prioritize tasks to improve productivity</li>
                  <li>
                    You can allocate time more than once, and resume task where
                    you left.
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={toggleModal}>Got It!</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
