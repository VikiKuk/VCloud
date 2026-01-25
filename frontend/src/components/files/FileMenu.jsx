import React, { useEffect, useRef } from "react";
import styles from "./FileMenu.module.css";

export default function FileMenu({
  open,
  onClose,
  onRename,
  onComment,
  anchor = "top-right",
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;

    // capture: ловим раньше, чем FilesPage.main
    const onDocPointerDown = (e) => {
      e.stopPropagation();

      const el = ref.current;
      if (!el) return;

      // клик вне меню - закрыть
      if (!el.contains(e.target)) onClose?.();
    };

    document.addEventListener("pointerdown", onDocPointerDown, true);
    return () => document.removeEventListener("pointerdown", onDocPointerDown, true);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={`${styles.wrap} ${styles[anchor] || ""}`}
      // клики по самому меню не должны закрывать topbar
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className={styles.item}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose?.();    // сначала закрывается меню
          onRename?.();   // потом открывается модалка
        }}
      >
        Переименовать
      </button>

      <button
        className={styles.item}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose?.();
          onComment?.();
        }}
      >
        Комментарий
      </button>
    </div>
  );
}