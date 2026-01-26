import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

import { registerUser } from "../features/auth/authSlice";
import styles from "./Register.module.css";

function validate(payload) {
  const errors = {};
  const loginRe = /^[A-Za-z][A-Za-z0-9]{3,19}$/;
  const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  if (!loginRe.test(payload.login)) {
    errors.login = "Логин: латиница/цифры, первый символ — буква, длина 4–20.";
  }
  if (!emailRe.test(payload.email)) {
    errors.email = "Email некорректен.";
  }

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
  // payload приходит из rejectWithValue(err.data) в registerUser
  const fieldErrors = payload?.errors || null;
  const general = payload?.error || "";
  return { general, fieldErrors };
}

export default function Register() {
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

  const right = (
    <div>
      {(serverErr.general || serverErr.fieldErrors) && (
        <div className={styles.errorBox}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Исправьте ошибки</div>

          {serverErr.general ? <div>{serverErr.general}</div> : null}

          {fe.login?.length ? <div><b>Login:</b> {fe.login[0]}</div> : null}
          {fe.email?.length ? <div><b>Email:</b> {fe.email[0]}</div> : null}
          {fe.password?.length ? <div><b>Пароль:</b> {fe.password[0]}</div> : null}
          {fe.full_name?.length ? <div><b>Полное имя:</b> {fe.full_name[0]}</div> : null}
        </div>
      )}

      <form className={styles.form} onSubmit={onSubmit}>
        <div>
          <Input label="Login" value={form.login} onChange={setField("login")} />
          {clientErrors.login ? <div className={styles.hintError}>{clientErrors.login}</div> : null}
          {fe.login?.length ? <div className={styles.hintError}>{fe.login[0]}</div> : null}
        </div>

        <div>
          <Input label="Полное имя" value={form.full_name} onChange={setField("full_name")} />
          {fe.full_name?.length ? <div className={styles.hintError}>{fe.full_name[0]}</div> : null}
        </div>

        <div>
          <Input label="Email" value={form.email} onChange={setField("email")} />
          {clientErrors.email ? <div className={styles.hintError}>{clientErrors.email}</div> : null}
          {fe.email?.length ? <div className={styles.hintError}>{fe.email[0]}</div> : null}
        </div>

        <div>
          <Input label="Пароль" type="password" value={form.password} onChange={setField("password")} />
          {clientErrors.password ? <div className={styles.hintError}>{clientErrors.password}</div> : null}
          {fe.password?.length ? <div className={styles.hintError}>{fe.password[0]}</div> : null}
        </div>

        <div className={styles.actions}>
          <Button
            variant="ghost"
            type="button"
            onClick={() => nav("/")}
          >
            Назад
          </Button>
          <Button variant="ghost" type="submit">Далее</Button>
        </div>
      </form>
    </div>
  );

  return (
    <AuthLayout
      left={<h1 className={styles.h1}>Создать аккаунт</h1>}
      right={right}
    />
  );
}