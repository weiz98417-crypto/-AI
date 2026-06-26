import { createContext, useContext, useReducer, useEffect, type ReactNode, type Dispatch } from 'react'
import type { Occasion, UserPreferences, BrowsingHistoryEntry, Outfit } from '@ggai/shared/types'
import { DataStore } from '@ggai/shared/store'
import { seedOccasions, seedOutfits } from './seedData'
import { preferenceStore, favoriteStore, historyStore } from './stores'

// Shared outfit store — the admin also writes to this key
export const sharedOutfitStore = new DataStore<any[]>('ggai-shared-outfits', seedOutfits)

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
  preferences: preferenceStore.getSeed(),
  favorites: [],
  browsingHistory: [],
  loading: true,
}

export type AppAction =
  | { type: 'INIT_DATA'; occasions: Occasion[]; outfits: Outfit[]; preferences: UserPreferences; favorites: string[]; history: BrowsingHistoryEntry[] }
  | { type: 'TOGGLE_FAVORITE'; outfitId: string }
  | { type: 'ADD_HISTORY'; entry: BrowsingHistoryEntry }
  | { type: 'UPDATE_PREFERENCES'; preferences: UserPreferences }
  | { type: 'SYNC_OUTFITS'; outfits: Outfit[] }

function mergeAdminOutfits(adminOutfits: any[] | null): Outfit[] {
  if (!adminOutfits || !Array.isArray(adminOutfits)) return seedOutfits
  const adminMap = new Map(adminOutfits.map((o: any) => [o.id, o]))
  const updated = seedOutfits
    .map(o => {
      const admin = adminMap.get(o.id)
      if (admin) {
        return { ...o, name: admin.name, totalPrice: admin.totalPrice, priceRange: admin.priceRange, occasion: admin.occasion, styleTags: admin.styleTags, coverImage: admin.coverImage, brandSummary: admin.brandSummary, active: admin.active }
      }
      return o
    })
    .filter((o: any) => o.active !== false)
  for (const admin of adminOutfits) {
    if (!updated.find((o: Outfit) => o.id === admin.id) && admin.active) {
      updated.push({
        id: admin.id, occasion: admin.occasion, name: admin.name,
        items: admin.items || [], totalPrice: admin.totalPrice,
        priceRange: admin.priceRange, styleTags: admin.styleTags || [],
        coverImage: admin.coverImage, brandSummary: admin.brandSummary || '',
      })
    }
  }
  return updated
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'INIT_DATA':
      return { ...state, ...action, loading: false }
    case 'TOGGLE_FAVORITE': {
      const exists = state.favorites.includes(action.outfitId)
      const favorites = exists
        ? state.favorites.filter((id) => id !== action.outfitId)
        : [...state.favorites, action.outfitId]
      favoriteStore.write(favorites)
      return { ...state, favorites }
    }
    case 'ADD_HISTORY': {
      const history = [
        { ...action.entry },
        ...state.browsingHistory.filter((e) => e.outfitId !== action.entry.outfitId),
      ].slice(0, 50)
      historyStore.write(history)
      return { ...state, browsingHistory: history }
    }
    case 'UPDATE_PREFERENCES': {
      preferenceStore.write(action.preferences)
      return { ...state, preferences: action.preferences }
    }
    case 'SYNC_OUTFITS':
      return { ...state, outfits: action.outfits }
    default:
      return state
  }
}

const AppContext = createContext<{ state: AppState; dispatch: Dispatch<AppAction> } | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    // Initialize from stores
    const adminOutfits = sharedOutfitStore.read()
    const outfits = mergeAdminOutfits(adminOutfits)
    const preferences = preferenceStore.read()
    const favorites = favoriteStore.read()
    const history = historyStore.read()

    dispatch({ type: 'INIT_DATA', occasions: seedOccasions, outfits, preferences, favorites, history })

    // Subscribe to admin outfit changes in real-time
    const unsub = sharedOutfitStore.subscribe((adminData) => {
      const merged = mergeAdminOutfits(adminData)
      dispatch({ type: 'SYNC_OUTFITS', outfits: merged })
    })

    return unsub
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
