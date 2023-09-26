import { combineReducers, configureStore } from "@reduxjs/toolkit"
import poolDataSlice from "./poolDataSlice"
import newPoolDataSlice from "./newPoolDataSlice"

export const store = configureStore({
  reducer: {
    poolData: poolDataSlice,
    newPoolData: newPoolDataSlice,
  },
})

const rootReducer = combineReducers({
  poolData: poolDataSlice,
  newPoolData: newPoolDataSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
