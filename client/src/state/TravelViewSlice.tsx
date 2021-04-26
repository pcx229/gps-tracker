import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Path from '../models/Path'
import Record from '../models/Record'
import services from '../services'
import { RootState } from './store'
import ShareTrackingAPI from '../services/ShareTrackingAPI'

interface TravelViewState {
  path: Path;
  loading: Boolean;
  error: string | undefined;
}

const initialState: TravelViewState = {
  path: [],
  loading: true,
  error: undefined
}

export const HISTORY_RECORD_NOT_FOUND = "history record not found";

export const fetchFromHistory = createAsyncThunk(
  'history/fetchFromHistory',
  async (id : string, { rejectWithValue }) => {
    try {
        const record = await services.trackerHistory.get(id)
        if(record === undefined) {
          return rejectWithValue(HISTORY_RECORD_NOT_FOUND)
        }
        return record.path
    } catch(e) {
        return rejectWithValue(e.message)
    }
  }
)

export const fetchFromShare = createAsyncThunk(
  'history/fetchFromShare',
  async (hash : string, { rejectWithValue }) => {
    try {
        const {data} = await ShareTrackingAPI.download(hash)
        if(data === undefined) {
          return rejectWithValue(HISTORY_RECORD_NOT_FOUND)
        }
        return (data as Record).path
    } catch(e) {
        return rejectWithValue(e.message)
    }
  }
)

export const travelViewSlice = createSlice({
  name: 'travel_view',
  initialState,
  reducers: {
    resetTravelView: (state) => {
      state.loading = true
      state.error = undefined
    }
  },
  extraReducers: builder => {
    // fetchFromHistory
    builder.addCase(fetchFromHistory.pending, (state, action) => {
        state.loading = true
        state.error = undefined
    })
    builder.addCase(fetchFromHistory.fulfilled, (state, action) => {
        state.loading = false
        state.path = action.payload as Path
    })
    builder.addCase(fetchFromHistory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
    })
    // fetchFromShare
    builder.addCase(fetchFromShare.pending, (state, action) => {
        state.loading = true
        state.error = undefined
    })
    builder.addCase(fetchFromShare.fulfilled, (state, action) => {
        state.loading = false
        state.path = action.payload as Path
    })
    builder.addCase(fetchFromShare.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
    })
  }
})

export const { resetTravelView } = travelViewSlice.actions

export const selectTravelView = (state: RootState) : TravelViewState => {
  return { 
    path: state.travel_view.path, 
    loading: state.travel_view.loading,
    error: state.travel_view.error
  }
}

export default travelViewSlice.reducer