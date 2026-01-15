import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";

export default function NavBar() {
  const user = useSelector(s => s.auth.user);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const onLogout = async () => {
    await dispatch(logoutUser());
    nav("/");
  };

  return (
    <div className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">Cloud Storage</Link>
        {user && <Link to="/storage">Хранилище</Link>}
        {user?.is_admin && <Link to="/admin">Админка</Link>}
      </div>

      <div className="nav-right">
        {!user && <Link to="/login">Вход</Link>}
        {!user && <Link to="/register">Регистрация</Link>}
        {user && <span className="user">{user.login}</span>}
        {user && <button onClick={onLogout}>Выход</button>}
      </div>
    </div>
  );
}