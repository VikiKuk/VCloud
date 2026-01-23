import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { initAuth } from "../features/auth/authSlice";

import AuthPage from "../pages/AuthPage";
import RegisterPage from "../pages/RegisterPage";
import FilesPage from "../pages/Storage";
import AdminPage from "../pages/AdminUsers";

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  const isAdmin = !!user?.is_admin;

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={isAdmin ? "/admin" : "/app"} /> : <AuthPage />} />
      <Route path="/register" element={user ? <Navigate to={isAdmin ? "/admin" : "/app"} /> : <RegisterPage />} />
      <Route path="/app" element={user ? <FilesPage /> : <Navigate to="/" />} />
      <Route path="/admin" element={user ? <AdminPage /> : <Navigate to="/" />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}