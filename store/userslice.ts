import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id?: number;
  username?: string;
  email?: string;
  accessToken?: string;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  isLoggedIn: false,
};

// Fetch user
export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  try {
    const res = await fetch("/api/auth/user", { credentials: "include" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user as Partial<UserState> | null;
  } catch {
    return null;
  }
});

// Logout user
export const logoutUser = createAsyncThunk("user/logoutUser", async () => {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  return null;
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload, isLoggedIn: true };
    },
    clearUser: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (_, action) =>
        action.payload ? { ...action.payload, isLoggedIn: true } : initialState
      )
      .addCase(fetchUser.rejected, () => initialState)
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
