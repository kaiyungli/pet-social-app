import { supabase } from '../../../lib/supabase'
import type { InviteRecord, SendInvitePayload } from '../types/inviteTypes'

export async function sendInvite(
  payload: SendInvitePayload
): Promise<InviteRecord> {
  try {
    if (payload.from_user_id === payload.to_user_id) {
      throw new Error('Cannot invite yourself')
    }

    const normalizedPayload = {
      ...payload,
      message: payload.message?.trim() || null,
      proposed_time: payload.proposed_time || null,
    }

    const { data, error } = await supabase
      .from('invites')
      .insert(normalizedPayload)
      .select()
      .single()

    if (error) {
      console.error('sendInvite error:', error)
      throw new Error('Failed to send invite')
    }

    return data as InviteRecord
  } catch (error) {
    console.error('sendInvite unexpected error:', error)
    throw error
  }
}

export async function getReceivedInvites(
  userId: string
): Promise<InviteRecord[]> {
  try {
    const { data, error } = await supabase
      .from('invites')
      .select('*')
      .eq('to_user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('getReceivedInvites error:', error)
      throw new Error('Failed to load received invites')
    }

    return (data || []) as InviteRecord[]
  } catch (error) {
    console.error('getReceivedInvites unexpected error:', error)
    throw error
  }
}

export async function getSentInvites(
  userId: string
): Promise<InviteRecord[]> {
  try {
    const { data, error } = await supabase
      .from('invites')
      .select('*')
      .eq('from_user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('getSentInvites error:', error)
      throw new Error('Failed to load sent invites')
    }

    return (data || []) as InviteRecord[]
  } catch (error) {
    console.error('getSentInvites unexpected error:', error)
    throw error
  }
}

export async function cancelInvite(
  inviteId: string,
  userId: string
): Promise<InviteRecord> {
  try {
    const { data, error } = await supabase
      .from('invites')
      .update({
        status: 'cancelled',
        responded_at: new Date().toISOString(),
      })
      .eq('id', inviteId)
      .eq('from_user_id', userId)
      .eq('status', 'pending')
      .select()
      .single()

    if (error) {
      console.error('cancelInvite error:', error)
      throw new Error('Failed to cancel invite')
    }

    return data as InviteRecord
  } catch (error) {
    console.error('cancelInvite unexpected error:', error)
    throw error
  }
}

export async function acceptInvite(inviteId: string): Promise<InviteRecord> {
  try {
    const { data, error } = await supabase
      .from('invites')
      .update({
        status: 'accepted',
        responded_at: new Date().toISOString(),
      })
      .eq('id', inviteId)
      .eq('status', 'pending')
      .select()
      .single()

    if (error) {
      console.error('acceptInvite error:', error)
      throw new Error('Failed to accept invite')
    }

    return data as InviteRecord
  } catch (error) {
    console.error('acceptInvite unexpected error:', error)
    throw error
  }
}

export async function rejectInvite(inviteId: string): Promise<InviteRecord> {
  try {
    const { data, error } = await supabase
      .from('invites')
      .update({
        status: 'rejected',
        responded_at: new Date().toISOString(),
      })
      .eq('id', inviteId)
      .eq('status', 'pending')
      .select()
      .single()

    if (error) {
      console.error('rejectInvite error:', error)
      throw new Error('Failed to reject invite')
    }

    return data as InviteRecord
  } catch (error) {
    console.error('rejectInvite unexpected error:', error)
    throw error
  }
}