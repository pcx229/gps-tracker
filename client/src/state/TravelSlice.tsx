import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Path from '../models/Path'
import Position from '../models/Position'
import { RootState } from './store'

interface TravelState {
  startTime: number | undefined;
  endTime: number | undefined;
  path: Path;
  tag: string | undefined;
  isSaved: Boolean;
}

const initialState: TravelState = {
  startTime: undefined,
  endTime: undefined,
  path: [],
  tag: undefined,
  isSaved: false
}

export const travelSlice = createSlice({
  name: 'travel',
  initialState,
  reducers: {
    startTravel: (state) => {
      state.startTime = Date.now()
      state.endTime = undefined
    },
    addTravel: (state, action: PayloadAction<Position>) => {
      state.path = [ ...state.path, action.payload]
    },
    tagTravel: (state, action: PayloadAction<string>) => {
      state.tag = action.payload
    },
    endTravel: (state) => {
      state.endTime = Date.now()
    },
    saveTravel: (state) => {
      state.isSaved = true
    },
    resetTravel: (state) => {
      state.startTime = undefined
      state.endTime = undefined
      state.path = []
      state.tag = undefined
      state.isSaved = false
    }
  }
})

export const { startTravel, addTravel, tagTravel, endTravel, saveTravel, resetTravel } = travelSlice.actions

export const selectTravel = (state: RootState) : TravelState => {
  return { 
    startTime: state.travel.startTime, 
    endTime: state.travel.endTime,
    path: state.travel.path, 
    tag: state.travel.tag,
    isSaved: state.travel.isSaved 
  }
}

export default travelSlice.reducer