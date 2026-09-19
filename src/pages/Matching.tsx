import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import MaterialIcon from '../components/MaterialIcon'
import { supabase } from '../lib/supabase'
import type { HelpRequest } from '../lib/types'

export default function Matching() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState<HelpRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('requests')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
      setRequests((data as HelpRequest[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleAccept(requestId: string) {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return
    await supabase
      .from('requests')
      .update({ helper_id: userData.user.id, status: 'accepted' })
      .eq('id', requestId)
    navigate(`/chat/${requestId}`)
  }

  return (
    <>
      <Header title="Helpers" eyebrow="Helpers" />

      <div className="px-gutter py-space-lg space-y-space-lg">
        <div className="bg-secondary-container/30 rounded-xl p-space-md flex items-center gap-space-sm">
          <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0" />
          <p className="font-label-sm text-label-sm text-on-secondary-container flex-1">
            {loading ? 'Loading open requests…' : `${requests.length} open request${requests.length === 1 ? '' : 's'} nearby right now`}
          </p>
          <span className="font-label-sm text-label-sm text-secondary">LIVE</span>
        </div>

        {!loading && requests.length === 0 && (
          <p className="font-body-md text-body-md text-on-surface-variant text-center py-space-lg">
            No open requests right now — check back soon.
          </p>
        )}

        <div className="space-y-space-md">
          {requests.map((r) => (
            <div
              key={r.id}
              className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30"
            >
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-label-sm text-label-sm text-primary bg-primary-fixed/40 px-2 py-0.5 rounded-full">
                  {r.ai_category ?? 'Uncategorized'}
                </span>
                <span className="font-headline-sm text-headline-sm text-secondary">
                  ₦{r.budget_naira.toLocaleString()}
                </span>
              </div>
              <p className="font-label-lg text-label-lg mb-1">{r.title}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                {r.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {r.ai_difficulty ?? '—'}
                  {r.ai_estimated_minutes ? ` · Est. ${r.ai_estimated_minutes}m` : ''}
                </span>
                <button
                  onClick={() => handleAccept(r.id)}
                  className="bg-primary text-on-primary px-space-md py-space-sm rounded-lg font-label-lg text-label-lg flex items-center gap-1 active:scale-[0.98] transition-transform"
                >
                  Accept Helper &amp; Start Chat
                  <MaterialIcon name="send" className="text-[16px]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-surface-container-low rounded-xl p-space-md space-y-space-sm">
          <p className="font-label-lg text-label-lg flex items-center gap-1.5">
            <MaterialIcon name="verified_user" className="text-primary text-[18px]" />
            CampusFix SafeHelp Guarantee
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            <b>Verified student IDs:</b> Helpers belong to authenticated university departments.
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            <b>AI quality checks:</b> Every submitted solution runs through an automated check before payout.
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            <b>Rate after confirmation:</b> Bounty held securely until you approve the explanation.
          </p>
        </div>
      </div>
    </>
  )
}
