import React from "react";
import Logo from "./Logo";
import styles from "./AuthLayout.module.css";

export default function AuthLayout({ left, right }) {
  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.topRow}>
          <Logo />
        </div>

        <div className={styles.grid2}>
          <div className={styles.leftCol}>{left}</div>
          <div className={styles.rightCol}>{right}</div>
        </div>
      </div>
    </div>
  );
}