import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  HiOutlineDotsVertical,
  HiTrash,
  HiDuplicate,
  HiEye,
} from "react-icons/hi";
import styles from "./ActionMenu.module.css";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../contexts/TaskContext";

export default function ActionMenu({ actions, task, isOpen, onToggle }) {
  const navigate = useNavigate();
  const { removeTask, duplicateTask } = useTasks();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const iconMap = {
    Delete: HiTrash,
    Duplicate: HiDuplicate,
    View: HiEye,
  };

  const defaultActions = [
    {
      label: "View",
      onClick: () => navigate(`/app/t/${task.id}`),
      icon: HiEye,
    },
    { label: "Delete", onClick: () => removeTask(task.id), icon: HiTrash },
    {
      label: "Duplicate",
      onClick: () => duplicateTask(task.id),
      icon: HiDuplicate,
    },
  ];

  const menuActions = actions || defaultActions;

  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        });
      }
    };

    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        onToggle(false);
      }
    };

    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        onToggle(false);
      }
    };

    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onToggle]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={(e) => {e.stopPropagation(); onToggle(!isOpen)}}
        className={styles.ellipsisBtn}
        aria-label="Open action menu"
        title="actions"
        aria-expanded={isOpen}
      >
        <HiOutlineDotsVertical size={16} />
      </button>
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className={`${styles.modalMenu} ${styles.portalMenu} ${styles.open}`}
            style={{
              position: "absolute",
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
            role="menu"
          >
            <ul className={styles.menuList}>
              {menuActions.map((action, index) => {
                const ActionIcon =
                  action.icon || iconMap[action.label] || HiOutlineDotsVertical;
                return (
                  <li
                    key={index}
                    className={styles.menuItem}
                    onClick={() => {
                      action.onClick?.();
                      onToggle(false);
                    }}
                    role="menuitem"
                    tabIndex={0}
                  >
                    <ActionIcon className={styles.menuItemIcon} />
                    <span>{action.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>,
          document.body
        )}
    </>
  );
}
