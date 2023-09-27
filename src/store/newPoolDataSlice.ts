import { Draft, PayloadAction, createSlice } from '@reduxjs/toolkit'

interface PoolCreated{
  token0: string;
  token1: string;
  pool: string;
}

interface NewPoolDataState {
  data: PoolCreated[];
}

const newPoolDataSlice = createSlice({
  name: 'newPoolData',
  initialState: {
    data: [] as PoolCreated[],
  },
  reducers: {
    setNewPoolData: (state: Draft<NewPoolDataState>, action: PayloadAction<PoolCreated[]>) => {
      state.data = action.payload;
    },
  },
});

export const { setNewPoolData } = newPoolDataSlice.actions;
export default newPoolDataSlice.reducer;
