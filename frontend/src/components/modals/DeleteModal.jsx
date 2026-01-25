import React from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import styles from "../ui/Modal.module.css";

export default function DeleteModal({ open, onClose, onConfirm, fileName }) {
  return (
    <Modal open={open} onClose={onClose} title="Удалить файл?">
      <div className={styles.text}>
        Файл <b>{fileName || "—"}</b> будет удалён без возможности восстановления.
      </div>

      <div className={styles.footer}>
        <Button variant="ghost" type="button" onClick={onClose}>Отмена</Button>
        <Button variant="danger" type="button" onClick={onConfirm}>Удалить</Button>
      </div>
    </Modal>
  );
}