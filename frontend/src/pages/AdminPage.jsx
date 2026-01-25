import React, { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import Sidebar from "../components/sidebar/Sidebar";
import Button from "../components/ui/Button";

import { fetchUsers, deleteUser, setAdmin } from "../features/users/usersSlice";

import styles from "./AdminPage.module.css";

export default function AdminPage() {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const authUser = useSelector((s) => s.auth.user);
  const { list, error } = useSelector((s) => s.users);

  // защита: если вдруг не админ — в /app
  useEffect(() => {
    if (authUser && !authUser.is_admin) nav("/app");
  }, [authUser, nav]);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const onNavigate = useCallback(
    (where) => {
      if (where === "logout") { nav("/"); return; }
      if (where === "files") { nav("/app"); return; }
      if (where === "admin") { nav("/admin"); return; }
    },
    [nav]
  );

  const title = useMemo(() => "Админка", []);

  const onOpenUserFiles = (u) => {
    nav(`/app?user_id=${encodeURIComponent(u.id)}`);
  };

  const onToggleAdmin = async (u) => {
    await dispatch(setAdmin({ userId: u.id, is_admin: !u.is_admin })).unwrap?.();
    dispatch(fetchUsers());
  };

  const onDeleteUser = async (u) => {
    const ok = window.confirm(`Удалить пользователя ${u.full_name || u.login}?`);
    if (!ok) return;
    await dispatch(deleteUser(u.id)).unwrap?.();
    dispatch(fetchUsers());
  };

  return (
    <AppLayout sidebar={<Sidebar active="admin" onNavigate={onNavigate} />}>
      <div className={styles.main}>
        {/* Верхняя сцена: welcome (как в FilesPage) */}
        <div className={styles.topRegion}>
          <div className={styles.welcome}>
            <h1 className={styles.welcomeTitle}>Добро пожаловать в облако</h1>
          </div>  
        </div>

        {/* Контент */}
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.h2}>{title}</h2>
          </div>

          {error ? <div className={styles.error}>Ошибка: {error}</div> : null}

          <div className={styles.table}>
            <div className={`${styles.row} ${styles.head}`}>
              <div>Пользователь</div>
              <div>Логин</div>
              <div>Email</div>
              <div>Админ</div>
              <div>Хранилище</div>
              <div className={styles.actionsColHead}>Действия</div>
            </div>

            {(list || []).map((u) => (
              <div className={styles.row} key={u.id}>
                <div className={styles.userCell}>
                  <div className={styles.name}>{u.full_name || "—"}</div>
                  <div className={styles.sub}>id: {u.id}</div>
                </div>

                <div className={styles.mono}>{u.login}</div>
                <div className={styles.mono}>{u.email}</div>

                <div>
                  <span
                    className={`${styles.pill} ${
                      u.is_admin ? styles.pillOn : styles.pillOff
                    }`}
                  >
                    {u.is_admin ? "Да" : "Нет"}
                  </span>
                </div>

                <div className={styles.storageCell}>
                    <div className={styles.sub}>Файлы: {u.storage?.count ?? 0}</div>
                    <div className={styles.sub}>Размер: {u.storage?.total_size_human ?? "0 B"}</div>
                  </div>

                <div className={styles.actionsCol}>
                  <Button
                    variant="ghost"
                    className={styles.small}
                    type="button"
                    onClick={() => onOpenUserFiles(u)}
                  >
                    Файлы
                  </Button>

                  <Button
                    variant="ghost"
                    className={styles.small}
                    type="button"
                    onClick={() => onToggleAdmin(u)}
                    disabled={u.id === authUser?.id}
                    title={u.id === authUser?.id ? "Нельзя изменить права себе" : ""}
                  >
                    {u.is_admin ? "Снять админа" : "Сделать админом"}
                  </Button>

                  <Button
                    variant="danger"
                    className={styles.small}
                    type="button"
                    onClick={() => onDeleteUser(u)}
                    disabled={u.id === authUser?.id}
                    title={u.id === authUser?.id ? "Нельзя удалить себя" : ""}
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}