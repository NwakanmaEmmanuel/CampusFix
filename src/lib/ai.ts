// Thin client for the two AI endpoints. Both are proxied to the Express
// server in /server (see vite.config.ts) so the Anthropic key never ships
// to the browser.

export interface CategorizeResult {
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimated_minutes: number
}

export interface QualityCheckResult {
  addresses_problem: boolean
  includes_explanation: boolean
  has_logical_gaps: boolean
  confidence: number // 0-100
  note: string
}

export async function categorizeRequest(description: string): Promise<CategorizeResult> {
  const res = await fetch('/api/categorize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description }),
  })
  if (!res.ok) throw new Error('Categorization failed')
  return res.json()
}

export async function qualityCheck(
  requestDescription: string,
  solutionText: string,
): Promise<QualityCheckResult> {
  const res = await fetch('/api/quality-check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestDescription, solutionText }),
  })
  if (!res.ok) throw new Error('Quality check failed')
  return res.json()
}
