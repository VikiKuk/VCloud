import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch, ensureCsrf } from "../../app/api";

export const fetchFiles = createAsyncThunk("files/list", async ({ userId } = {}) => {
  await ensureCsrf();
  const qs = userId ? `?user_id=${encodeURIComponent(userId)}` : "";
  return await apiFetch(`/api/files${qs}`);
});

export const uploadFile = createAsyncThunk("files/upload", async ({ file, comment, userId }) => {
  await ensureCsrf();
  const qs = userId ? `?user_id=${encodeURIComponent(userId)}` : "";
  const fd = new FormData();
  fd.append("file", file);
  fd.append("comment", comment || "");
  return await apiFetch(`/api/files/upload${qs}`, { method: "POST", body: fd });
});

export const deleteFile = createAsyncThunk("files/delete", async (fileId) => {
  await ensureCsrf();
  await apiFetch(`/api/files/${fileId}`, { method: "DELETE" });
  return fileId;
});

export const renameFile = createAsyncThunk("files/rename", async ({ fileId, original_name }) => {
  await ensureCsrf();
  return await apiFetch(`/api/files/${fileId}/rename`, {
    method: "PATCH",
    body: JSON.stringify({ original_name })
  });
});

export const updateComment = createAsyncThunk("files/comment", async ({ fileId, comment }) => {
  await ensureCsrf();
  return await apiFetch(`/api/files/${fileId}/comment`, {
    method: "PATCH",
    body: JSON.stringify({ comment })
  });
});

export const getPublicLink = createAsyncThunk("files/publicLink", async (fileId) => {
  await ensureCsrf();
  return await apiFetch(`/api/files/${fileId}/public-link`, { method: "POST" });
});

const slice = createSlice({
  name: "files",
  initialState: { user: null, files: [], stats: null, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchFiles.fulfilled, (s, a) => {
      s.user = a.payload.user;
      s.files = a.payload.files;
      s.stats = a.payload.stats;
      s.error = null;
    });

    b.addCase(uploadFile.fulfilled, (s, a) => {
    });

    b.addCase(deleteFile.fulfilled, (s, a) => {
      s.files = s.files.filter(f => f.id !== a.payload);
    });

    b.addCase(renameFile.fulfilled, (s, a) => {
      const updated = a.payload.file;
      s.files = s.files.map(f => (f.id === updated.id ? { ...f, ...updated } : f));
    });

    b.addCase(updateComment.fulfilled, (s, a) => {
      const updated = a.payload.file;
      s.files = s.files.map(f => (f.id === updated.id ? { ...f, ...updated } : f));
    });

    b.addMatcher((a) => a.type.endsWith("/rejected"), (s, a) => {
      s.error = a.error.message;
    });
  }
});

export default slice.reducer;