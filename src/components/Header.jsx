import styles from "./Header.module.css";
import styles2 from "./AppHeader.module.css"

export default function Header() {
  return (
    <header className={styles.header}>
      <img className={styles.logo} src="logo192.png" alt="Timewell Logo" />
      <ul className={styles.HeaderMenu}>
        <li className={styles2.BetaTag} style={{ fontSize: "1rem" }}>
          App Version: V 1.0.0, BETA
        </li>
      </ul>
    </header>
  );
}
