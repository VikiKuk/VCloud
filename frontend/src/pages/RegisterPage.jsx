import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../features/auth/authSlice";

import Logo from "../components/layout/Logo";
import Button from "../components/ui/Button";
import TextField from "../components/ui/TextField";

function validate(payload) {
  const errors = {};
  const loginRe = /^[A-Za-z][A-Za-z0-9]{3,19}$/;
  const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  if (!loginRe.test(payload.login)) errors.login = "Логин: латиница/цифры, первый символ — буква, длина 4–20.";
  if (!emailRe.test(payload.email)) errors.email = "Email некорректен.";

  const pw = payload.password || "";
  const hasUpper = /[A-Z]/.test(pw);
  const hasDigit = /\d/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  if (pw.length < 6 || !hasUpper || !hasDigit || !hasSpecial) {
    errors.password = "Пароль: минимум 6 символов, 1 заглавная, 1 цифра, 1 спецсимвол.";
  }
  return errors;
}

function normalizeServerErrors(payload) {
  const fieldErrors = payload?.errors || null;
  const general = payload?.error || "";
  return { general, fieldErrors };
}

export default function RegisterPage() {
  const [form, setForm] = useState({ login: "", full_name: "", email: "", password: "" });
  const [clientErrors, setClientErrors] = useState({});
  const [serverErr, setServerErr] = useState({ general: "", fieldErrors: null });

  const dispatch = useDispatch();
  const nav = useNavigate();

  const fe = serverErr.fieldErrors || {};

  const setField = (name) => (e) => setForm((p) => ({ ...p, [name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerErr({ general: "", fieldErrors: null });

    const v = validate(form);
    setClientErrors(v);
    if (Object.keys(v).length) return;

    try {
      await dispatch(registerUser(form)).unwrap();
      nav("/login");
    } catch (payload) {
      const normalized = normalizeServerErrors(payload);
      if (!normalized.general && !normalized.fieldErrors) normalized.general = "Ошибка регистрации";
      setServerErr(normalized);
    }
  };

  return (
    <div className="page">
      <div className="panel">
        <div className="topRow">
          <Logo />
          <div className="navLinks">
            <Link to="/login">Вход</Link>
            <Link to="/register">Регистрация</Link>
          </div>
        </div>

        <div className="grid2">
          <div>
            <h1 className="h2">Создать аккаунт</h1>
          </div>

          <div>
            {(serverErr.general || serverErr.fieldErrors) && (
              <div className="errorBox">
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Исправьте ошибки</div>
                {serverErr.general && <div>{serverErr.general}</div>}
                {fe.login?.length ? <div><b>Логин:</b> {fe.login[0]}</div> : null}
                {fe.email?.length ? <div><b>Email:</b> {fe.email[0]}</div> : null}
                {fe.password?.length ? <div><b>Пароль:</b> {fe.password[0]}</div> : null}
              </div>
            )}

            <form onSubmit={onSubmit}>
              <TextField label="Login" value={form.login} onChange={setField("login")} />
              {clientErrors.login && <div className="hintError">{clientErrors.login}</div>}
              {fe.login?.length ? <div className="hintError">{fe.login[0]}</div> : null}

              <TextField label="Полное имя" value={form.full_name} onChange={setField("full_name")} />
              {fe.full_name?.length ? <div className="hintError">{fe.full_name[0]}</div> : null}

              <TextField label="Email" value={form.email} onChange={setField("email")} />
              {clientErrors.email && <div className="hintError">{clientErrors.email}</div>}
              {fe.email?.length ? <div className="hintError">{fe.email[0]}</div> : null}

              <TextField label="Пароль" type="password" value={form.password} onChange={setField("password")} />
              {clientErrors.password && <div className="hintError">{clientErrors.password}</div>}
              {fe.password?.length ? <div className="hintError">{fe.password[0]}</div> : null}

              <div className="actionsRow">
                <Button variant="default" type="submit">Далее</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}