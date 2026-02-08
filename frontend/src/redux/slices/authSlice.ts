// src/redux/slices/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// ────────────────────────────────────────────────
// Define the exact User shape you provided
// ────────────────────────────────────────────────
export interface User {
  username: string;
  email: string;
  role: "Admin" | "Employee"; // or import RoleType enum if you prefer
  employeeId: string;
}

// Optional: if you later get more fields from API (id, createdAt, etc.)
// export interface User {
//   username: string;
//   email: string;
//   role: "Admin" | "Employee";
//   employeeId: string;
//   id?: string;
//   createdAt?: string;
// }

// ────────────────────────────────────────────────
// State shape
// ────────────────────────────────────────────────
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

// ────────────────────────────────────────────────
// Slice with typed reducers
// ────────────────────────────────────────────────
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set user after login
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },

    // Set auth status (e.g. after logout or failed auth check)
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      if (!action.payload) {
        state.user = null; // clear user on logout/unauth
      }
      state.loading = false;
    },

    // Loading state during auth check/login
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Optional: explicit logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
});

// Export actions
export const { setUser, setIsAuthenticated, setLoading, logout } = authSlice.actions;

// Export reducer
export default authSlice.reducer;