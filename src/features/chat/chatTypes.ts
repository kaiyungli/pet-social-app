export type ChatMessage = {
  id: string
  thread_id: string
  sender_user_id: string
  message_type: "text"
  message_text: string | null
  metadata: Record<string, unknown> | null
  is_read: boolean
  created_at: string
}

export type ChatThread = {
  id: string
  match_id: string
  created_at: string
  last_message_at: string | null
}

export type ThreadPeerPet = {
  id: string
  name: string
  photo_url: string | null
  breed: string | null
}

export type ThreadPeerUser = {
  id: string
  display_name: string
  avatar_url: string | null
  area_text: string | null
}

export type ThreadListItem = {
  threadId: string
  matchId: string
  peerUser: ThreadPeerUser
  peerPet: ThreadPeerPet | null
  lastMessageText: string | null
  lastMessageAt: string | null
  unreadCount: number
}

export type SendMessageInput = {
  threadId: string
  senderUserId: string
  messageText: string
}