import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import MaterialIcon from '../components/MaterialIcon'
import { supabase } from '../lib/supabase'
import { categorizeRequest, type CategorizeResult } from '../lib/ai'
import type { Urgency } from '../lib/types'

const urgencyOptions: { value: Urgency; label: string; sub: string }[] = [
  { value: 'asap', label: 'ASAP', sub: '<30 mins' },
  { value: 'today', label: 'Today', sub: 'End of day' },
  { value: 'this_week', label: 'Flexible', sub: '24–48h' },
]

export default function CreateRequest() {
  const navigate = useNavigate()
  const [description, setDescription] = useState('')
  const [urgency, setUrgency] = useState<Urgency>('asap')
  const [budget, setBudget] = useState(1500)
  const [aiResult, setAiResult] = useState<CategorizeResult | null>(null)
  const [checking, setChecking] = useState(false)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCheckAI() {
    if (!description.trim()) return
    setChecking(true)
    setError(null)
    try {
      const result = await categorizeRequest(description)
      setAiResult(result)
    } catch {
      setError('AI categorization failed — you can still post without it.')
    } finally {
      setChecking(false)
    }
  }

  async function handlePost() {
    setPosting(true)
    setError(null)
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        setError('You need to be signed in to post a request.')
        setPosting(false)
        return
      }
      const { data, error: insertError } = await supabase
        .from('requests')
        .insert({
          requester_id: userData.user.id,
          title: description.slice(0, 60),
          description,
          urgency,
          budget_naira: budget,
          ai_category: aiResult?.category ?? null,
          ai_difficulty: aiResult?.difficulty ?? null,
          ai_estimated_minutes: aiResult?.estimated_minutes ?? null,
          status: 'open',
        })
        .select()
        .single()

      if (insertError) throw insertError
      navigate(`/chat/${data.id}`)
    } catch {
      setError('Could not post the request. Check your Supabase setup.')
    } finally {
      setPosting(false)
    }
  }

  return (
    <>
      <Header title="Post a Help Request" eyebrow="Post +" />

      <div className="px-gutter py-space-lg space-y-space-lg">
        <div className="flex items-center justify-between">
          <p className="font-label-lg text-label-lg text-secondary flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            FAST TRACK PEER MATCHING
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30">
          <div className="flex items-center justify-between mb-space-sm">
            <p className="font-label-lg text-label-lg">What do you need help with?</p>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {description.length}/250
            </span>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 250))}
            onBlur={handleCheckAI}
            rows={4}
            placeholder="I don't understand how to solve this eigenvalue question…"
            className="w-full bg-surface-container-low rounded-lg p-space-sm font-body-md text-body-md outline-none resize-none"
          />
          <p className="font-body-sm text-body-sm text-primary flex items-center gap-1 mt-space-sm">
            <MaterialIcon name="auto_awesome" className="text-[14px]" />
            Tip: Mention course code or topic for instant smart matching
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30">
          <div className="flex items-center justify-between mb-space-sm">
            <p className="font-label-lg text-label-lg">Urgency Level</p>
          </div>
          <div className="grid grid-cols-3 gap-space-xs">
            {urgencyOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setUrgency(opt.value)}
                className={`rounded-lg p-space-sm text-center ${
                  urgency === opt.value
                    ? 'bg-tertiary-container/20 text-tertiary border border-tertiary'
                    : 'bg-surface-container-low text-on-surface-variant'
                }`}
              >
                <span className="font-label-lg text-label-lg block">{opt.label}</span>
                <span className="font-label-sm text-label-sm opacity-70">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30">
          <div className="flex items-center justify-between mb-space-sm">
            <p className="font-label-lg text-label-lg">Offer Budget</p>
            <span className="font-label-sm text-label-sm text-primary">Escrow Protected</span>
          </div>
          <div className="flex items-center bg-surface-container-low rounded-lg px-space-sm py-space-sm">
            <span className="font-headline-md text-headline-md text-primary mr-1">₦</span>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="flex-1 bg-transparent outline-none font-headline-md text-headline-md"
            />
            <span className="font-label-sm text-label-sm text-on-surface-variant">NGN</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-sm">
            Suggested for quick 20m fix: ₦1,000 – ₦2,000
          </p>
        </div>

        {checking && (
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
            Classifying…
          </p>
        )}

        {aiResult && (
          <div className="bg-primary-fixed/30 rounded-xl p-space-md space-y-space-sm">
            <div className="flex items-center justify-between">
              <p className="font-label-lg text-label-lg flex items-center gap-1">
                <MaterialIcon name="auto_awesome" className="text-[16px] text-primary" />
                CampusFix AI Engine Auto-Classification
              </p>
              <span className="font-label-sm text-label-sm text-secondary">⚡ Match</span>
            </div>
            <div className="grid grid-cols-2 gap-space-sm">
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">DETECTED SUBJECT</p>
                <p className="font-label-lg text-label-lg">{aiResult.category}</p>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">DIFFICULTY</p>
                <p className="font-label-lg text-label-lg">{aiResult.difficulty}</p>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">ESTIMATED TIME</p>
                <p className="font-label-lg text-label-lg">{aiResult.estimated_minutes} mins</p>
              </div>
            </div>
          </div>
        )}

        {error && <p className="font-body-sm text-body-sm text-error">{error}</p>}

        <button
          onClick={handlePost}
          disabled={!description.trim() || posting}
          className="w-full bg-primary text-on-primary rounded-xl py-space-md flex items-center justify-center gap-space-sm font-label-lg text-label-lg shadow-md active:scale-[0.98] transition-transform disabled:opacity-40"
        >
          <MaterialIcon name="rocket_launch" className="text-[18px]" />
          {posting ? 'Posting…' : 'Post Request & Find Verified Helper'}
        </button>

        <p className="text-center font-body-sm text-body-sm text-secondary flex items-center justify-center gap-1">
          <MaterialIcon name="schedule" className="text-[14px]" />
          Estimated match time: &lt; 3 mins
        </p>
      </div>
    </>
  )
}
