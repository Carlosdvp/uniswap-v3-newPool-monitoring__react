import { Draft, PayloadAction, createSlice } from '@reduxjs/toolkit'

interface EventDetails {
  txHash: string;
  token0: string;
  token1: string;
  poolAddress: string;
}

interface PoolDataState {
  data: EventDetails[];
  fromBlock: number;
}

const poolDataSlice = createSlice({
  name: 'poolData',
  initialState: {
    data: [] as EventDetails[],
    fromBlock: 0
  },
  reducers: {
    setPoolData: (state: Draft<PoolDataState>, action: PayloadAction<EventDetails[]>) => {
      state.data = action.payload;
    },
    setFromBlock: (state: Draft<PoolDataState>, action: PayloadAction<number>) => {
      state.fromBlock = action.payload;
    },
  }
})

export const { setPoolData, setFromBlock } = poolDataSlice.actions;
export default poolDataSlice.reducer;
