/**
 * AI Conversation Module — multi-turn dialogue engine.
 *
 * Manages conversation sessions, orchestrates the 3 DeepSeek functions
 * (recommendation, style analysis, outfit story), and exposes a streaming
 * interface for the UI layer.
 */
import type { Outfit, UserPreferences } from '@ggai/shared/types'
import { getAiOutfitRecommendation, getAiStyleAnalysis, getAiOutfitStory } from './deepseek'
import { calculateAiScore } from './aiEngine'

export interface ChatMessage {
  id: string
  role: 'user' | 'ai' | 'system'
  text: string
  timestamp: number
}

export interface RecommendationResult {
  outfits: Outfit[]
  reasoning: string
  styleAnalysis: string
  stories: Record<string, string> // outfitId → story
}

export interface Session {
  id: string
  messages: ChatMessage[]
  preferences: UserPreferences
  result: RecommendationResult | null
  createdAt: number
}

let currentSession: Session | null = null

function mid(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function startSession(preferences: UserPreferences): Session {
  currentSession = {
    id: `sess-${Date.now()}`,
    messages: [{
      id: mid(),
      role: 'ai',
      text: '嗨！我是逛逛AI你的专属穿搭顾问~ 今天想去什么场合？有什么特别的偏好吗？',
      timestamp: Date.now(),
    }],
    preferences,
    result: null,
    createdAt: Date.now(),
  }
  return currentSession
}

export function getSession(): Session | null {
  return currentSession
}

export function addUserMessage(text: string): ChatMessage {
  if (!currentSession) throw new Error('No active session')
  const msg: ChatMessage = { id: mid(), role: 'user', text, timestamp: Date.now() }
  currentSession.messages.push(msg)
  return msg
}

export function addAiMessage(text: string): ChatMessage {
  if (!currentSession) throw new Error('No active session')
  const msg: ChatMessage = { id: mid(), role: 'ai', text, timestamp: Date.now() }
  currentSession.messages.push(msg)
  return msg
}

/**
 * Phase 1: AI understands the user's needs — sends the conversation
 * context to DeepSeek and gets a style analysis + clarifying response.
 */
export async function* analyzePhase(
  outfits: Outfit[],
  preferences: UserPreferences,
): AsyncGenerator<string, void, unknown> {
  const lastUserMsg = currentSession!.messages.filter(m => m.role === 'user').pop()
  const occasion = lastUserMsg?.text || '日常通勤'

  // First: get AI recommendation reasoning
  const recPromise = getAiOutfitRecommendation(occasion, preferences, outfits)

  // In parallel: get style analysis based on preferences
  const stylePromise = getAiStyleAnalysis(preferences)

  // Stream thinking indicators while waiting
  yield '正在分析你的风格偏好...'
  await sleep(300)
  yield '正在匹配最适合的穿搭方案...'
  await sleep(300)

  const [recText, styleText] = await Promise.all([recPromise, stylePromise])

  const scored = outfits
    .filter(o => o.occasion === occasion)
    .map(o => ({ outfit: o, score: calculateAiScore(o, preferences) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(x => x.outfit)

  currentSession!.result = {
    outfits: scored,
    reasoning: recText,
    styleAnalysis: styleText,
    stories: {},
  }

  // Build the full AI response
  const response = `${styleText}\n\n${recText}`
  addAiMessage(response)
}

/**
 * Phase 2: User confirmed — generate outfit stories for the top picks.
 */
export async function generateStories(): Promise<void> {
  if (!currentSession?.result) return

  const topOutfits = currentSession.result.outfits.slice(0, 2)
  const stories: Record<string, string> = {}

  for (const o of topOutfits) {
    try {
      stories[o.id] = await getAiOutfitStory(o)
    } catch {
      stories[o.id] = `${o.name} — ${o.brandSummary}，总价¥${o.totalPrice}，${o.styleTags.join('、')}风格。`
    }
  }

  currentSession.result.stories = stories
}

/**
 * Single-pass generate: analyze + stories in one go.
 * Returns chunks for the UI to render progressively.
 */
export async function* generateFull(
  occasion: string,
  preferences: UserPreferences,
  outfits: Outfit[],
): AsyncGenerator<{ type: 'thinking' | 'text' | 'result'; text?: string; result?: RecommendationResult }, void, unknown> {
  yield { type: 'thinking', text: '正在分析你的风格偏好...' }
  await sleep(200)
  yield { type: 'thinking', text: '正在匹配最适合的穿搭方案...' }
  await sleep(200)

  // Fetch both in parallel
  const [recText, styleText] = await Promise.all([
    getAiOutfitRecommendation(occasion, preferences, outfits).catch(() => ''),
    getAiStyleAnalysis(preferences).catch(() => ''),
  ])

  yield { type: 'text', text: styleText + '\n\n' + recText }

  const topOutfits = outfits
    .filter(o => o.occasion === occasion)
    .map(o => ({ outfit: o, score: calculateAiScore(o, preferences) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(x => x.outfit)
  yield { type: 'thinking', text: '正在为精选穿搭撰写推荐文案...' }

  const stories: Record<string, string> = {}
  for (const o of topOutfits.slice(0, 2)) {
    try {
      stories[o.id] = await getAiOutfitStory(o)
    } catch {
      stories[o.id] = `${o.name} — 总价¥${o.totalPrice}，${o.styleTags.join('、')}风格。`
    }
  }

  const result: RecommendationResult = {
    outfits: topOutfits,
    reasoning: recText,
    styleAnalysis: styleText,
    stories,
  }

  if (currentSession) {
    currentSession.result = result
    currentSession.messages.push({ id: mid(), role: 'ai', text: styleText + '\n\n' + recText, timestamp: Date.now() })
  }

  yield { type: 'result', result }
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}
