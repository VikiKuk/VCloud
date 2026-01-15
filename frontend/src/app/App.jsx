import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { initAuth } from "../features/auth/authSlice";
import NavBar from "../components/NavBar";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminUsers from "../pages/AdminUsers";
import Storage from "../pages/Storage";

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector(s => s.auth.user);

  useEffect(() => { dispatch(initAuth()); }, [dispatch]);

  return (
    <div className="container">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to="/storage" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/storage" /> : <Register />} />
        <Route path="/storage" element={user ? <Storage /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user?.is_admin ? <AdminUsers /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}