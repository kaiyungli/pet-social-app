export type InviteType = 'walk' | 'playdate'
export type InviteStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'expired'
  | 'cancelled'

export type MatchStatus = 'active' | 'ended'

export type InviteRecord = {
  id: string
  from_user_id: string
  to_user_id: string
  from_pet_id: string
  to_pet_id: string
  type: InviteType
  message: string | null
  status: InviteStatus
  proposed_time: string | null
  expires_at: string | null
  responded_at: string | null
  created_at: string
}

export type MatchRecord = {
  id: string
  invite_id: string
  user_a_id: string
  user_b_id: string
  pet_a_id: string
  pet_b_id: string
  status: MatchStatus
  matched_at: string
  ended_at: string | null
}

export type CreateInviteInput = {
  fromUserId: string
  toUserId: string
  fromPetId: string
  toPetId: string
  type: InviteType
  message?: string
  proposedTime?: string | null
  expiresAt?: string | null
}

export type RespondInviteAction = 'accept' | 'reject'