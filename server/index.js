import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'

const app = express()
app.use(cors())
app.use(express.json())

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// --- POST /api/categorize -------------------------------------------------
// Input:  { description: string }
// Output: { category, difficulty, estimated_minutes }
app.post('/api/categorize', async (req, res) => {
  const { description } = req.body
  if (!description) return res.status(400).json({ error: 'description is required' })

  try {
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      system:
        'You categorize student help requests for a peer-help marketplace. ' +
        'Respond ONLY with JSON, no preamble, no markdown fences. ' +
        'Shape: {"category": string, "difficulty": "Beginner"|"Intermediate"|"Advanced", "estimated_minutes": number}. ' +
        'category should be a specific sub-topic (e.g. "Linear Algebra", "React Hooks"), not the broad subject.',
      messages: [{ role: 'user', content: description }],
    })
    const text = msg.content.find((b) => b.type === 'text')?.text ?? '{}'
    const parsed = JSON.parse(text.trim())
    res.json(parsed)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'AI categorization failed' })
  }
})

// --- POST /api/quality-check ------------------------------------------------
// Input:  { requestDescription: string, solutionText: string }
// Output: { addresses_problem, includes_explanation, has_logical_gaps, confidence, note }
app.post('/api/quality-check', async (req, res) => {
  const { requestDescription, solutionText } = req.body
  if (!requestDescription || !solutionText) {
    return res.status(400).json({ error: 'requestDescription and solutionText are required' })
  }

  try {
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 250,
      system:
        'You are a lightweight, advisory quality checker for peer-submitted help on a student marketplace. ' +
        'You are NOT verifying correctness with certainty — just a sanity check. ' +
        'Respond ONLY with JSON, no preamble, no markdown fences. Shape: ' +
        '{"addresses_problem": boolean, "includes_explanation": boolean, "has_logical_gaps": boolean, ' +
        '"confidence": number (0-100), "note": string (one short sentence)}.',
      messages: [
        {
          role: 'user',
          content: `Original request:\n${requestDescription}\n\nSubmitted solution:\n${solutionText}`,
        },
      ],
    })
    const text = msg.content.find((b) => b.type === 'text')?.text ?? '{}'
    const parsed = JSON.parse(text.trim())
    res.json(parsed)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'AI quality check failed' })
  }
})

const PORT = process.env.PORT || 8787
app.listen(PORT, () => console.log(`CampusFix AI server running on :${PORT}`))
