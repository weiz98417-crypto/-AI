// 逛逛AI shared types

export interface OutfitItem {
  name: string;
  brand: string;
  price: number;
  category: 'top' | 'bottom' | 'outerwear' | 'dress' | 'shoes' | 'accessory';
  image: string;
}

export interface Outfit {
  id: string;
  occasion: string;
  name: string;
  items: OutfitItem[];
  totalPrice: number;
  priceRange: 'budget' | 'mid' | 'premium' | 'luxury';
  styleTags: string[];
  coverImage: string;
  brandSummary: string;
}

export interface Occasion {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface UserPreferences {
  colors: string[];
  priceTier: 'budget' | 'mid' | 'premium' | 'all';
  styleTags: string[];
}

export interface DashboardMetrics {
  todayRevenue: number;
  activeUsers: number;
  orderCount: number;
  favoriteCount: number;
  topOccasions: { name: string; count: number }[];
}

export interface BrowsingHistoryEntry {
  outfitId: string;
  viewedAt: number;
}

export interface ManagedOutfit extends Outfit {
  active: boolean;
}

export const PRICE_RANGE_MAP: Record<Outfit['priceRange'], { label: string; range: [number, number] }> = {
  budget:  { label: '¥200以下', range: [0, 199] },
  mid:     { label: '¥200-500', range: [200, 500] },
  premium: { label: '¥500-1000', range: [500, 1000] },
  luxury:  { label: '¥1000+', range: [1000, Infinity] },
};
