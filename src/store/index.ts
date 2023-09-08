import { configureStore } from "@reduxjs/toolkit"
import poolDataSlice from "./poolDataSlice"

export const store = configureStore({
  reducer: {
    poolData: poolDataSlice
  },
})
