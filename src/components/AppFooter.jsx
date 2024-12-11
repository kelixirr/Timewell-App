import React from "react";
import styles from "./AppFooter.module.css";

export default function AppFooter() {
  return (
    <footer className={styles.AppFooter}>
      <div className={styles.FooterContent}>
        <p className={styles.CopyrightText}>
          © {new Date().getFullYear()} All Rights Reserved.
          <a
            href="https://github.com/kelixirr"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.GithubLink}
          >
            Amritesh Kumar
          </a>
        </p>
        <div className={styles.LogoPlaceholder}></div>
      </div>
    </footer>
  );
}
