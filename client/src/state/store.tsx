import { configureStore } from '@reduxjs/toolkit'
import { travelSlice } from './TravelSlice'
import { watchingPositionSlice } from './WatchPositionSlice'
import { historySlice } from './HistorySlice'
import { travelViewSlice } from './TravelViewSlice'

const store = configureStore({
  reducer: {
    travel: travelSlice.reducer,
    watching_position: watchingPositionSlice.reducer,
    history: historySlice.reducer,
    travel_view: travelViewSlice.reducer
  }
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch