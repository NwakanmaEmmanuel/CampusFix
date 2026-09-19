import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import MaterialIcon from '../components/MaterialIcon'
import { supabase } from '../lib/supabase'
import type { HelpRequest } from '../lib/types'

const statusMeta: Record<HelpRequest['status'], { label: string; color: string }> = {
  open: { label: 'Waiting for Match', color: 'bg-tertiary-container/20 text-tertiary' },
  accepted: { label: 'In Progress', color: 'bg-primary-container/20 text-primary' },
  submitted: { label: 'Awaiting Your Review', color: 'bg-secondary-container/40 text-on-secondary-container' },
  completed: { label: 'Completed', color: 'bg-surface-container text-on-surface-variant' },
}

export default function Dashboard() {
  const [requests, setRequests] = useState<HelpRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        setLoading(false)
        return
      }
      const { data } = await supabase
        .from('requests')
        .select('*')
        .eq('requester_id', userData.user.id)
        .order('created_at', { ascending: false })
      setRequests((data as HelpRequest[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const active = requests.filter((r) => r.status !== 'completed')
  const completed = requests.filter((r) => r.status === 'completed')

  return (
    <>
      <Header title="My Requests" eyebrow="My Requests" />

      <div className="px-gutter py-space-lg space-y-space-lg">
        <div className="bg-surface-container-low rounded-xl p-space-md flex items-center justify-between">
          <p className="font-label-lg text-label-lg flex items-center gap-1.5">
            <MaterialIcon name="hub" className="text-primary text-[18px]" />
            My Requests &amp; Help Hub
          </p>
          <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            Live Network Active
          </span>
        </div>

        {loading && <p className="font-body-sm text-body-sm text-on-surface-variant">Loading…</p>}

        {!loading && requests.length === 0 && (
          <div className="border border-dashed border-outline-variant rounded-xl p-space-lg text-center">
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-sm">
              No requests yet — post what you need help with.
            </p>
            <Link to="/new" className="font-label-lg text-label-lg text-primary">
              Post Request →
            </Link>
          </div>
        )}

        {active.length > 0 && (
          <div>
            <p className="font-label-lg text-label-lg mb-space-sm">Active</p>
            <div className="space-y-space-sm">
              {active.map((r) => {
                const meta = statusMeta[r.status]
                return (
                  <Link
                    key={r.id}
                    to={`/chat/${r.id}`}
                    className="block bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full ${meta.color}`}>
                        {meta.label}
                      </span>
                      <span className="font-headline-sm text-headline-sm text-primary">
                        ₦{r.budget_naira.toLocaleString()}
                      </span>
                    </div>
                    <p className="font-label-lg text-label-lg mb-0.5">{r.title}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {r.ai_category ?? 'Uncategorized'}
                      {r.ai_estimated_minutes ? ` · ~${r.ai_estimated_minutes}m` : ''}
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {completed.length > 0 && (
          <div>
            <p className="font-label-lg text-label-lg mb-space-sm flex items-center gap-1.5">
              <MaterialIcon name="check_circle" className="text-secondary text-[18px]" />
              Resolved &amp; Verified
              <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">
                {completed.length} Completed
              </span>
            </p>
            <div className="space-y-space-sm">
              {completed.map((r) => (
                <div
                  key={r.id}
                  className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-label-sm text-label-sm bg-secondary-container/40 text-on-secondary-container px-2 py-0.5 rounded-full">
                      {r.ai_quality_confidence ? `${Math.round(r.ai_quality_confidence)}% AI Check` : 'Completed'}
                    </span>
                    <span className="font-label-lg text-label-lg text-on-surface-variant line-through">
                      ₦{r.budget_naira.toLocaleString()}
                    </span>
                  </div>
                  <p className="font-label-lg text-label-lg">{r.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Link
          to="/new"
          className="w-full bg-primary text-on-primary rounded-xl py-space-md flex items-center justify-center gap-space-sm font-label-lg text-label-lg shadow-md active:scale-[0.98] transition-transform"
        >
          <MaterialIcon name="bolt" className="text-[18px]" />
          Stuck right now? Post a request
        </Link>
      </div>
    </>
  )
}
