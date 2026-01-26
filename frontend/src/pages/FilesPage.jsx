import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import Sidebar from "../components/sidebar/Sidebar";
import FileGrid from "../components/files/FileGrid";
import FileTopBar from "../components/files/FileTopBar";
import FileMenu from "../components/files/FileMenu";

import DeleteModal from "../components/modals/DeleteModal";
import ShareModal from "../components/modals/ShareModal";
import RenameModal from "../components/modals/RenameModal";
import CommentModal from "../components/modals/CommentModal";

import {
  fetchFiles,
  deleteFile,
  renameFile,
  updateComment,
  getPublicLink,
} from "../features/files/filesSlice";

import styles from "./FilesPage.module.css";

export default function FilesPage() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const { files, error, user: filesOwner } = useSelector((s) => s.files);
  const [selectedId, setSelectedId] = useState(null);

  // UI state
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [publicLink, setPublicLink] = useState("");

  const userId = sp.get("user_id"); // админский просмотр чужого хранилища

  useEffect(() => {
    dispatch(fetchFiles(userId ? { userId } : {}));
    setSelectedId(null);
    setMenuOpen(false);
    setPublicLink("");
  }, [dispatch, userId]);

  const sortedFiles = useMemo(() => {
    const list = Array.isArray(files) ? files.slice() : [];
    list.sort((a, b) =>
      (a.original_name || "").localeCompare(b.original_name || "", "ru", {
        sensitivity: "base",
      })
    );
    return list;
  }, [files]);

  // выбранный файл всегда из стора
  const selectedFile = useMemo(() => {
    if (!selectedId) return null;
    return sortedFiles.find((f) => f.id === selectedId) || null;
  }, [sortedFiles, selectedId]);

  const title = useMemo(() => {
    if (userId && filesOwner) {
      return `Файлы пользователя ${filesOwner.full_name || filesOwner.login}`;
    }
    return "Файлы";
  }, [userId, filesOwner]);

  const closeSelection = useCallback(() => {
    setSelectedId(null);
    setMenuOpen(false);
    setPublicLink("");
  }, []);

  const onNavigate = (where) => {
    if (where === "logout") {
      nav("/");
      return;
    }
    if (where === "admin") {
      nav("/admin");
      return;
    }
    if (where === "files") {
      nav("/app");
      return;
    }
  };

  const onSelect = (f) => {
    setSelectedId(f?.id ?? null);
    setMenuOpen(false);
    setPublicLink("");
  };

  //  actions 
  const onDownload = () => {
    if (!selectedId) return;
    window.location.href = `/api/files/${selectedId}/download`;
  };

  const onShare = async () => {
    if (!selectedId) return;
    try {
      setPublicLink("");

      const res = await dispatch(getPublicLink(selectedId)).unwrap();
      setPublicLink(res.public_link || "");
      setShareOpen(true);
    } catch (e) {
      console.error("share link error:", e);
    }
  };



  const onAskDelete = () => {
    if (!selectedId) return;
    setDeleteOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!selectedId) return;
    await dispatch(deleteFile(selectedId));
    setDeleteOpen(false);
    closeSelection();
  };

  const onOpenRename = () => {
    if (!selectedId) return;
    setRenameOpen(true);
  };

  const onSubmitRename = async (newName) => {
    if (!selectedId) return;
    await dispatch(renameFile({ fileId: selectedId, original_name: newName })).unwrap();
    await dispatch(fetchFiles(userId ? { userId } : {}));
    setRenameOpen(false);
    setMenuOpen(false);
  };

  const onOpenComment = () => {
    if (!selectedId) return;
    setCommentOpen(true);
  };

  const onSubmitComment = async (comment) => {
    if (!selectedId) return;
    await dispatch(updateComment({ fileId: selectedId, comment })).unwrap();
    await dispatch(fetchFiles(userId ? { userId } : {}));
    setCommentOpen(false);
    setMenuOpen(false);
  };

  return (
    <AppLayout sidebar={<Sidebar active="files" onNavigate={onNavigate} />}>
      <div className={styles.main} onClick={closeSelection}>
        {/* Верхняя зона: welcome + topbar поверх */}
        <div className={styles.topRegion} onClick={(e) => e.stopPropagation()}>
          <div className={styles.welcome}>
            <h1 className={styles.welcomeTitle}>Добро пожаловать в облако</h1>
          </div>

          {/* topbar поверх welcome */}
          <div className={styles.topBarOverlay}>
            <FileTopBar
              file={selectedFile}
              onDownload={onDownload}
              onShare={onShare}
              onDelete={onAskDelete}
              onMore={() => setMenuOpen((v) => !v)}
              onClose={closeSelection}
            />

            <FileMenu
              open={menuOpen && !!selectedFile}
              onClose={() => setMenuOpen(false)}
              onRename={onOpenRename}
              onComment={onOpenComment}
            />
          </div>
        </div>

        {/* Контент всегда начинается ниже slot */}
        <div className={styles.content} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <h2 className={styles.h2}>{title}</h2>
          </div>

          {error ? <div className={styles.error}>Ошибка: {error}</div> : null}

          <FileGrid
            files={sortedFiles}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        </div>

        {/* MODALS */}
        <ShareModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          link={publicLink ? window.location.origin + publicLink : ""}
        />

        <DeleteModal
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={onConfirmDelete}
          fileName={selectedFile?.original_name || ""}
        />

        <RenameModal
          open={renameOpen}
          onClose={() => setRenameOpen(false)}
          initialName={selectedFile?.original_name || ""}
          onSubmit={onSubmitRename}
        />

        <CommentModal
          open={commentOpen}
          onClose={() => setCommentOpen(false)}
          initialComment={selectedFile?.comment || ""}
          onSubmit={onSubmitComment}
        />
      </div>
    </AppLayout>
  );
}