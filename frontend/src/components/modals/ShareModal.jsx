import React from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import styles from "../ui/Modal.module.css"; 
import { IconCopy } from "../ui/icons";


export default function ShareModal({ open, onClose, link }) {
  const onCopy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
    } catch (e) {
      console.warn("clipboard failed", e);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Поделиться">
      <div className={styles.text}>Ссылка на файл</div>

      <div className={styles.row}>
        <input
          className={styles.input}
          readOnly
          value={link || ""}
          placeholder="Ссылка..."
          onClick={(e) => e.target.select()}
        />

        <button
          type="button"
          onClick={onCopy}
          disabled={!link}
          title="Копировать"
          className={styles.iconCopyBtn}
        >
          <IconCopy />
        </button>
      </div>

      <div className={styles.footer}>
        <Button variant="ghost" type="button" onClick={onClose}>
          Закрыть
        </Button>
      </div>
    </Modal>
  );
}