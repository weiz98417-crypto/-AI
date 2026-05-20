import { createContext, useContext, useReducer, useEffect, type ReactNode, type Dispatch } from 'react'
import type { DashboardMetrics, ManagedOutfit } from '@ggai/shared/types'
import { seedMetrics, seedAnalytics, seedManagedOutfits } from './seedData'

// ---- State ----
export interface AdminState {
  isLoggedIn: boolean
  loginError: string
  metrics: DashboardMetrics
  analytics: {
    styleDistribution: { name: string; value: number }[]
    colorPreferences: { name: string; count: number }[]
  }
  managedOutfits: ManagedOutfit[]
  loading: boolean
}

const initialState: AdminState = {
  isLoggedIn: false,
  loginError: '',
  metrics: { todayRevenue: 0, activeUsers: 0, orderCount: 0, favoriteCount: 0, topOccasions: [] },
  analytics: { styleDistribution: [], colorPreferences: [] },
  managedOutfits: [],
  loading: true,
}

// ---- Actions ----
export type AdminAction =
  | { type: 'LOGIN'; username: string; password: string }
  | { type: 'LOGOUT' }
  | { type: 'INIT_DATA'; metrics: DashboardMetrics; analytics: AdminState['analytics']; outfits: ManagedOutfit[] }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'TOGGLE_OUTFIT'; outfitId: string }

// ---- Reducer ----
function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case 'LOGIN':
      if (action.username === 'admin' && action.password === '888888') {
        return { ...state, isLoggedIn: true, loginError: '' }
      }
      return { ...state, loginError: '密码错误' }
    case 'LOGOUT':
      return { ...state, isLoggedIn: false }
    case 'INIT_DATA':
      return {
        ...state,
        metrics: action.metrics,
        analytics: action.analytics,
        managedOutfits: action.outfits,
        loading: false,
      }
    case 'SET_LOADING':
      return { ...state, loading: action.loading }
    case 'TOGGLE_OUTFIT': {
      const outfits = state.managedOutfits.map((o) =>
        o.id === action.outfitId ? { ...o, active: !o.active } : o,
      )
      localStorage.setItem('ggai-admin-outfits', JSON.stringify(outfits))
      return { ...state, managedOutfits: outfits }
    }
    default:
      return state
  }
}

// ---- Context ----
const AdminContext = createContext<{ state: AdminState; dispatch: Dispatch<AdminAction> } | null>(null)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialState)

  useEffect(() => {
    if (state.isLoggedIn && state.loading) {
      const metrics = seedMetrics
      const analytics = seedAnalytics
      const outfits = JSON.parse(localStorage.getItem('ggai-admin-outfits') || 'null') || seedManagedOutfits

      if (!localStorage.getItem('ggai-admin-outfits')) {
        localStorage.setItem('ggai-admin-outfits', JSON.stringify(seedManagedOutfits))
      }

      dispatch({ type: 'INIT_DATA', metrics, analytics, outfits })
    }
  }, [state.isLoggedIn, state.loading])

  return (
    <AdminContext.Provider value={{ state, dispatch }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}
