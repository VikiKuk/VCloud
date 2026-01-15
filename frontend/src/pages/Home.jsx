import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Home() {
  const user = useSelector(s => s.auth.user);

  return (
    <div className="card">
      <h1>Облачное хранилище</h1>
      <p>
        Приложение позволяет загружать, скачивать, переименовывать и удалять файлы,
        а также создавать публичные ссылки для скачивания.
      </p>

      {!user ? (
        <div className="row">
          <Link className="btn" to="/register">Регистрация</Link>
          <Link className="btn" to="/login">Вход</Link>
        </div>
      ) : (
        <div className="row">
          <Link className="btn" to="/storage">Перейти в хранилище</Link>
        </div>
      )}
    </div>
  );
}