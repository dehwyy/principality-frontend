import { createAsyncThunk, createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit'
import { api } from '../api'
import { PRINCIPALITIES_MOCK } from '../modules/mock'
import { type Principality, toPrincipality } from '../modules/principalitiesApi'
import { loggedOut } from './archaeologistSlice'
import type { RootState } from '../store'

interface PrincipalitiesState {
  foundedBefore: string
  principalities: Principality[]
  feedPrincipality: Principality | null
  loading: boolean
  fromMock: boolean
  error: string | null
}

const initialState: PrincipalitiesState = {
  foundedBefore: '',
  principalities: [],
  feedPrincipality: null,
  loading: false,
  fromMock: false,
  error: null,
}

const mockPrincipalities = (foundedBefore: string): Principality[] =>
  foundedBefore
    ? PRINCIPALITIES_MOCK.filter(
        (principality) => principality.founding_date.slice(0, 10) <= foundedBefore,
      )
    : PRINCIPALITIES_MOCK

const mockFeedPrincipality = (principalityId: number, next?: boolean): Principality | undefined => {
  const currentIndex = PRINCIPALITIES_MOCK.findIndex(
    (principality) => principality.principality_id === principalityId,
  )
  if (!next) return PRINCIPALITIES_MOCK[currentIndex]
  return PRINCIPALITIES_MOCK[currentIndex + 1] ?? PRINCIPALITIES_MOCK[0]
}

interface PrincipalitiesPayload {
  principalities: Principality[]
  fromMock: boolean
}

export const fetchPrincipalities = createAsyncThunk<
  PrincipalitiesPayload,
  void,
  { state: RootState; rejectValue: string }
>('principalities/fetchPrincipalities', async (_, { getState, rejectWithValue }) => {
  const { foundedBefore } = getState().principalities
  const { isAuthenticated } = getState().archaeologist
  try {
    const response = await api.principalities.principalitiesList(
      foundedBefore ? { foundedBefore } : undefined,
    )
    return { principalities: response.data.map(toPrincipality), fromMock: false }
  } catch {
    if (isAuthenticated) return rejectWithValue('Веб-сервис княжеств недоступен')
    return { principalities: mockPrincipalities(foundedBefore), fromMock: true }
  }
})

interface FeedRequest {
  principalityId: number
  next?: boolean
}

export const fetchFeedPrincipality = createAsyncThunk<
  Principality,
  FeedRequest,
  { state: RootState; rejectValue: string }
>('principalities/fetchFeedPrincipality', async ({ principalityId, next }, { getState, rejectWithValue }) => {
  try {
    const response = await api.principalities.principalitiesFeedDetail(
      principalityId,
      next ? { next: 'true' } : undefined,
    )
    return toPrincipality(response.data)
  } catch {
    if (getState().archaeologist.isAuthenticated) return rejectWithValue('Княжество не найдено')
    return mockFeedPrincipality(principalityId, next) ?? rejectWithValue('Княжество не найдено')
  }
})

interface LikeRequest {
  principalityId: number
  principality_liked: number
}

interface LikeResult {
  principality_id: number
  principality_liked: number
  principality_like_count: number
}

export const likePrincipality = createAsyncThunk<LikeResult, LikeRequest, { rejectValue: string }>(
  'principalities/likePrincipality',
  async ({ principalityId, principality_liked }, { rejectWithValue }) => {
    try {
      const response = await api.principalities.principalitiesLikeCreate(principalityId, {
        principality_liked,
      })
      return {
        principality_id: response.data.principality_id ?? principalityId,
        principality_liked: response.data.principality_liked ?? principality_liked,
        principality_like_count: response.data.principality_like_count ?? 0,
      }
    } catch {
      return rejectWithValue('Не удалось отметить княжество')
    }
  },
)

export const deletePrincipality = createAsyncThunk<number, number, { rejectValue: string }>(
  'principalities/deletePrincipality',
  async (principalityId, { rejectWithValue }) => {
    try {
      await api.principalities.principalitiesDelete(principalityId)
      return principalityId
    } catch {
      return rejectWithValue('Не удалось удалить княжество')
    }
  },
)

const principalitiesSlice = createSlice({
  name: 'principalities',
  initialState,
  reducers: {
    setFoundedBefore: (state, action: PayloadAction<string>) => {
      state.foundedBefore = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrincipalities.fulfilled, (state, action) => {
        state.loading = false
        state.principalities = action.payload.principalities
        state.fromMock = action.payload.fromMock
      })
      .addCase(fetchFeedPrincipality.fulfilled, (state, action) => {
        state.loading = false
        state.feedPrincipality = action.payload
      })
      .addCase(likePrincipality.fulfilled, (state, action) => {
        state.loading = false
        const { principality_id, principality_liked, principality_like_count } = action.payload
        if (state.feedPrincipality?.principality_id === principality_id) {
          state.feedPrincipality.principality_liked = principality_liked
          state.feedPrincipality.principality_like_count = principality_like_count
        }
        const listed = state.principalities.find(
          (principality) => principality.principality_id === principality_id,
        )
        if (listed) listed.principality_like_count = principality_like_count
      })
      .addCase(deletePrincipality.fulfilled, (state, action) => {
        state.loading = false
        state.principalities = state.principalities.filter(
          (principality) => principality.principality_id !== action.payload,
        )
        if (state.feedPrincipality?.principality_id === action.payload) {
          state.feedPrincipality = null
        }
      })
      .addCase(loggedOut, (state) => {
        state.foundedBefore = ''
      })
      .addMatcher(
        isAnyOf(
          fetchPrincipalities.pending,
          fetchFeedPrincipality.pending,
          likePrincipality.pending,
          deletePrincipality.pending,
        ),
        (state) => {
          state.loading = true
          state.error = null
        },
      )
      .addMatcher(
        isAnyOf(
          fetchPrincipalities.rejected,
          fetchFeedPrincipality.rejected,
          likePrincipality.rejected,
          deletePrincipality.rejected,
        ),
        (state, action) => {
          state.loading = false
          state.error = action.payload ?? 'Ошибка веб-сервиса'
        },
      )
  },
})

export const { setFoundedBefore } = principalitiesSlice.actions
export default principalitiesSlice.reducer
