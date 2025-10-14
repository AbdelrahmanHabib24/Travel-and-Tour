// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userslice";
import paymentReducer from "./paymentslice";
import commentsReducer from "./commentsSlice"; 

export const store = configureStore({
  reducer: {
    user: userReducer,
    payment: paymentReducer,
    comments: commentsReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
