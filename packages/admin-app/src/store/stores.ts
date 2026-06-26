import { DataStore } from '@ggai/shared/store'
import type { ManagedOutfit } from '../shared/types'
import { seedManagedOutfits } from './seedData'

// Shared outfit store — writes to same localStorage key that user-app subscribes to
export const sharedOutfitStore = new DataStore<ManagedOutfit[]>('ggai-shared-outfits', seedManagedOutfits)
