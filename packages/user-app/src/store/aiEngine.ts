import type { Outfit, UserPreferences } from '@ggai/shared/types'
import { PRICE_RANGE_MAP } from '@ggai/shared/types'

// Simulate AI recommendation engine
// In production, this would call an LLM API with the user's preferences and occasion

const AI_THINKING_PHRASES = [
  'Analyzing your style preferences...',
  'Matching color palette...',
  'Scanning latest trends...',
  'Curating outfit combinations...',
  'Calculating style scores...',
  'Generating personalized picks...',
]

export function getAiThinkingPhrases(): string[] {
  return AI_THINKING_PHRASES
}

export function calculateAiScore(outfit: Outfit, preferences: UserPreferences): number {
  let score = 70 // base score

  // Color match
  if (preferences.colors.length > 0) {
    const outfitColors = outfit.styleTags.flatMap((t) => t.split(''))
    const match = preferences.colors.some((c) =>
      outfitColors.some((oc) => c.includes(oc) || oc.includes(c))
    )
    score += match ? 15 : 0
  }

  // Price tier match
  if (preferences.priceTier !== 'all') {
    const prefRange = PRICE_RANGE_MAP[preferences.priceTier]
    if (prefRange && outfit.totalPrice >= prefRange.range[0] && outfit.totalPrice <= prefRange.range[1]) {
      score += 15
    } else {
      score -= 10
    }
  } else {
    score += 5
  }

  // Style tag match
  if (preferences.styleTags.length > 0) {
    const tagOverlap = outfit.styleTags.filter((t) =>
      preferences.styleTags.some((pt) => t.includes(pt) || pt.includes(t))
    ).length
    score += tagOverlap * 5
  }

  return Math.min(99, Math.max(50, score))
}

export function aiRecommend(
  outfits: Outfit[],
  occasion: string,
  preferences: UserPreferences,
  count: number = 3,
): { outfit: Outfit; score: number }[] {
  const candidates = outfits
    .filter((o) => o.occasion === occasion)
    .map((o) => ({ outfit: o, score: calculateAiScore(o, preferences) }))
    .sort((a, b) => b.score - a.score)

  return candidates.slice(0, count)
}

export function generateAiOutfitDescription(outfit: Outfit, preferences: UserPreferences): string {
  const score = calculateAiScore(outfit, preferences)
  const items = outfit.items.map((i) => i.name).join('、')
  const priceLabel = PRICE_RANGE_MAP[outfit.priceRange]?.label || ''

  if (score >= 90) {
    return `✨ AI 强烈推荐！这组${outfit.name}完美匹配你的风格偏好。包含${items}，总价¥${outfit.totalPrice}（${priceLabel}），是你今天的最佳选择。`
  } else if (score >= 80) {
    return `👍 AI 认为${outfit.name}很适合你。${items}的组合在颜色和风格上都与你的偏好高度一致。总价¥${outfit.totalPrice}。`
  } else if (score >= 70) {
    return `💡 AI 推荐尝试${outfit.name}。虽然与你设定的偏好略有差异，但这套${items}的搭配在当下非常流行。总价¥${outfit.totalPrice}。`
  }
  return `🤔 AI 觉得${outfit.name}可以一试。${items}，总价¥${outfit.totalPrice}。虽不完全匹配你的偏好，但值得尝试新风格。`
}
