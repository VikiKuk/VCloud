import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFiles, uploadFile, deleteFile, renameFile, updateComment, getPublicLink } from "../features/files/filesSlice";
import { useLocation } from "react-router-dom";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Storage() {
  const dispatch = useDispatch();
  const q = useQuery();
  const userId = q.get("user_id"); // только для админа фактически, бэк сам проверит
  const { files, stats, error } = useSelector(s => s.files);

  const [file, setFile] = useState(null);
  const [comment, setComment] = useState("");
  const [linkMsg, setLinkMsg] = useState("");

  const reload = () => dispatch(fetchFiles({ userId }));

  useEffect(() => { reload(); }, [userId]); // eslint-disable-line

  const onUpload = async (e) => {
    e.preventDefault();
    setLinkMsg("");
    if (!file) return;
    await dispatch(uploadFile({ file, comment, userId })).unwrap();
    setFile(null);
    setComment("");
    await reload();
  };

  const onRename = async (f) => {
    const name = prompt("Новое имя файла:", f.original_name);
    if (!name) return;
    await dispatch(renameFile({ fileId: f.id, original_name: name })).unwrap();
  };

  const onComment = async (f) => {
    const c = prompt("Комментарий:", f.comment || "");
    if (c === null) return;
    await dispatch(updateComment({ fileId: f.id, comment: c })).unwrap();
  };

  const onPublicLink = async (f) => {
    const data = await dispatch(getPublicLink(f.id)).unwrap();
    const full = window.location.origin + data.public_link;
    await navigator.clipboard.writeText(full);
    setLinkMsg(`Ссылка скопирована: ${full}`);
  };

  const onDelete = async (f) => {
    setLinkMsg("");
    await dispatch(deleteFile(f.id)).unwrap();
    await reload();
  };

  return (
    <div className="card">
      <h2>Файловое хранилище</h2>

      {error && <div className="error">{error}</div>}
      {stats && (
        <div className="hint">
          Файлов: <b>{stats.count}</b>, общий размер: <b>{stats.total_size}</b> байт
        </div>
      )}

      <form onSubmit={onUpload} className="form">
        <label>Загрузка файла</label>
        <input type="file" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
        <label>Комментарий</label>
        <input value={comment} onChange={(e)=>setComment(e.target.value)} />
        <button className="btn" type="submit">Загрузить</button>
      </form>

      {linkMsg && <div className="hint">{linkMsg}</div>}

      <table className="table">
        <thead>
          <tr>
            <th>Имя</th><th>Комментарий</th><th>Размер</th><th>Загружен</th><th>Последнее скачивание</th><th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {files.map(f => (
            <tr key={f.id}>
              <td>{f.original_name}</td>
              <td>{f.comment}</td>
              <td>{f.size}</td>
              <td>{new Date(f.uploaded_at).toLocaleString()}</td>
              <td>{f.last_downloaded_at ? new Date(f.last_downloaded_at).toLocaleString() : "-"}</td>
              <td className="row">
                <a href={`/api/files/${f.id}/download`} target="_blank" rel="noreferrer">Скачать</a>
                <button onClick={()=>onRename(f)}>Переименовать</button>
                <button onClick={()=>onComment(f)}>Комментарий</button>
                <button onClick={()=>onPublicLink(f)}>Ссылка</button>
                <button className="danger" onClick={() => onDelete(f)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="hint">
        Публичная ссылка обезличена (token) и отдаёт файл с оригинальным именем.
      </div>
    </div>
  );
}