import { useState } from 'react'
import { sendInvite } from '../services/inviteService'
import type { InviteRecord, SendInvitePayload } from '../types/inviteTypes'

export function useSendInvite() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function send(payload: SendInvitePayload): Promise<InviteRecord> {
    setLoading(true)
    setError(null)

    try {
      const result = await sendInvite(payload)
      return result
    } catch (err: any) {
      const message = err?.message || 'Failed to send invite'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  return {
    send,
    loading,
    error,
  }
}