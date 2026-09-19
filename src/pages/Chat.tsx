import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import MaterialIcon from '../components/MaterialIcon'
import { supabase } from '../lib/supabase'
import type { Message, HelpRequest } from '../lib/types'

export default function Chat() {
  const { requestId } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [request, setRequest] = useState<HelpRequest | null>(null)
  const [body, setBody] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [solutionDraft, setSolutionDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!requestId) return

    async function load() {
      const { data: userData } = await supabase.auth.getUser()
      setUserId(userData.user?.id ?? null)

      const { data: reqData } = await supabase
        .from('requests')
        .select('*')
        .eq('id', requestId)
        .single()
      setRequest(reqData as HelpRequest)

      const { data: msgData } = await supabase
        .from('messages')
        .select('*')
        .eq('request_id', requestId)
        .order('created_at', { ascending: true })
      setMessages((msgData as Message[]) ?? [])
    }
    load()

    const channel = supabase
      .channel(`messages:${requestId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `request_id=eq.${requestId}` },
        (payload) => setMessages((prev) => [...prev, payload.new as Message]),
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [requestId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if (!body.trim() || !userId || !requestId) return
    await supabase.from('messages').insert({ request_id: requestId, sender_id: userId, body })
    setBody('')
  }

  async function submitSolution() {
    if (!solutionDraft.trim() || !requestId) return
    await supabase
      .from('requests')
      .update({ solution_text: solutionDraft, status: 'submitted' })
      .eq('id', requestId)
    navigate(`/complete/${requestId}`)
  }

  const isHelper = userId && request?.helper_id === userId

  return (
    <div className="flex flex-col h-screen">
      <Header title="Task Details" showBack />

      {request && (
        <div className="px-gutter py-space-sm border-b border-outline-variant/30 bg-surface-container-low">
          <div className="flex items-center justify-between mb-1">
            <span className="font-label-sm text-label-sm bg-primary-fixed/40 text-primary px-2 py-0.5 rounded-full">
              {request.status === 'accepted' ? 'Live Session' : request.status}
            </span>
            <span className="font-headline-sm text-headline-sm text-primary">
              ₦{request.budget_naira.toLocaleString()}
            </span>
          </div>
          <p className="font-label-lg text-label-lg">{request.title}</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {request.ai_category ?? 'Uncategorized'}
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-gutter py-space-md space-y-space-sm">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[80%] px-space-md py-space-sm rounded-xl font-body-md text-body-md ${
              m.sender_id === userId
                ? 'bg-primary text-on-primary ml-auto rounded-br-sm'
                : 'bg-surface-container-lowest border border-outline-variant/30 rounded-bl-sm'
            }`}
          >
            {m.body}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="px-gutter py-space-sm border-t border-outline-variant/30 flex items-center gap-space-sm bg-surface-container-lowest">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message…"
          className="flex-1 bg-surface-container-low rounded-full px-space-md py-space-sm font-body-md text-body-md outline-none"
        />
        <button
          onClick={sendMessage}
          className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0"
        >
          <MaterialIcon name="send" className="text-[18px]" />
        </button>
      </div>

      {isHelper && request?.status === 'accepted' && (
        <div className="px-gutter py-space-md border-t border-outline-variant/30 bg-surface-container-low">
          <p className="font-label-sm text-label-sm text-on-surface-variant mb-space-sm">
            Submit your solution when you&rsquo;re done:
          </p>
          <textarea
            value={solutionDraft}
            onChange={(e) => setSolutionDraft(e.target.value)}
            rows={3}
            placeholder="Write the explanation or solution here…"
            className="w-full bg-surface-container-lowest rounded-lg p-space-sm font-body-md text-body-md outline-none mb-space-sm"
          />
          <button
            onClick={submitSolution}
            className="w-full bg-secondary text-on-secondary rounded-xl py-space-sm font-label-lg text-label-lg flex items-center justify-center gap-1"
          >
            <MaterialIcon name="task_alt" className="text-[18px]" />
            Submit Solution
          </button>
        </div>
      )}
    </div>
  )
}
