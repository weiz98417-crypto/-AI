// Vercel Serverless Function — proxies AI requests to DeepSeek
// API key stored in Vercel Environment Variable: DEEPSEEK_API_KEY

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })

  try {
    const { system, user, messages, stream } = req.body
    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

    // Build messages array — support both legacy (system+user) and new (messages) formats
    const msgs = messages || [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ]

    const body = {
      model: 'deepseek-chat',
      messages: msgs,
      temperature: 0.8,
      max_tokens: 800,
      stream: !!stream,
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify(body),
    })

    if (stream) {
      // Pipe the SSE stream through
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        res.write(chunk)
      }
      return res.end()
    }

    const data = await response.json()
    return res.status(200).json({ text: data.choices?.[0]?.message?.content || '' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
