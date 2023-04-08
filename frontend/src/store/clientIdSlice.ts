import { createSlice } from "@reduxjs/toolkit";

export interface clientID {
  id: string;
}

const initialState: clientID = { id: "" };

export const clientIdSlice = createSlice({
  name: "clientId",
  initialState,
  reducers: {
    setClientId: (state, action) => {
      state.id = action.payload;
    },
  },
});
export const { setClientId } = clientIdSlice.actions;
export default clientIdSlice.reducer;
