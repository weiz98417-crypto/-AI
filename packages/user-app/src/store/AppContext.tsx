import { createContext, useContext, useReducer, useEffect, type ReactNode, type Dispatch } from 'react'
import type { Occasion, UserPreferences, BrowsingHistoryEntry } from '@ggai/shared/types'
import { seedOccasions, seedOutfits } from './seedData'
import type { Outfit } from '@ggai/shared/types'

export interface AppState {
  occasions: Occasion[]
  outfits: Outfit[]
  preferences: UserPreferences
  favorites: string[]
  browsingHistory: BrowsingHistoryEntry[]
  loading: boolean
}

const initialState: AppState = {
  occasions: [],
  outfits: [],
  preferences: { colors: [], priceTier: 'all', styleTags: [] },
  favorites: [],
  browsingHistory: [],
  loading: true,
}

export type AppAction =
  | { type: 'INIT_DATA'; occasions: Occasion[]; outfits: Outfit[]; preferences: UserPreferences; favorites: string[]; history: BrowsingHistoryEntry[] }
  | { type: 'TOGGLE_FAVORITE'; outfitId: string }
  | { type: 'ADD_HISTORY'; entry: BrowsingHistoryEntry }
  | { type: 'UPDATE_PREFERENCES'; preferences: UserPreferences }

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'INIT_DATA':
      return { ...state, ...action, loading: false }
    case 'TOGGLE_FAVORITE': {
      const exists = state.favorites.includes(action.outfitId)
      const favorites = exists
        ? state.favorites.filter((id) => id !== action.outfitId)
        : [...state.favorites, action.outfitId]
      localStorage.setItem('ggai-favs-v2', JSON.stringify(favorites))
      return { ...state, favorites }
    }
    case 'ADD_HISTORY': {
      const history = [
        { ...action.entry },
        ...state.browsingHistory.filter((e) => e.outfitId !== action.entry.outfitId),
      ].slice(0, 50)
      localStorage.setItem('ggai-hist-v2', JSON.stringify(history))
      return { ...state, browsingHistory: history }
    }
    case 'UPDATE_PREFERENCES': {
      localStorage.setItem('ggai-prefs-v2', JSON.stringify(action.preferences))
      return { ...state, preferences: action.preferences }
    }
    default:
      return state
  }
}

const AppContext = createContext<{ state: AppState; dispatch: Dispatch<AppAction> } | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    // NEVER cache outfits to localStorage — always use latest seedData with current image URLs
    const outfits = seedOutfits
    const preferences = JSON.parse(localStorage.getItem('ggai-prefs-v2') || 'null') || initialState.preferences
    const favorites = JSON.parse(localStorage.getItem('ggai-favs-v2') || 'null') || []
    const history = JSON.parse(localStorage.getItem('ggai-hist-v2') || 'null') || []

    dispatch({ type: 'INIT_DATA', occasions: seedOccasions, outfits, preferences, favorites, history })
  }, [])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
