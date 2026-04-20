import { useCallback, useEffect, useState } from 'react'
import {
  createInvite,
  getReceivedInvites,
  getSentInvites,
  respondToInvite,
  cancelInvite as cancelInviteService,
} from '../services/inviteService'
import type {
  CreateInviteInput,
  InviteRecord,
  RespondInviteAction,
} from '../types/inviteTypes'

type UseInvitesReturn = {
  receivedInvites: InviteRecord[]
  sentInvites: InviteRecord[]
  loading: boolean
  error: string | null
  refreshInvites: () => Promise<void>
  sendInvite: (input: CreateInviteInput) => Promise<void>
  acceptInvite: (inviteId: string) => Promise<void>
  rejectInvite: (inviteId: string) => Promise<void>
  cancelInvite: (inviteId: string) => Promise<void>
}

export function useInvites(userId: string | null): UseInvitesReturn {
  const [receivedInvites, setReceivedInvites] = useState<InviteRecord[]>([])
  const [sentInvites, setSentInvites] = useState<InviteRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshInvites = useCallback(async () => {
    if (!userId) {
      setReceivedInvites([])
      setSentInvites([])
      return
    }

    try {
      setLoading(true)
      setError(null)

      const [received, sent] = await Promise.all([
        getReceivedInvites(userId),
        getSentInvites(userId),
      ])

      setReceivedInvites(received)
      setSentInvites(sent)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load invites'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    void refreshInvites()
  }, [refreshInvites])

  async function sendInvite(input: CreateInviteInput) {
    try {
      setLoading(true)
      setError(null)
      await createInvite(input)
      await refreshInvites()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to send invite'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function handleRespond(
    inviteId: string,
    action: RespondInviteAction
  ) {
    if (!userId) {
      const message = 'User not loaded'
      setError(message)
      throw new Error(message)
    }

    try {
      setLoading(true)
      setError(null)
      await respondToInvite(inviteId, action, userId)
      await refreshInvites()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to respond to invite'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function acceptInvite(inviteId: string) {
    await handleRespond(inviteId, 'accept')
  }

  async function rejectInvite(inviteId: string) {
    await handleRespond(inviteId, 'reject')
  }

  async function cancelInvite(inviteId: string) {
    if (!userId) {
      const message = 'User not loaded'
      setError(message)
      throw new Error(message)
    }

    try {
      setLoading(true)
      setError(null)
      await cancelInviteService(inviteId, userId)
      await refreshInvites()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to cancel invite'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    receivedInvites,
    sentInvites,
    loading,
    error,
    refreshInvites,
    sendInvite,
    acceptInvite,
    rejectInvite,
    cancelInvite,
  }
}