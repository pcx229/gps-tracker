
import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import Position, { GeolocationPositionToPosition } from '../models/Position'
import { AppDispatch, RootState } from './store'
import servies from '../services'

export enum ConnectionStatus { avilable = 0, unavilable, active, asking_permisision, permisision_rejected, timeout } 

interface WatchingPositionState {
  status: ConnectionStatus,
  current_position: Position | undefined,
  watch_id: any
}

const initialState: WatchingPositionState = {
    status: ConnectionStatus.avilable,
    current_position: undefined,
    watch_id: undefined
}

let updateCurrentWatchingPosition : (position: Position) => PayloadAction<Position>

export const selectPositionWatcherCurrentPosition = (state: RootState) => state.watching_position.current_position,
              selectPositionWatcherStatus = (state: RootState) => state.watching_position.status

export const selectWatchedPosition = (state: RootState) : [Position | undefined, ConnectionStatus] => {
  return [
    state.watching_position.current_position,
    state.watching_position.status
  ]
}

export const selectWatcherId = (state: RootState) => state.watching_position.watch_id

const selectSlice = (state: RootState) => state.watching_position

const updateWatchingPositionStatus : AsyncThunk<WatchingPositionState, ConnectionStatus, {}> = createAsyncThunk(
  'watching_position/updateWatchingStatus',
  async (status, { dispatch, getState }) : Promise<WatchingPositionState> => {
    let state = { ...selectSlice(getState() as RootState) }
    state.status = status
    if(status !== ConnectionStatus.active) {
      if(state.watch_id)
      servies.geolocation.clearWatch(state.watch_id)
      state.watch_id = undefined
      state.current_position = undefined
    }
    return state
  }
)

const callbackPositionWatcherUpdate = (dispatch: AppDispatch) => (position : GeolocationPosition) : void => {
  dispatch(updateCurrentWatchingPosition(GeolocationPositionToPosition(position)))
}

const callbackPositionWatcherError = (dispatch: AppDispatch) => (error : GeolocationPositionError) : void => {
  let status : ConnectionStatus = ConnectionStatus.unavilable;
  switch(error.code) {
    case error.PERMISSION_DENIED:
      status = ConnectionStatus.permisision_rejected
      break;
    case error.POSITION_UNAVAILABLE:
      status = ConnectionStatus.unavilable
      break;
    case error.TIMEOUT:
      status = ConnectionStatus.timeout
      break;
  }
  dispatch(updateWatchingPositionStatus(status))
}

export const startWatchingPosition = createAsyncThunk(
  'watching_position/startWatching',
  async (_, { dispatch, getState }) : Promise<{status: ConnectionStatus, watch_id: any}> => {
    let state = { ...selectSlice(getState() as RootState) }
    if(state.status !== ConnectionStatus.active) {
      state.status = ConnectionStatus.asking_permisision
      state.watch_id = servies.geolocation.watchPosition(callbackPositionWatcherUpdate(dispatch), callbackPositionWatcherError(dispatch))
    }
    return state
  }
)

export const stopWatchingPosition = createAsyncThunk(
  'watching_position/stopWatching',
  async (_, { dispatch, getState }) : Promise<WatchingPositionState> => {
    let state = { ...selectSlice(getState() as RootState) }
    if(state.status === ConnectionStatus.active) {
      state.status = ConnectionStatus.avilable
      servies.geolocation.clearWatch(state.watch_id)
      state.watch_id = undefined
      state.current_position = undefined
    }
    return state
  }
)

export const watchingPositionSlice = createSlice({
  name: 'watching_position',
  initialState,
  reducers: {
    updateCurrentWatchingPosition: (state, action: PayloadAction<Position>) => {
      state.status = ConnectionStatus.active
      state.current_position = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(updateWatchingPositionStatus.fulfilled, (state, action) => {
      state.status = action.payload.status
      state.watch_id = action.payload.watch_id
      state.current_position = action.payload.current_position
    })
    builder.addCase(startWatchingPosition.fulfilled, (state, action) => {
      state.status = action.payload.status
      state.watch_id = action.payload.watch_id
    })
    builder.addCase(stopWatchingPosition.fulfilled, (state, action) => {
      state.status = action.payload.status
      state.watch_id = action.payload.watch_id
      state.current_position = action.payload.current_position
    })
  }
})

updateCurrentWatchingPosition = watchingPositionSlice.actions.updateCurrentWatchingPosition

export default watchingPositionSlice.reducer