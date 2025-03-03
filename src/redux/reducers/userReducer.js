import { createSlice } from "@reduxjs/toolkit";
import {
  getCurrentUserThunk,
  loginGoogleThunk,
  loginThunk,
  registerThunk,
} from "../actions/userThunk";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    updateMembershipUser: (state, action) => {
      if (state.user) {
        state.user.membership = action.payload.membership;
      }
    },
    updateAccountBalanceUser: (state, action) => {
      if (state.user) {
        state.user.account_balance = action.payload.account_balance;
      }
    },
    removeUser: (state) => {
      state.user = null;
    },
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem("accesstoken");
      localStorage.removeItem("refreshtoken");
    },
  },
  extraReducers: (builder) => {
    builder
      // login case
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        localStorage.setItem("accesstoken", action.payload.accessToken);
        localStorage.setItem("refreshtoken", action.payload.refreshToken);
        state.user = action.payload.account;
        state.loading = false;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      //login GG
      .addCase(loginGoogleThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginGoogleThunk.fulfilled, (state, action) => {
        localStorage.setItem("accesstoken", action.payload.accessToken);
        localStorage.setItem("refreshtoken", action.payload.refreshToken);
        state.user = action.payload.account;
        state.loading = false;
      })
      .addCase(loginGoogleThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      //register case
      .addCase(registerThunk.pending, (state) => {
        state.loading = true; 
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      //getCurrentUserThunk
      .addCase(getCurrentUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.account;
        state.loading = false;
      })
      .addCase(getCurrentUserThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const {
  updateUser,
  removeUser,
  logoutUser,
  updateMembershipUser,
  updateAccountBalanceUser,
} = userSlice.actions;
export default userSlice.reducer;
