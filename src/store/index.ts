import { combineReducers, configureStore } from "@reduxjs/toolkit"
import poolDataSlice from "./poolDataSlice"

export const store = configureStore({
  reducer: {
    poolData: poolDataSlice
  },
})

const rootReducer = combineReducers({
  poolData: poolDataSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
