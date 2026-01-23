/*import React from "react";

export default function TextField({ label, value, onChange, type = "text", placeholder = "", autoFocus = false }) {
  return (
    <div className="fieldWrap">
      {label && <div className="fieldLabel">{label}</div>}
      <input
        className="field"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
    </div>
  );
}*/

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