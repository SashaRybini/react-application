import { createSlice } from '@reduxjs/toolkit'
const initialState: {direction: 'column' | 'row'} = {
    direction: 'row'
}
const slice = createSlice({
    initialState: initialState,
    name: 'directionState',
    reducers: {
        setDirection: (state, data) => {
            state.direction = data.payload as 'row' | 'column'
        }
    }
})
export const directionActions = slice.actions
export const directionReducer = slice.reducer