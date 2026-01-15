import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch, ensureCsrf } from "../../app/api";

export const initAuth = createAsyncThunk("auth/init", async () => {
  await ensureCsrf();
  try {
    const data = await apiFetch("/api/auth/me");
    return data.user;
  } catch {
    return null;
  }
});

export const registerUser = createAsyncThunk("auth/register", async (payload) => {
  await ensureCsrf();
  return await apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
});

export const loginUser = createAsyncThunk("auth/login", async (payload) => {
  await ensureCsrf();
  const data = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return data.user;
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await ensureCsrf();
  await apiFetch("/api/auth/logout", { method: "POST" });
  return null;
});

const slice = createSlice({
  name: "auth",
  initialState: { user: null, status: "idle", error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(initAuth.fulfilled, (s, a) => { s.user = a.payload; });
    b.addCase(loginUser.fulfilled, (s, a) => { s.user = a.payload; s.error = null; });
    b.addCase(logoutUser.fulfilled, (s) => { s.user = null; });

    b.addMatcher((a) => a.type.endsWith("/rejected"), (s, a) => {
      s.error = a.error?.message || "Ошибка";
    });
  }
});

export default slice.reducer;