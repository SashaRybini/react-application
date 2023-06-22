import { configureStore } from "@reduxjs/toolkit";
import { directionReducer } from "./slices/flexDirectionSlice";
import { countReducer } from "./slices/lifesCountSlice";
import { sizeReducer } from "./slices/cellSizeSlice";
export const store = configureStore({
    reducer: {
        directionState: directionReducer,
        countState: countReducer,
        sizeState: sizeReducer
    }
})