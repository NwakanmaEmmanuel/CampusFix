export type Urgency = 'asap' | 'today' | 'this_week'

export type RequestStatus =
  | 'open'
  | 'accepted'
  | 'submitted'
  | 'completed'

export interface Profile {
  id: string
  full_name: string
  skills: string[]
  rating_avg: number
  completed_count: number
}

export interface HelpRequest {
  id: string
  requester_id: string
  title: string
  description: string
  subject: string | null
  ai_category: string | null
  ai_difficulty: string | null
  ai_estimated_minutes: number | null
  urgency: Urgency
  budget_naira: number
  status: RequestStatus
  helper_id: string | null
  solution_text: string | null
  ai_quality_notes: string | null
  ai_quality_confidence: number | null
  created_at: string
}

export interface Message {
  id: string
  request_id: string
  sender_id: string
  body: string
  created_at: string
}

export interface Rating {
  id: string
  request_id: string
  rater_id: string
  ratee_id: string
  stars: number
  comment: string | null
}
