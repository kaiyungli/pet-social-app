export type InviteType = 'walk' | 'playdate'

export type InviteStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'expired'
  | 'cancelled'

export type SendInvitePayload = {
  from_user_id: string
  to_user_id: string
  from_pet_id: string
  to_pet_id: string
  type: InviteType
  message?: string | null
  proposed_time?: string | null
}

export type InviteRecord = {
  id: string
  from_user_id: string
  to_user_id: string
  from_pet_id: string
  to_pet_id: string
  type: InviteType
  status: InviteStatus
  message: string | null
  proposed_time: string | null
  responded_at?: string | null
  expires_at?: string | null
  created_at: string
}