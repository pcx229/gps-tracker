import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Record from '../models/Record'
import services from '../services'
import { RootState } from './store'

interface HistoryState {
  list: Array<Record>;
  loading: Boolean;
  operating: Boolean;
  error: string | undefined;
}

const initialState: HistoryState = {
    list: [],
    loading: true,
    operating: false,
    error: undefined
}

export const fetchAllHistory = createAsyncThunk(
  'history/fetchAllHistory',
  async (_, { rejectWithValue }) => {
    try {
        return await services.trackerHistory.fetchAll()
    } catch(e) {
        return rejectWithValue(e.message)
    }
  }
)

export const addToHistory = createAsyncThunk(
  'history/addToHistory',
  async (record : Record, { rejectWithValue }) => {
    try {
        await services.trackerHistory.add(record)
        return record
    } catch(e) {
      console.log("wtf is happening")
        return rejectWithValue(e.message)
    }
  }
)

export const removeFromHistory = createAsyncThunk(
  'history/removeFromHistory',
  async (id : string, { rejectWithValue }) => {
    try {
        await services.trackerHistory.remove(id)
        return id
    } catch(e) {
        return rejectWithValue(e.message)
    }
  }
)

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // fetchAllHistory
    builder.addCase(fetchAllHistory.pending, (state, action) => {
        state.loading = true
        state.error = undefined
    })
    builder.addCase(fetchAllHistory.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
    })
    builder.addCase(fetchAllHistory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
    })
    // addToHistory
    builder.addCase(addToHistory.pending, (state, action) => {
        state.operating = true
        state.error = undefined
    })
    builder.addCase(addToHistory.fulfilled, (state, action) => {
        state.operating = false
        state.list.push(action.payload)
    })
    builder.addCase(addToHistory.rejected, (state, action) => {
        state.operating = false
        state.error = action.payload as string
    })
    // removeFromHistory
    builder.addCase(removeFromHistory.pending, (state, action) => {
      state.operating = true
      state.error = undefined
    })
    builder.addCase(removeFromHistory.fulfilled, (state, action) => {
        state.operating = false
        state.list = state.list.filter((record) => record.startTime !== Number(action.payload))
    })
    builder.addCase(removeFromHistory.rejected, (state, action) => {
        state.operating = false
        state.error = action.payload as string
    })
  }
})

export const selectHistory = (state: RootState) : HistoryState => {
  return { 
    list: state.history.list, 
    loading: state.history.loading,
    operating: state.history.operating,
    error: state.history.error
  }
}

export default historySlice.reducer