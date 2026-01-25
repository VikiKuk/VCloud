import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

export default function Modal({ open, title, children, onClose, width = 520 }) {
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        // закрываем только если кликнули по фону (overlay), а не по окну
        if (e.target === e.currentTarget) {
          e.stopPropagation(); // ✅ чтобы не дошло до FilesPage.main
          onClose?.();
        }
      }}
      onClick={(e) => e.stopPropagation()}
      role="presentation"
    >
      <div
        className={styles.modal}
        style={{ width }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title || "dialog"}
      >
        {title ? <div className={styles.title}>{title}</div> : null}
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body
  );
}