import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { uploadFile, fetchFiles } from "../../features/files/filesSlice";
import Button from "../ui/Button";
import { IconUpload } from "../ui/icons";
import styles from "./Sidebar.module.css";

export default function Sidebar({ active = "files", onNavigate }) {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  const fileInputRef = useRef(null);

  const onPickFile = () => fileInputRef.current?.click();

  const onFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // сброс input, чтобы можно было выбрать тот же файл снова
    e.target.value = "";

    // комментарий пока пустой (нужна модалка для комментария при загрузке)
    await dispatch(uploadFile({ file, comment: "" }));
    await dispatch(fetchFiles()); // обновляем список
  };

  const onLogout = async () => {
    await dispatch(logoutUser());
    // роутинг на уровне страницы
    onNavigate?.("logout");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>VCloud</div>

      <div className={styles.userBlock}>
        <div className={styles.userLabel}>Имя пользователя</div>
        <div className={styles.userName}>{user?.full_name || user?.login || "—"}</div>
      </div>

      <div className={styles.actions}>
        <Button variant="primary" className={styles.uploadBtn} onClick={onPickFile} leftIcon={<IconUpload />}>
          Загрузить
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={onFileSelected}
        />
      </div>

      <nav className={styles.nav}>
        <button
          className={`${styles.navItem} ${active === "files" ? styles.active : ""}`}
          onClick={() => onNavigate?.("files")}
          type="button"
        >
          <span className={styles.navIcon}>📁</span>
          <span>Файлы</span>
        </button>

        {user?.is_admin ? (
          <button
            className={`${styles.navItem} ${active === "admin" ? styles.active : ""}`}
            onClick={() => onNavigate?.("admin")}
            type="button"
          >
            <span className={styles.navIcon}>🧩</span>
            <span>Админка</span>
          </button>
        ) : null}
      </nav>

      <div className={styles.footer}>
        <Button variant="ghost" className={styles.logoutBtn} onClick={onLogout}>
          Выход
        </Button>
      </div>
    </aside>
  );
}