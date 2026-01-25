import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import styles from "../ui/Modal.module.css";

export default function RenameModal({ open, onClose, initialName, onSubmit }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (open) setName(initialName || "");
  }, [open, initialName]);

  const submit = async (e) => {
    e.preventDefault();
    const v = (name || "").trim();
    if (!v) return;
    await onSubmit?.(v);
  };

  return (
    <Modal open={open} onClose={onClose} title="Переименовать">
      <form onSubmit={submit}>
        <Input label="Новое имя" value={name} onChange={(e) => setName(e.target.value)} autoFocus />

        <div className={styles.footer}>
          <Button variant="ghost" type="button" onClick={onClose}>Отмена</Button>
          <Button variant="primary" type="submit">Сохранить</Button>
        </div>
      </form>
    </Modal>
  );
}