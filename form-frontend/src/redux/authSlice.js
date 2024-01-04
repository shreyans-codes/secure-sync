import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  loginToAccount,
  logout,
  registerUser,
  verifyCode,
  fetchAccount,
} from "./authService";

const initialState = {
  user: null,
  isError: false,
  isLoading: false,
  isSuccess: false,
  mfaEnabled: false,
  emailVerified: false,
  message: "",
};

export const registerAsync = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await registerUser(userData);
      return [response, userData.mfaEnabled];
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const loginAsync = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const resp = await loginToAccount(userData);
      return resp;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const verifyMFACodeAsync = createAsyncThunk(
  "auth/verify",
  async (userData, thunkAPI) => {
    try {
      return await verifyCode(userData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchAccountAsync = createAsyncThunk(
  "auth/fetchAccount",
  async (userData, thunkAPI) => {
    try {
      const response = await fetchAccount();
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logoutFromAccount = createAsyncThunk("auth/logout", async () => {
  logout();
});

export const authSlice = createSlice({
  name: "authActions",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: {
    [registerAsync.pending]: (state) => {
      state.isLoading = true;
    },
    [registerAsync.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      const [response, mfaEnabled] = action.payload;
      state.mfaEnabled = mfaEnabled;
      state.emailVerified = false;
      if (!mfaEnabled) {
        state.user = null;
        state.message = "Please verify email";
      } else {
        state.message = response.data.secretImageUri;
      }
    },
    [registerAsync.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
      state.emailVerified = false;
      state.user = null;
    },
    [loginAsync.pending]: (state) => {
      state.isLoading = true;
    },
    [loginAsync.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      const [response, mfaEnabled] = action.payload;
      state.mfaEnabled = mfaEnabled;
      state.message = "";
      if (!mfaEnabled) state.user = response.user;
      //TODO: Check wether the user is enabled or not
    },
    [loginAsync.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
      state.user = null;
    },
    [verifyMFACodeAsync.pending]: (state) => {
      state.isLoading = true;
    },
    [verifyMFACodeAsync.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.user = action.payload.data.body.user;
      state.message = "";
    },
    [verifyMFACodeAsync.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message = action.payload;
      state.user = null;
    },
    [fetchAccountAsync.pending]: (state, action) => {
      state.isLoading = true;
    },
    [fetchAccountAsync.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.user = action.payload;
      state.message = "";
    },
    [fetchAccountAsync.rejected]: (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      state.user = null;
      state.message = action.payload;
    },
    [logoutFromAccount.fulfilled]: (state) => {
      state.user = null;
      state.message = "";
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.mfaEnabled = false;
    },
  },
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;
