import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ login: "", password: "" });
  const [err, setErr] = useState("");
  const dispatch = useDispatch();
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const user = await dispatch(loginUser(form)).unwrap();
      nav(user.is_admin ? "/admin" : "/storage");
    } catch (e2) {
      setErr(e2?.message || "Ошибка входа");
    }
  };

  return (
    <div className="card">
      <h2>Вход</h2>
      {err && <div className="error">{err}</div>}
      <form onSubmit={onSubmit} className="form">
        <label>Логин</label>
        <input value={form.login} onChange={(e)=>setForm({...form, login: e.target.value})}/>
        <label>Пароль</label>
        <input type="password" value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})}/>
        <button className="btn" type="submit">Войти</button>
      </form>
    </div>
  );
}