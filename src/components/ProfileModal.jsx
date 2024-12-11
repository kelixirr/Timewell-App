import React, { useEffect, useRef } from "react";
import { useUser } from "../contexts/UserContext";
import styles from "./ProfileModal.module.css";
import { HiDownload, HiX } from "react-icons/hi";
import { Link} from "react-router-dom";
import { downloadCSV } from "../utils/utility";
import { useTasks } from "../contexts/TaskContext";
import { MdDashboard } from "react-icons/md";

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateName, updateImage, fileInputRef } = useUser();
  const { tasks } = useTasks();
  const nameInputRef = useRef(null);
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newName = nameInputRef.current.value;
    if (newName !== user.name) {
      updateName(newName);
    }
    if (fileInputRef.current?.files[0]) {
      updateImage();
    }
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        modalRef.current &&
        contentRef.current &&
        !contentRef.current.contains(e.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  const handleDownload = () => {
    downloadCSV(tasks);
  }

  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop} ref={modalRef}>
      <div className={styles.modalContent} ref={contentRef}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Update Profile</h2>
          <HiX onClick={onClose} className={styles.closeButton} />
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="profileImage">
              Image <span>(Image upload not allowed in Beta due to space constraint)</span>
            </label>
            <input
              type="file"
              id="profileImage"
              accept="image/jpeg,image/png,image/gif"
              ref={fileInputRef}
              disabled
            />
            {user.image && (
              <img src={user.image} alt="Profile" className={styles.preview} />
            )}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              ref={nameInputRef}
              defaultValue={user.name}
              maxLength={12}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Update
            </button>
          </div>
        </form>
        <div className={styles.additionalActions}>
          <div onClick={handleDownload} className={styles.actionButton}>
            <HiDownload /> Download Task Data
          </div>
          <Link
            to="/app/dashboard/"
            onClick={() => onClose()}
            className={styles.actionButton}
          >
            <MdDashboard /> Go to Task Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
