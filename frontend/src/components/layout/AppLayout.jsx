import React from "react";
import styles from "./AppLayout.module.css";

export default function AppLayout({ sidebar, children }) {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.sidebar}>{sidebar}</div>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}