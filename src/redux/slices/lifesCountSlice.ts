import { createSlice } from '@reduxjs/toolkit'
const initialState: {count: number} = {
    count: 1
}
const slice = createSlice({
    initialState: initialState,
    name: 'countState',
    reducers: {
        setCount: (state, data) => {
            state.count = data.payload as number
        }
    }
})
export const countAction = slice.actions
export const countReducer = slice.reducer