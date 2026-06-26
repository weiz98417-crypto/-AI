import { DataStore } from '@ggai/shared/store'
import type { UserPreferences, BrowsingHistoryEntry } from '@ggai/shared/types'

const defaultPrefs: UserPreferences = { colors: [], priceTier: 'all', styleTags: [] }

export const preferenceStore = new DataStore<UserPreferences>('ggai-prefs-v2', defaultPrefs)
export const favoriteStore = new DataStore<string[]>('ggai-favs-v2', [])
export const historyStore = new DataStore<BrowsingHistoryEntry[]>('ggai-hist-v2', [])
