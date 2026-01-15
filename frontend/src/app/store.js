import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import usersReducer from "../features/users/usersSlice";
import filesReducer from "../features/files/filesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    files: filesReducer
  }
});