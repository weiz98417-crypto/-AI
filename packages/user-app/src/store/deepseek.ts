// 逛逛AI — calls our own backend API proxy (DeepSeek key stays on server)
import type { Outfit, UserPreferences } from '@ggai/shared/types'

async function askGuangGuangAI(systemPrompt: string, userMessage: string): Promise<string> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system: systemPrompt, user: userMessage }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`逛逛AI API error: ${res.status} ${err}`)
  }

  const data = await res.json()
  return data.text || ''
}

export async function getAiOutfitRecommendation(
  occasion: string,
  preferences: UserPreferences,
  outfits: Outfit[],
): Promise<string> {
  const outfitList = outfits
    .map((o) => `- ${o.name}: ${o.items.map((i) => i.name).join('、')}, ¥${o.totalPrice}, 风格: ${o.styleTags.join('/')}`)
    .join('\n')

  const system = '你是逛逛AI的时尚推荐引擎。根据用户的场合和偏好，从候选穿搭中推荐最合适的，给出个性化推荐理由。回复要自然、专业，带点时尚感。用中文。控制在200字以内。'

  const user = `场合：${occasion}\n我的偏好：颜色 ${preferences.colors.join('、') || '无限制'}，预算 ${preferences.priceTier}，风格 ${preferences.styleTags.join('、') || '无限制'}\n\n候选穿搭：\n${outfitList}\n\n请推荐1-2套最合适的搭配，并说明推荐理由。`

  return askGuangGuangAI(system, user)
}

export async function getAiStyleAnalysis(preferences: UserPreferences): Promise<string> {
  const system = '你是逛逛AI的时尚顾问。根据用户的风格偏好，给出专业的风格分析和穿搭建议。用中文。控制在150字以内。'
  const user = `我的偏好：颜色 ${preferences.colors.join('、') || '未设置'}，预算 ${preferences.priceTier}，风格 ${preferences.styleTags.join('、') || '未设置'}\n\n请分析我的风格DNA，并给出1-2条穿搭提升建议。`
  return askGuangGuangAI(system, user)
}

export async function getAiOutfitStory(outfit: Outfit): Promise<string> {
  const system = '你是逛逛AI的时尚编辑。为穿搭方案写生动的推荐文案，说明为什么好、适合什么场景。用中文。控制在100字以内。'
  const user = `穿搭：${outfit.name}\n单品：${outfit.items.map((i) => `${i.brand} ${i.name} (¥${i.price})`).join('、')}\n风格：${outfit.styleTags.join('/')}\n总价：¥${outfit.totalPrice}\n场合：${outfit.occasion}\n\n请为这套穿搭写一段吸引人的推荐文案。`
  return askGuangGuangAI(system, user)
}
