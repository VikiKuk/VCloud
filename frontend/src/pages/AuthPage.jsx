import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Logo from "../components/layout/Logo";
import Button from "../components/ui/Button";
import TextField from "../components/ui/TextField";
import { loginUser } from "../features/auth/authSlice";

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
    <div className="page">
      <div className="panel">
        <div className="topRow">
          <Logo />
        </div>

        <div className="grid2">
          {/* левая колонка */}
          <div>
            <h1 className="h1">Вход</h1>

            <p className="p">
              Приложение позволяет загружать, скачивать, переименовывать и удалять файлы,
              а также создавать публичные ссылки для скачивания
            </p>

            <div className="actionsRow" style={{ justifyContent: "flex-start", marginTop: 28 }}>
              <Button variant="default" onClick={() => nav("/register")}>
                Создать аккаунт
              </Button>

              {/* сабмитим форму справа */}
              <Button variant="default" type="submit" form="loginForm">
                Далее
              </Button>
            </div>
          </div>

          {/* правая колонка */}
          <div style={{ paddingTop: 20 }}>
            {err && <div className="errorBox">{err}</div>}

            <form id="loginForm" onSubmit={onSubmit}>
              <TextField
                label="Login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                autoFocus
              />

              <TextField
                label="Пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}