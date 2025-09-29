import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PaymentState {
  token: string | null;
}

const initialState: PaymentState = {
  token: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearPaymentToken: (state) => {
      state.token = null;
    },
  },
});

export const { setPaymentToken, clearPaymentToken } = paymentSlice.actions;
export default paymentSlice.reducer;
