import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import archaeologistReducer from './slices/archaeologistSlice'
import principalitiesReducer from './slices/principalitiesSlice'
import principalityDraftReducer from './slices/principalityDraftSlice'

export const store = configureStore({
  reducer: {
    archaeologist: archaeologistReducer,
    principalities: principalitiesReducer,
    principalityDraft: principalityDraftReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
