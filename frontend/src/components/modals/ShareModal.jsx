import React from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import styles from "../ui/Modal.module.css"; 
import { IconCopy } from "../ui/icons";





export default function ShareModal({ open, onClose, link }) {
  const onCopy = async () => {
    if (!link) return;

    // HTTPS на секьюрного разворачивания на проде
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(link);
        return;
      } catch (e) {
        console.warn("clipboard API failed, fallback", e);
      }
    }

    // Fallback для HTTP
    try {
      const textarea = document.createElement("textarea");
      textarea.value = link;

      // чтобы не прыгал экран
      textarea.style.position = "fixed";
      textarea.style.top = "-1000px";
      textarea.style.left = "-1000px";

      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      document.execCommand("copy");
      document.body.removeChild(textarea);
    } catch (e) {
      console.error("copy failed", e);
      alert("Не удалось скопировать ссылку");
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