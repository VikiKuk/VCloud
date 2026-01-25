import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import styles from "../ui/Modal.module.css";

export default function CommentModal({ open, onClose, initialComment, onSubmit }) {
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (open) setComment(initialComment || "");
  }, [open, initialComment]);

  const submit = async (e) => {
    e.preventDefault();
    await onSubmit?.(comment);
  };

  return (
    <Modal open={open} onClose={onClose} title="Комментарий">
      <form onSubmit={submit}>
        <div className={styles.label} style={{ marginBottom: 6 }}>Текст комментария</div>

        <textarea
          className={styles.textarea}
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className={styles.footer}>
          <Button variant="ghost" type="button" onClick={onClose}>Отмена</Button>
          <Button variant="primary" type="submit">Сохранить</Button>
        </div>
      </form>
    </Modal>
  );
}