import type { Outfit, UserPreferences } from '@ggai/shared/types'

const API_KEY = 'sk-a46cfbd04c084d44ae44afcf59d1db8d'
const API_URL = 'https://api.deepseek.com/v1/chat/completions'

interface DeepSeekResponse {
  choices: { message: { content: string } }[]
}

async function callDeepSeek(systemPrompt: string, userMessage: string): Promise<string> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.8,
      max_tokens: 800,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`DeepSeek API error: ${res.status} ${err}`)
  }

  const data: DeepSeekResponse = await res.json()
  return data.choices[0].message.content
}

export async function getAiOutfitRecommendation(
  occasion: string,
  preferences: UserPreferences,
  outfits: Outfit[],
): Promise<string> {
  const outfitList = outfits
    .map((o) => `- ${o.name}: ${o.items.map((i) => i.name).join('、')}, ¥${o.totalPrice}, 风格: ${o.styleTags.join('/')}`)
    .join('\n')

  const system = `你是逛逛AI的时尚推荐引擎。根据用户的场合和偏好，从候选穿搭中推荐最合适的，给出个性化推荐理由。回复要自然、专业，带点时尚感。用中文。控制在200字以内。`

  const user = `场合：${occasion}
我的偏好：颜色 ${preferences.colors.join('、') || '无限制'}，预算 ${preferences.priceTier}，风格 ${preferences.styleTags.join('、') || '无限制'}

候选穿搭：
${outfitList}

请推荐1-2套最合适的搭配，并说明推荐理由。`

  return callDeepSeek(system, user)
}

export async function getAiStyleAnalysis(preferences: UserPreferences): Promise<string> {
  const system = `你是逛逛AI的AI时尚顾问。根据用户的风格偏好，给出专业的风格分析和穿搭建议。回复要自然、有洞察力。用中文。控制在150字以内。`

  const user = `我的偏好：颜色 ${preferences.colors.join('、') || '未设置'}，预算 ${preferences.priceTier}，风格 ${preferences.styleTags.join('、') || '未设置'}

请分析我的风格DNA，并给出1-2条穿搭提升建议。`

  return callDeepSeek(system, user)
}

export async function getAiOutfitStory(outfit: Outfit): Promise<string> {
  const system = `你是逛逛AI的时尚编辑。为给定的穿搭方案写一段生动的描述，说明这套搭配为什么好、适合什么场景。要有画面感。用中文。控制在100字以内。`

  const user = `穿搭：${outfit.name}
单品：${outfit.items.map((i) => `${i.brand} ${i.name} (¥${i.price})`).join('、')}
风格：${outfit.styleTags.join('/')}
总价：¥${outfit.totalPrice}
场合：${outfit.occasion}

请为这套穿搭写一段吸引人的推荐文案。`

  return callDeepSeek(system, user)
}

// Keep mock engine for instant UI, real API for actual AI features
export { callDeepSeek }
