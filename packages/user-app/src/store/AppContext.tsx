import { createContext, useContext, useReducer, useEffect, type ReactNode, type Dispatch } from 'react'
import type { Outfit, Occasion, UserPreferences, BrowsingHistoryEntry } from '@ggai/shared/types'
import { seedOccasions, seedOutfits } from './seedData'

// ---- State ----
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

// ---- Actions ----
export type AppAction =
  | { type: 'INIT_DATA'; occasions: Occasion[]; outfits: Outfit[]; preferences: UserPreferences; favorites: string[]; history: BrowsingHistoryEntry[] }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'TOGGLE_FAVORITE'; outfitId: string }
  | { type: 'ADD_HISTORY'; entry: BrowsingHistoryEntry }
  | { type: 'UPDATE_PREFERENCES'; preferences: UserPreferences }

// ---- Reducer ----
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'INIT_DATA':
      return {
        ...state,
        occasions: action.occasions,
        outfits: action.outfits,
        preferences: action.preferences,
        favorites: action.favorites,
        browsingHistory: action.history,
        loading: false,
      }
    case 'SET_LOADING':
      return { ...state, loading: action.loading }
    case 'TOGGLE_FAVORITE': {
      const exists = state.favorites.includes(action.outfitId)
      const favorites = exists
        ? state.favorites.filter((id) => id !== action.outfitId)
        : [...state.favorites, action.outfitId]
      localStorage.setItem('ggai-favorites', JSON.stringify(favorites))
      return { ...state, favorites }
    }
    case 'ADD_HISTORY': {
      const history = [
        { ...action.entry },
        ...state.browsingHistory.filter((e) => e.outfitId !== action.entry.outfitId),
      ].slice(0, 50)
      localStorage.setItem('ggai-history', JSON.stringify(history))
      return { ...state, browsingHistory: history }
    }
    case 'UPDATE_PREFERENCES': {
      localStorage.setItem('ggai-preferences', JSON.stringify(action.preferences))
      return { ...state, preferences: action.preferences }
    }
    default:
      return state
  }
}

// ---- Context ----
const AppContext = createContext<{ state: AppState; dispatch: Dispatch<AppAction> } | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    const occasions = seedOccasions
    const outfits = JSON.parse(localStorage.getItem('ggai-outfits') || 'null') || seedOutfits
    const preferences = JSON.parse(localStorage.getItem('ggai-preferences') || 'null') || initialState.preferences
    const favorites = JSON.parse(localStorage.getItem('ggai-favorites') || 'null') || []
    const history = JSON.parse(localStorage.getItem('ggai-history') || 'null') || []

    if (!localStorage.getItem('ggai-outfits')) {
      localStorage.setItem('ggai-outfits', JSON.stringify(seedOutfits))
    }

    dispatch({ type: 'INIT_DATA', occasions, outfits, preferences, favorites, history })
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
