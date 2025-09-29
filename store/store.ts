import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userslice";
import paymentReducer from "./paymentslice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    payment: paymentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
