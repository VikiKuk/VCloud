import React from "react";
import styles from "./Input.module.css";

export default function Input({ label, ...props }) {
  return (
    <div className={styles.wrap}>
      {label ? <div className={styles.label}>{label}</div> : null}
      <input className={styles.input} {...props} />
    </div>
  );
}