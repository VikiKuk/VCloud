import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

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
  const fieldErrors = payload?.errors || null;
  const general = payload?.error || "";

  const items = [];
  if (fieldErrors) {
    for (const [field, messages] of Object.entries(fieldErrors)) {
      const arr = Array.isArray(messages) ? messages : [String(messages)];
      arr.forEach((m) => items.push({ field, message: String(m) }));
    }
  }

  return { general, fieldErrors, items };
}

function label(field) {
  const map = {
    login: "Логин",
    username: "Логин",
    email: "Email",
    full_name: "Полное имя",
    password: "Пароль",
  };
  return map[field] || field;
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    login: "",
    full_name: "",
    email: "",
    password: "",
  });

  const [clientErrors, setClientErrors] = useState({});
  const [serverErr, setServerErr] = useState({ general: "", fieldErrors: null, items: [] });

  const dispatch = useDispatch();
  const nav = useNavigate();

  const setField = (name) => (e) => {
    setForm((p) => ({ ...p, [name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // очистка серверных ошибок при новой попытке
    setServerErr({ general: "", fieldErrors: null, items: [] });

    const v = validate(form);
    setClientErrors(v);
    if (Object.keys(v).length) return;

    try {
      await dispatch(registerUser(form)).unwrap();
      nav("/login");
    } catch (payload) {
      const normalized = normalizeServerErrors(payload);
      if (!normalized.general && normalized.items.length === 0) {
        normalized.general = "Ошибка регистрации";
      }
      setServerErr(normalized);
    }
  };

  const fe = serverErr.fieldErrors || {};

  return (
    <div className="card">
      <h2>Регистрация</h2>

      {(serverErr.general || serverErr.items.length > 0) && (
        <div className="error">
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Исправьте ошибки в форме</div>

          {serverErr.general && <div>{serverErr.general}</div>}

          {serverErr.items.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {serverErr.items.map((it, idx) => (
                <li key={idx}>
                  <b>{label(it.field)}:</b> {it.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <form onSubmit={onSubmit} className="form">
        <label>Логин</label>
        <input value={form.login} onChange={setField("login")} />
        {clientErrors.login && <div className="hint error">{clientErrors.login}</div>}
        {fe.login?.length ? <div className="hint error">{fe.login[0]}</div> : null}
        {fe.username?.length ? <div className="hint error">{fe.username[0]}</div> : null}

        <label>Полное имя</label>
        <input value={form.full_name} onChange={setField("full_name")} />
        {fe.full_name?.length ? <div className="hint error">{fe.full_name[0]}</div> : null}

        <label>Email</label>
        <input value={form.email} onChange={setField("email")} />
        {clientErrors.email && <div className="hint error">{clientErrors.email}</div>}
        {fe.email?.length ? <div className="hint error">{fe.email[0]}</div> : null}

        <label>Пароль</label>
        <input type="password" value={form.password} onChange={setField("password")} />
        {clientErrors.password && <div className="hint error">{clientErrors.password}</div>}
        {fe.password?.length ? <div className="hint error">{fe.password[0]}</div> : null}

        <button className="btn" type="submit">
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}