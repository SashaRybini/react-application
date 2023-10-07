import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isBlocked: false
}

const blockSlice = createSlice({
    initialState,
    name: 'blockState',
    reducers: {
        set: (state, data) => {
            state.isBlocked = data.payload
        }
    }
})
export const blockActions = blockSlice.actions;
export const blockReducer = blockSlice.reducer;