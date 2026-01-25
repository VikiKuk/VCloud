import React, { useEffect } from "react";
import {
  IconDownload,
  IconLink,
  IconTrash,
  IconMore,
  IconClose,
} from "../ui/icons";
import { truncateMiddle } from "../../utils/text";
import styles from "./FileTopBar.module.css";

export default function FileTopBar({
  file,
  onDownload,
  onShare,
  onDelete,
  onMore,
  onClose,
}) {
  // ESC закрывает
  useEffect(() => {
    if (!file) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [file, onClose]);

  if (!file) return null;

  const name = truncateMiddle(file.original_name || "file", 22);

  // комментарий: фикс длина, троеточие в середине, но title показывает полный
  const commentRaw = file.comment || "";
  const comment = truncateMiddle(commentRaw, 34);
console.log("selected file:", file);
  return (
    // backdrop: клик по нему закрывает bar
    <div className={styles.backdrop} onClick={() => onClose?.()}>
      {/* сам bar: клики внутри НЕ должны закрывать */}
      <div className={styles.bar} onClick={(e) => e.stopPropagation()}>
        <div className={styles.left}>
          <div className={styles.fileName} title={file.original_name || ""}>
            {name}
          </div>

          <div className={styles.comment} title={commentRaw}>
            {commentRaw ? comment : "—"}
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.iconBtn}
            type="button"
            onClick={onDownload}
            title="Скачать"
          >
            <IconDownload />
          </button>

          <button
            className={styles.iconBtn}
            type="button"
            onClick={onShare}
            title="Поделиться"
          >
            <IconLink />
          </button>

          <button
            className={styles.iconBtn}
            type="button"
            onClick={onDelete}
            title="Удалить"
          >
            <IconTrash />
          </button>

          <button
            className={styles.iconBtn}
            type="button"
            onClick={onMore}
            title="Меню"
          >
            <IconMore />
          </button>

          <button
            className={styles.closeBtn}
            type="button"
            onClick={onClose}
            title="Закрыть"
          >
            <IconClose />
          </button>
        </div>
      </div>
    </div>
  );
}