import { configureStore } from "@reduxjs/toolkit";
import clientIdReducer from "./clientIdSlice";

export const store = configureStore({
  reducer: {
    clientId: clientIdReducer,
  },
});
