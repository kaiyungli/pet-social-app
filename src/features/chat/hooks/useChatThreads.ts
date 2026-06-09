import { useCallback, useEffect, useState } from "react"
import { getChatThreadsForUser } from "../services/chatService"
import type { ThreadListItem } from "../chatTypes"


//loading all msg list
export function useChatThreads(userId: string | null) {
  const [threads, setThreads] = useState<ThreadListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchThreads = useCallback(async () => {
    if (!userId) return

    try {
      setLoading(true)
      setError(null)

      const data = await getChatThreadsForUser(userId)
      console.log("THREADS", data)

      setThreads(data)
    } catch (err) {
      console.error("THREAD ERROR", err)

      setError(
        err instanceof Error
          ? err.message
          : JSON.stringify(err)
      )
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchThreads()
  }, [fetchThreads])

  return {
    threads,
    loading,
    error,
    refetch: fetchThreads,
  }
}