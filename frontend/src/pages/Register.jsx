import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

function validate(payload) {
  const errors = {};
  const loginRe = /^[A-Za-z][A-Za-z0-9]{3,19}$/;
  const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  if (!loginRe.test(payload.login)) errors.login = "Логин: латиница/цифры, первый символ буква, длина 4–20.";
  if (!emailRe.test(payload.email)) errors.email = "Email некорректен.";
  const pw = payload.password || "";
  const hasUpper = /[A-Z]/.test(pw);
  const hasDigit = /\d/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  if (pw.length < 6 || !hasUpper || !hasDigit || !hasSpecial) {
    errors.password = "Пароль: >=6, 1 заглавная, 1 цифра, 1 спецсимвол.";
  }
  return errors;
}

export default function Register() {
  const [form, setForm] = useState({ login: "", full_name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const dispatch = useDispatch();
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) return;

    try {
      await dispatch(registerUser(form)).unwrap();
      nav("/login");
    } catch (err) {
      setServerError(err?.message || "Ошибка регистрации");
    }
  };

  return (
    <div className="card">
      <h2>Регистрация</h2>
      {serverError && <div className="error">{serverError}</div>}

      <form onSubmit={onSubmit} className="form">
        <label>Логин</label>
        <input value={form.login} onChange={(e)=>setForm({...form, login: e.target.value})}/>
        {errors.login && <div className="hint error">{errors.login}</div>}

        <label>Полное имя</label>
        <input value={form.full_name} onChange={(e)=>setForm({...form, full_name: e.target.value})}/>

        <label>Email</label>
        <input value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})}/>
        {errors.email && <div className="hint error">{errors.email}</div>}

        <label>Пароль</label>
        <input type="password" value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})}/>
        {errors.password && <div className="hint error">{errors.password}</div>}

        <button className="btn" type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
}