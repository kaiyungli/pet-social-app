import { supabase } from '../../../lib/supabase'
import type {
  CreateInviteInput,
  InviteRecord,
  MatchRecord,
  RespondInviteAction,
} from '../types/inviteTypes'

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message
  return fallback
}

async function ensureNoBlockRelationship(userAId: string, userBId: string) {
  const { data, error } = await supabase
    .from('blocks')
    .select('id')
    .or(
      `and(blocker_user_id.eq.${userAId},blocked_user_id.eq.${userBId}),and(blocker_user_id.eq.${userBId},blocked_user_id.eq.${userAId})`
    )
    .limit(1)

  if (error) {
    throw new Error(getErrorMessage(error, 'Failed to validate block status'))
  }

  if (data && data.length > 0) {
    throw new Error('You cannot interact with this user')
  }
}

async function ensureNoPendingDuplicateInvite(
  fromUserId: string,
  toUserId: string,
  fromPetId: string,
  toPetId: string
) {
  const { data, error } = await supabase
    .from('invites')
    .select('id')
    .eq('from_user_id', fromUserId)
    .eq('to_user_id', toUserId)
    .eq('from_pet_id', fromPetId)
    .eq('to_pet_id', toPetId)
    .eq('status', 'pending')
    .limit(1)

  if (error) {
    throw new Error(getErrorMessage(error, 'Failed to validate duplicate invite'))
  }

  if (data && data.length > 0) {
    throw new Error('You already sent a pending invite')
  }
}

export async function createInvite(input: CreateInviteInput): Promise<InviteRecord> {
  try {
    const cleanedMessage = input.message?.trim() || null

    if (input.fromUserId === input.toUserId) {
      throw new Error('You cannot invite yourself')
    }

    if (input.fromPetId === input.toPetId) {
      throw new Error('You cannot invite the same pet')
    }

    await ensureNoBlockRelationship(input.fromUserId, input.toUserId)
    await ensureNoPendingDuplicateInvite(
      input.fromUserId,
      input.toUserId,
      input.fromPetId,
      input.toPetId
    )

    const payload = {
      from_user_id: input.fromUserId,
      to_user_id: input.toUserId,
      from_pet_id: input.fromPetId,
      to_pet_id: input.toPetId,
      type: input.type,
      message: cleanedMessage,
      proposed_time: input.proposedTime ?? null,
      expires_at: input.expiresAt ?? null,
    }

    const { data, error } = await supabase
      .from('invites')
      .insert(payload)
      .select('*')
      .single()

    if (error || !data) {
      throw new Error(getErrorMessage(error, 'Failed to create invite'))
    }

    return data as InviteRecord
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Failed to create invite'))
  }
}

export async function getReceivedInvites(userId: string): Promise<InviteRecord[]> {
  try {
    const { data, error } = await supabase
      .from('invites')
      .select('*')
      .eq('to_user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(getErrorMessage(error, 'Failed to load received invites'))
    }

    return (data || []) as InviteRecord[]
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Failed to load received invites'))
  }
}

export async function getSentInvites(userId: string): Promise<InviteRecord[]> {
  try {
    const { data, error } = await supabase
      .from('invites')
      .select('*')
      .eq('from_user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(getErrorMessage(error, 'Failed to load sent invites'))
    }

    return (data || []) as InviteRecord[]
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Failed to load sent invites'))
  }
}

async function createMatchFromInvite(invite: InviteRecord): Promise<MatchRecord> {
  const { data: existing, error: existingError } = await supabase
    .from('matches')
    .select('*')
    .eq('invite_id', invite.id)
    .maybeSingle()

  if (existingError) {
    throw new Error(getErrorMessage(existingError, 'Failed to check existing match'))
  }

  if (existing) {
    return existing as MatchRecord
  }

  const payload = {
    invite_id: invite.id,
    user_a_id: invite.from_user_id,
    user_b_id: invite.to_user_id,
    pet_a_id: invite.from_pet_id,
    pet_b_id: invite.to_pet_id,
    status: 'active',
  }

  const { data, error } = await supabase
    .from('matches')
    .insert(payload)
    .select('*')
    .single()

  if (error || !data) {
    throw new Error(getErrorMessage(error, 'Failed to create match'))
  }

  return data as MatchRecord
}

export async function respondToInvite(
  inviteId: string,
  action: RespondInviteAction,
  currentUserId: string
): Promise<{ invite: InviteRecord; match?: MatchRecord }> {
  try {
    const { data: invite, error: fetchError } = await supabase
      .from('invites')
      .select('*')
      .eq('id', inviteId)
      .single()

    if (fetchError || !invite) {
      throw new Error(getErrorMessage(fetchError, 'Invite not found'))
    }

    const inviteRecord = invite as InviteRecord

    if (inviteRecord.to_user_id !== currentUserId) {
      throw new Error('You do not have permission to respond to this invite')
    }

    if (inviteRecord.status !== 'pending') {
      throw new Error('This invite is no longer pending')
    }

    const nextStatus = action === 'accept' ? 'accepted' : 'rejected'
    const respondedAt = new Date().toISOString()

    const { data: updatedInvite, error: updateError } = await supabase
      .from('invites')
      .update({
        status: nextStatus,
        responded_at: respondedAt,
      })
      .eq('id', inviteId)
      .select('*')
      .single()

    if (updateError || !updatedInvite) {
      throw new Error(getErrorMessage(updateError, 'Failed to respond to invite'))
    }

    if (action === 'reject') {
      return { invite: updatedInvite as InviteRecord }
    }

    const match = await createMatchFromInvite(updatedInvite as InviteRecord)
    return {
      invite: updatedInvite as InviteRecord,
      match,
    }
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Failed to respond to invite'))
  }
}

export async function cancelInvite(inviteId: string, currentUserId: string): Promise<InviteRecord> {
  try {
    const { data: invite, error: fetchError } = await supabase
      .from('invites')
      .select('*')
      .eq('id', inviteId)
      .single()

    if (fetchError || !invite) {
      throw new Error(getErrorMessage(fetchError, 'Invite not found'))
    }

    const inviteRecord = invite as InviteRecord

    if (inviteRecord.from_user_id !== currentUserId) {
      throw new Error('You do not have permission to cancel this invite')
    }

    if (inviteRecord.status !== 'pending') {
      throw new Error('Only pending invites can be cancelled')
    }

    const { data: updatedInvite, error: updateError } = await supabase
      .from('invites')
      .update({
        status: 'cancelled',
        responded_at: new Date().toISOString(),
      })
      .eq('id', inviteId)
      .select('*')
      .single()

    if (updateError || !updatedInvite) {
      throw new Error(getErrorMessage(updateError, 'Failed to cancel invite'))
    }

    return updatedInvite as InviteRecord
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Failed to cancel invite'))
  }
}