import { useCallback, useEffect, useState } from 'react'
import {
  acceptInvite,
  cancelInvite,
  getReceivedInvites,
  getSentInvites,
  rejectInvite,
} from '../services/inviteService'
import type { InviteRecord } from '../types/inviteTypes'

export function useInvites(userId: string | null) {
  const [receivedInvites, setReceivedInvites] = useState<InviteRecord[]>([])
  const [sentInvites, setSentInvites] = useState<InviteRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!userId) {
      setReceivedInvites([])
      setSentInvites([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [received, sent] = await Promise.all([
        getReceivedInvites(userId),
        getSentInvites(userId),
      ])

      setReceivedInvites(received)
      setSentInvites(sent)
    } catch (err: any) {
      setError(err?.message || 'Failed to load invites')
    } finally {
      setLoading(false)
    }
  }, [userId])

  async function handleAccept(inviteId: string) {
    await acceptInvite(inviteId)
    await refresh()
  }

  async function handleReject(inviteId: string) {
    await rejectInvite(inviteId)
    await refresh()
  }

  async function handleCancel(inviteId: string) {
    if (!userId) return
    await cancelInvite(inviteId, userId)
    await refresh()
  }

  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    receivedInvites,
    sentInvites,
    loading,
    error,
    refresh,
    acceptInvite: handleAccept,
    rejectInvite: handleReject,
    cancelInvite: handleCancel,
  }
}