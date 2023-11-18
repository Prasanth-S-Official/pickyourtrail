// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userId:'',
    userName: '',
    role: '',

  },
  reducers: {
    setUserInfo: (state, action) => {
        state.userId = action.payload.userId;
        state.userName = action.payload.userName;
        state.role = action.payload.role;
    },
    clearUserInfo: (state) => {
        state.userId = "";
        state.userName = "";
        state.role = "";
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
