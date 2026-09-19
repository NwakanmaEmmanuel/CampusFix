import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import MaterialIcon from '../components/MaterialIcon'
import { supabase } from '../lib/supabase'
import { qualityCheck, type QualityCheckResult } from '../lib/ai'
import type { HelpRequest } from '../lib/types'

export default function Completion() {
  const { requestId } = useParams()
  const navigate = useNavigate()
  const [request, setRequest] = useState<HelpRequest | null>(null)
  const [check, setCheck] = useState<QualityCheckResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [stars, setStars] = useState(5)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    if (!requestId) return
    async function load() {
      const { data } = await supabase.from('requests').select('*').eq('id', requestId).single()
      const req = data as HelpRequest
      setRequest(req)

      if (req?.solution_text) {
        try {
          const result = await qualityCheck(req.description, req.solution_text)
          setCheck(result)
        } catch {
          // advisory only — fall through, requester can still confirm
        }
      }
      setLoading(false)
    }
    load()
  }, [requestId])

  async function confirmAndRate() {
    if (!requestId || !request) return
    setConfirming(true)
    const { data: userData } = await supabase.auth.getUser()

    await supabase.from('requests').update({ status: 'completed' }).eq('id', requestId)

    if (userData.user && request.helper_id) {
      await supabase.from('ratings').insert({
        request_id: requestId,
        rater_id: userData.user.id,
        ratee_id: request.helper_id,
        stars,
      })
    }
    navigate('/dashboard')
  }

  if (loading) {
    return (
      <>
        <Header title="Task Details" showBack />
        <p className="px-gutter py-space-lg font-body-md text-body-md text-on-surface-variant">Loading…</p>
      </>
    )
  }

  return (
    <>
      <Header title="Task Details" showBack />

      <div className="px-gutter py-space-lg space-y-space-lg">
        <div>
          <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">
            BINCOM HACKATHON 2026 · MVP DEMO
          </p>
          <h1 className="font-headline-lg text-headline-lg mb-1">Solution Review &amp; AI Verification</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Automated peer validation pipeline &amp; release escrow
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30 flex items-center justify-between">
          <div>
            <p className="font-label-lg text-label-lg">{request?.title}</p>
            <span className="font-label-sm text-label-sm bg-secondary-container/40 text-on-secondary-container px-2 py-0.5 rounded-full">
              ₦{request?.budget_naira.toLocaleString()} Escrow Held
            </span>
          </div>
          <MaterialIcon name="functions" className="text-primary text-[28px]" />
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30 space-y-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded-lg bg-secondary-container/40 flex items-center justify-center">
                <MaterialIcon name="auto_awesome" className="text-secondary text-[20px]" />
              </div>
              <div>
                <p className="font-label-lg text-label-lg">CampusFix AI Quality Check</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Advisory analysis of the submitted solution
                </p>
              </div>
            </div>
          </div>

          {check ? (
            <>
              <div className="space-y-space-sm">
                <div className="flex items-start gap-space-sm">
                  <MaterialIcon
                    name={check.addresses_problem ? 'check_circle' : 'cancel'}
                    className={`text-[18px] ${check.addresses_problem ? 'text-secondary' : 'text-error'}`}
                  />
                  <p className="font-body-md text-body-md">Addresses the requested problem</p>
                </div>
                <div className="flex items-start gap-space-sm">
                  <MaterialIcon
                    name={check.includes_explanation ? 'check_circle' : 'cancel'}
                    className={`text-[18px] ${check.includes_explanation ? 'text-secondary' : 'text-error'}`}
                  />
                  <p className="font-body-md text-body-md">Includes a step-by-step explanation</p>
                </div>
                <div className="flex items-start gap-space-sm">
                  <MaterialIcon
                    name={check.has_logical_gaps ? 'cancel' : 'check_circle'}
                    className={`text-[18px] ${check.has_logical_gaps ? 'text-error' : 'text-secondary'}`}
                  />
                  <p className="font-body-md text-body-md">No major logical gaps detected</p>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-lg p-space-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Confidence Score</span>
                  <span className="font-headline-md text-headline-md text-secondary">{check.confidence}%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full"
                    style={{ width: `${check.confidence}%` }}
                  />
                </div>
              </div>

              <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-low rounded-lg p-space-sm">
                Note: AI feedback is advisory and does not guarantee correctness.
              </p>
            </>
          ) : (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              AI check unavailable — you can still review and confirm manually.
            </p>
          )}
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30">
          <p className="font-label-lg text-label-lg mb-space-sm flex items-center gap-1.5">
            <MaterialIcon name="description" className="text-[18px]" />
            Submitted Solution
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant">{request?.solution_text}</p>
        </div>

        <div className="text-center space-y-space-sm">
          <MaterialIcon name="reviews" className="text-primary text-[40px]" />
          <h2 className="font-headline-md text-headline-md">Are you satisfied with the help?</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Rating unlocks escrow immediately and builds trusted peer reputation on campus.
          </p>
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setStars(n)}>
                <MaterialIcon
                  name="star"
                  className={`text-[32px] ${n <= stars ? 'text-tertiary-fixed-dim' : 'text-outline-variant'}`}
                />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={confirmAndRate}
          disabled={confirming}
          className="w-full bg-primary text-on-primary rounded-xl py-space-md flex items-center justify-center gap-space-sm font-label-lg text-label-lg shadow-md active:scale-[0.98] transition-transform disabled:opacity-40"
        >
          <MaterialIcon name="lock_open" className="text-[18px]" />
          {confirming ? 'Confirming…' : `Confirm Solution & Release ₦${request?.budget_naira.toLocaleString() ?? ''}`}
        </button>
      </div>
    </>
  )
}
