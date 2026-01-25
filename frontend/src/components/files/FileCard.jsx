import React from "react";
import { truncateMiddle } from "../../utils/text";
import styles from "./FileCard.module.css";

function extFromName(name = "") {
  const idx = name.lastIndexOf(".");
  if (idx <= 0) return "";
  return name.slice(idx + 1).toLowerCase();
}

function FileIcon({ ext }) {
  // можно расширить (pdf/image/zip), пока минимально 
  const isImage = ["png", "jpg", "jpeg", "webp", "gif"].includes(ext);
  const isPdf = ext === "pdf";
  const isZip = ["zip", "rar", "7z"].includes(ext);

  return (
    <div className={styles.icon}>
      {/* inline SVG иконка файла */}
      <svg width="56" height="64" viewBox="0 0 56 64" fill="none" aria-hidden="true">
        <path d="M10 2h24l12 12v46a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#EEF2FF"/>
        <path d="M34 2v12h12" fill="#DDE3FF"/>
        <path d="M34 2l12 12H34V2z" fill="#CBD5FF"/>
        <rect x="14" y="26" width="28" height="4" rx="2" fill="#9CA3AF"/>
        <rect x="14" y="34" width="22" height="4" rx="2" fill="#9CA3AF"/>
        <rect x="14" y="42" width="18" height="4" rx="2" fill="#9CA3AF"/>
      </svg>

      <div className={styles.badge}>
        {isPdf ? "PDF" : isImage ? "IMG" : isZip ? "ZIP" : ext ? ext.toUpperCase() : "FILE"}
      </div>
    </div>
  );
}

export default function FileCard({ file, selected, onClick }) {
  const name = file?.original_name || "file";
  const ext = extFromName(name);

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
      <FileIcon ext={ext} />
      <div className={styles.name}>{truncateMiddle(name, 18)}</div>
      {file?.public_token ? <div className={styles.linkDot} title="Есть публичная ссылка" /> : null}
    </button>
  );
}