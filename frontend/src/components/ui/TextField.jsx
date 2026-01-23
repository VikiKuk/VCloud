import React from "react";

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
}