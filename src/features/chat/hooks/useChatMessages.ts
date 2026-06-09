import { useCallback, useEffect, useState } from "react"
import { getChatMessages, markThreadAsRead } from "../services/chatService"
import type { ChatMessage } from "../chatTypes"

export function useChatMessages(threadId: string, userId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = useCallback(async () => {
    if (!threadId || !userId) return

    try {
      setLoading(true)
      setError(null)

      const data = await getChatMessages(threadId, userId)
      setMessages(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }, [threadId, userId])

  const appendMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message])
  }, [])

  const markAsRead = useCallback(async () => {
    if (!threadId || !userId) return

    try {
      await markThreadAsRead(threadId, userId)
    } catch (err) {
      console.error("Failed to mark thread as read", err)
    }
  }, [threadId, userId])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  return {
    messages,
    loading,
    error,
    refetch: fetchMessages,
    markAsRead,
    appendMessage
  }

}