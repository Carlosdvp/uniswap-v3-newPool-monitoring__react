import { Draft, PayloadAction, createSlice } from '@reduxjs/toolkit'

interface EventDetails {
  txHash: string;
  token0: string;
  token1: string;
  poolAddress: string;
}

interface PoolDataState {
  data: EventDetails[];
}

const poolDataSlice = createSlice({
  name: 'poolData',
  initialState: {
    data: [] as EventDetails[]
  },
  reducers: {
    setPoolData: (state: Draft<PoolDataState>, action: PayloadAction<EventDetails[]>) => {
      state.data = action.payload;
    }
  }
})

export const { setPoolData } = poolDataSlice.actions;
export default poolDataSlice.reducer;
