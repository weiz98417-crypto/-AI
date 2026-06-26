import { createContext, useContext, useReducer, useEffect, type ReactNode, type Dispatch } from 'react'
import type { DashboardMetrics, ManagedOutfit } from '../shared/types'
import {
  seedMetrics, seedAnalytics, seedManagedOutfits,
  seedActivities, seedStyleBars, seedColorPrefs, seedCohorts,
  seedInsightCards, seedTrending, seedChartDaily, seedChartWeekly, seedChartDays,
  type Activity, type StyleBar, type ColorPref, type Cohort, type InsightCard, type TrendingItem,
} from './seedData'
import { sharedOutfitStore } from './stores'

// ---- State ----
export interface AdminState {
  isLoggedIn: boolean
  loginError: string
  metrics: DashboardMetrics
  analytics: {
    styleDistribution: { name: string; value: number }[]
    colorPreferences: { name: string; count: number }[]
  }
  activities: Activity[]
  styleBars: StyleBar[]
  colorPrefs: ColorPref[]
  cohorts: Cohort[]
  insightCards: InsightCard[]
  trending: TrendingItem[]
  chartPeriod: 'daily' | 'weekly'
  chartData: number[]
  chartDays: string[]
  managedOutfits: ManagedOutfit[]
  loading: boolean
}

const initialState: AdminState = {
  isLoggedIn: false,
  loginError: '',
  metrics: { todayRevenue: 0, activeUsers: 0, orderCount: 0, favoriteCount: 0, topOccasions: [] },
  analytics: { styleDistribution: [], colorPreferences: [] },
  activities: [],
  styleBars: [],
  colorPrefs: [],
  cohorts: [],
  insightCards: [],
  trending: [],
  chartPeriod: 'weekly',
  chartData: [],
  chartDays: [],
  managedOutfits: [],
  loading: true,
}

// ---- Actions ----
export type AdminAction =
  | { type: 'LOGIN'; username: string; password: string }
  | { type: 'LOGOUT' }
  | { type: 'INIT_DATA'; metrics: DashboardMetrics; analytics: AdminState['analytics']; outfits: ManagedOutfit[]; activities: Activity[]; styleBars: StyleBar[]; colorPrefs: ColorPref[]; cohorts: Cohort[]; insightCards: InsightCard[]; trending: TrendingItem[]; chartData: number[]; chartDays: string[] }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'TOGGLE_OUTFIT'; outfitId: string }
  | { type: 'ADD_OUTFIT'; outfit: ManagedOutfit }
  | { type: 'UPDATE_OUTFIT'; outfitId: string; name: string; totalPrice: number }
  | { type: 'DELETE_OUTFIT'; outfitId: string }
  | { type: 'SET_CHART_PERIOD'; period: 'daily' | 'weekly' }

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
        activities: action.activities,
        styleBars: action.styleBars,
        colorPrefs: action.colorPrefs,
        cohorts: action.cohorts,
        insightCards: action.insightCards,
        trending: action.trending,
        chartData: action.chartData,
        chartDays: action.chartDays,
        loading: false,
      }
    case 'SET_LOADING':
      return { ...state, loading: action.loading }
    case 'SET_CHART_PERIOD':
      return {
        ...state,
        chartPeriod: action.period,
        chartData: action.period === 'daily' ? seedChartDaily : seedChartWeekly,
      }
    case 'TOGGLE_OUTFIT': {
      const outfits = state.managedOutfits.map((o) =>
        o.id === action.outfitId ? { ...o, active: !o.active } : o,
      )
      sharedOutfitStore.write(outfits)
      return { ...state, managedOutfits: outfits }
    }
    case 'ADD_OUTFIT': {
      const outfits = [action.outfit, ...state.managedOutfits]
      sharedOutfitStore.write(outfits)
      return { ...state, managedOutfits: outfits }
    }
    case 'UPDATE_OUTFIT': {
      const outfits = state.managedOutfits.map((o) =>
        o.id === action.outfitId ? { ...o, name: action.name, totalPrice: action.totalPrice } : o,
      )
      sharedOutfitStore.write(outfits)
      return { ...state, managedOutfits: outfits }
    }
    case 'DELETE_OUTFIT': {
      const outfits = state.managedOutfits.filter((o) => o.id !== action.outfitId)
      sharedOutfitStore.write(outfits)
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
      const outfits = sharedOutfitStore.read()

      if (!sharedOutfitStore.exists()) {
        sharedOutfitStore.write(seedManagedOutfits)
      }

      dispatch({
        type: 'INIT_DATA',
        metrics,
        analytics,
        outfits,
        activities: seedActivities,
        styleBars: seedStyleBars,
        colorPrefs: seedColorPrefs,
        cohorts: seedCohorts,
        insightCards: seedInsightCards,
        trending: seedTrending,
        chartData: seedChartWeekly,
        chartDays: seedChartDays,
      })
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
