import React from "react";
import styles from "./Button.module.css";

export default function Button({ variant = "ghost", className = "", leftIcon, ...props }) {
  const cls = `${styles.btn} ${styles[variant] || ""} ${className}`.trim();
  return (
    <button className={cls} {...props}>
      {leftIcon ? <span className={styles.icon}>{leftIcon}</span> : null}
      <span>{props.children}</span>
    </button>
  );
}