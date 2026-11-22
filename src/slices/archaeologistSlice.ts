import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface ArchaeologistState {
  accessToken: string | null
  archaeologistLogin: string
  isAuthenticated: boolean
}

interface ArchaeologistSession {
  accessToken: string
  archaeologistLogin: string
}

const initialState: ArchaeologistState = {
  accessToken: null,
  archaeologistLogin: '',
  isAuthenticated: false,
}

const archaeologistSlice = createSlice({
  name: 'archaeologist',
  initialState,
  reducers: {
    loggedIn: (state, action: PayloadAction<ArchaeologistSession>) => {
      state.accessToken = action.payload.accessToken
      state.archaeologistLogin = action.payload.archaeologistLogin
      state.isAuthenticated = true
    },
    loggedOut: () => initialState,
  },
})

export const { loggedIn, loggedOut } = archaeologistSlice.actions
export default archaeologistSlice.reducer
