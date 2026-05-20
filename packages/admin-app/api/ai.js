// Vercel Serverless Function — proxies AI requests to DeepSeek
// API key stored in Vercel Environment Variable: DEEPSEEK_API_KEY

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })

  try {
    const { system, user } = req.body
    const apiKey = process.env.DEEPSEEK_API_KEY

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' })
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.8,
        max_tokens: 600,
      }),
    })

    const data = await response.json()
    return res.status(200).json({ text: data.choices?.[0]?.message?.content || '' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
