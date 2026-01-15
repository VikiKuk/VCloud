import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch, ensureCsrf } from "../../app/api";

export const fetchUsers = createAsyncThunk("users/list", async () => {
  await ensureCsrf();
  const data = await apiFetch("/api/auth/users");
  return data.users;
});

export const deleteUser = createAsyncThunk("users/delete", async (userId) => {
  await ensureCsrf();
  await apiFetch(`/api/auth/users/${userId}`, { method: "DELETE" });
  return userId;
});

export const setAdmin = createAsyncThunk("users/setAdmin", async ({ userId, is_admin }) => {
  await ensureCsrf();
  const data = await apiFetch(`/api/auth/users/${userId}/admin`, {
    method: "PATCH",
    body: JSON.stringify({ is_admin })
  });
  return data.user;
});

const slice = createSlice({
  name: "users",
  initialState: { list: [], error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchUsers.pending, (s) => {
        s.error = null;
    });
    b.addCase(fetchUsers.fulfilled, (s, a) => {
        s.list = a.payload;
        s.error = null;
    });

    b.addCase(deleteUser.pending, (s) => {
        s.error = null;
    });
    b.addCase(deleteUser.fulfilled, (s, a) => {
        s.list = s.list.filter(u => u.id !== a.payload);
        s.error = null;
    });

    b.addCase(setAdmin.pending, (s) => {
        s.error = null;
    });
    b.addCase(setAdmin.fulfilled, (s, a) => {
        s.list = s.list.map(u => (u.id === a.payload.id ? a.payload : u));
        s.error = null;
    });

    b.addMatcher(
        (a) => a.type.startsWith("users/") && a.type.endsWith("/rejected"),
        (s, a) => {
        s.error = a.error?.message || "Ошибка";
        }
    );
  }
});

export default slice.reducer;