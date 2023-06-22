import { createSlice } from '@reduxjs/toolkit'
import config from '../../config/life-game-config.json'
const {dimension} = config
function getSize() {
    return Math.min(window.innerHeight, window.innerHeight) / dimension - 2 //border 1px
}
const initialState: {size: number} = { 
    size: getSize()
}
const slice = createSlice({
    initialState: initialState,
    name: 'sizeState',
    reducers: {
        setSize: (state) => {
            state.size = getSize()
        }
    }
})
export const sizeAction = slice.actions
export const sizeReducer = slice.reducer