import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser, setAdmin } from "../features/users/usersSlice";
import { fetchFiles } from "../features/files/filesSlice";
import { useNavigate } from "react-router-dom";

export default function AdminUsers() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const users = useSelector(s => s.users.list);
  const err = useSelector(s => s.users.error);

  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);

  const openStorage = async (userId) => {
    // просто переход на страницу storage, которая сможет читать user_id из query при желании
    nav(`/storage?user_id=${userId}`);
  };

  return (
    <div className="card">
      <h2>Администрирование пользователей</h2>
      {err && <div className="error">{err}</div>}

      <table className="table">
        <thead>
          <tr>
            <th>ID</th><th>Логин</th><th>Email</th><th>ФИО</th><th>Admin</th><th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.login}</td>
              <td>{u.email}</td>
              <td>{u.full_name}</td>
              <td>
                <input
                  type="checkbox"
                  checked={u.is_admin}
                  onChange={(e)=>dispatch(setAdmin({ userId: u.id, is_admin: e.target.checked }))}
                />
              </td>
              <td className="row">
                <button onClick={()=>openStorage(u.id)}>Хранилище</button>
                <button className="danger" onClick={()=>dispatch(deleteUser(u.id))}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="hint">
        Админ может открывать хранилище любого пользователя и управлять файлами.
      </div>
    </div>
  );
}