import React from "react";
import { truncateMiddle } from "../../utils/text";
import { IconFile } from "../ui/icons";
import styles from "./FileCard.module.css";

function extFromName(name = "") {
  const idx = name.lastIndexOf(".");
  if (idx <= 0) return "";
  return name.slice(idx + 1).toLowerCase();
}

export default function FileCard({ file, selected, onClick }) {
  const name = file?.original_name || "file";
  const ext = extFromName(name);

  const isImage = ["png", "jpg", "jpeg", "webp", "gif"].includes(ext);
  const isPdf = ext === "pdf";
  const isZip = ["zip", "rar", "7z"].includes(ext);

  const badge = isPdf ? "PDF" : isImage ? "IMG" : isZip ? "ZIP" : (ext ? ext.toUpperCase() : "FILE");

  return (
    <button
      type="button"
      className={`${styles.card} ${selected ? styles.selected : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(file);
      }}
      title={name}
    >
      <IconFile ext={badge} />

      <div className={styles.name}>{truncateMiddle(name, 18)}</div>

      {file?.public_token ? <div className={styles.linkDot} title="Есть публичная ссылка" /> : null}
    </button>
  );
}