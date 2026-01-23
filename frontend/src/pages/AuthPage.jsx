import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../features/auth/authSlice";
import AuthLayout from "../components/layout/AuthLayout";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

import styles from "./AuthPage.module.css";

console.log("AuthPage styles:", styles);
export default function AuthPage() {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!login.trim() || !password) {
      setErr("Введите логин и пароль");
      return;
    }

    try {
      await dispatch(loginUser({ login, password })).unwrap();
      nav("/app");
    } catch {
      setErr("Неверный логин или пароль");
    }
  };

  return (
    <AuthLayout
      left={
        <>
          <h1 className={styles.h1}>Вход</h1>

          <p className={styles.p}>
            Приложение позволяет загружать, скачивать, переименовывать и удалять файлы,
            а также создавать публичные ссылки для скачивания
          </p>

          <div className={styles.actionsRow}>
            {/* белая кнопка */}
            <Button variant="ghost" onClick={() => nav("/register")}>
              Создать аккаунт
            </Button>

            {/* белая кнопка, сабмит формы справа */}
            <Button variant="ghost" type="submit" form="loginForm">
              Далее
            </Button>
          </div>
        </>
      }
      right={
        <div className={styles.rightForm}>
          <div className={styles.errorSlot}>
            {err ? <div className={styles.errorBox}>{err}</div> : null}
          </div>

          <form id="loginForm" onSubmit={onSubmit} className={styles.form}>
            <Input
              label="Login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              autoFocus
            />

            <Input
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </form>
        </div>
      }
    />
  );
}