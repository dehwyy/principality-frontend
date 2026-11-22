import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import axios from 'axios'
import { api } from '../api'
import type { DsPrincipalityPublication } from '../api/Api'
import { type Principality, toPrincipality } from '../modules/principalitiesApi'
import { loggedOut } from './archaeologistSlice'
import { deletePrincipality } from './principalitiesSlice'

interface PrincipalityDraftState {
  draft: Principality | null
  loading: boolean
  error: string | null
}

const initialState: PrincipalityDraftState = {
  draft: null,
  loading: false,
  error: null,
}

const responseStatus = (error: unknown): number | undefined =>
  axios.isAxiosError(error) ? error.response?.status : undefined

export const fetchPrincipalityDraft = createAsyncThunk<
  Principality | null,
  void,
  { rejectValue: string }
>('principalityDraft/fetchPrincipalityDraft', async (_, { rejectWithValue }) => {
  try {
    const response = await api.principalities.principalitiesDraftList()
    return toPrincipality(response.data)
  } catch (error) {
    if (responseStatus(error) === 404) return null
    return rejectWithValue('Черновик недоступен')
  }
})

interface PrincipalityDraftCreation {
  principality_name: string
  principality_image: File
  principality_video: File
}

export const createPrincipalityDraft = createAsyncThunk<
  Principality,
  PrincipalityDraftCreation,
  { rejectValue: string }
>('principalityDraft/createPrincipalityDraft', async (creation, { rejectWithValue }) => {
  try {
    const response = await api.principalities.principalitiesCreate(creation)
    return toPrincipality(response.data)
  } catch (error) {
    if (responseStatus(error) === 409) return rejectWithValue('Черновик уже существует')
    return rejectWithValue('Не удалось создать черновик')
  }
})

export const publishPrincipalityDraft = createAsyncThunk<
  Principality,
  DsPrincipalityPublication,
  { rejectValue: string }
>('principalityDraft/publishPrincipalityDraft', async (publication, { rejectWithValue }) => {
  try {
    const response = await api.principalities.principalitiesDraftPublishUpdate(publication)
    return toPrincipality(response.data)
  } catch (error) {
    if (responseStatus(error) === 400) return rejectWithValue('Проверьте описание, дату и коэффициент')
    return rejectWithValue('Не удалось опубликовать княжество')
  }
})

const principalityDraftSlice = createSlice({
  name: 'principalityDraft',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrincipalityDraft.fulfilled, (state, action) => {
        state.loading = false
        state.draft = action.payload
      })
      .addCase(createPrincipalityDraft.fulfilled, (state, action) => {
        state.loading = false
        state.draft = action.payload
      })
      .addCase(publishPrincipalityDraft.fulfilled, (state) => {
        state.loading = false
        state.draft = null
      })
      .addCase(deletePrincipality.fulfilled, (state, action) => {
        if (state.draft?.principality_id === action.payload) state.draft = null
      })
      .addCase(loggedOut, () => initialState)
      .addMatcher(
        isAnyOf(
          fetchPrincipalityDraft.pending,
          createPrincipalityDraft.pending,
          publishPrincipalityDraft.pending,
        ),
        (state) => {
          state.loading = true
          state.error = null
        },
      )
      .addMatcher(
        isAnyOf(
          fetchPrincipalityDraft.rejected,
          createPrincipalityDraft.rejected,
          publishPrincipalityDraft.rejected,
        ),
        (state, action) => {
          state.loading = false
          state.error = action.payload ?? 'Ошибка веб-сервиса'
        },
      )
  },
})

export default principalityDraftSlice.reducer
