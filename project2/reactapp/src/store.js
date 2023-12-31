// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import loanReducer from './loanSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    loan:loanReducer,
  },
});

export default store;
