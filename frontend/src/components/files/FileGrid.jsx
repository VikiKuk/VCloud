import React from "react";
import FileCard from "./FileCard";
import styles from "./FileGrid.module.css";

export default function FileGrid({ files, selectedId, onSelect }) {
  return (
    <div className={styles.grid}>
      {files.map((f) => (
        <FileCard
          key={f.id}
          file={f}
          selected={f.id === selectedId}
          onClick={() => onSelect?.(f)}
        />
      ))}
    </div>
  );
}