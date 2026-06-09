import { AppError, ERROR_CODES } from "../../../lib/errors"
import { supabase } from "../../../lib/supabase"
import type { ChatMessage, SendMessageInput, ThreadListItem } from "../chatTypes"

type ChatThreadRow = {
    thread_id: string
    match_id: string

    peer_user_id: string
    peer_display_name: string
    peer_avatar_url: string | null
    peer_area_text: string | null

    peer_pet_id: string | null
    peer_pet_name: string | null
    peer_pet_photo_url: string | null
    peer_pet_breed: string | null

    last_message_text: string | null
    last_message_at: string | null

    unread_count: number | string | null
}

export async function getChatThreadsForUser(
    userId: string
): Promise<ThreadListItem[]> {
    if (!userId) return []

    const { data, error } = await supabase.rpc("get_chat_threads_for_user")

    if (error) {
        throw new Error(error.message)
    }

    const rows = (data ?? []) as ChatThreadRow[]

    return rows.map((item) => ({
        threadId: item.thread_id,
        matchId: item.match_id,
        peerUser: {
            id: item.peer_user_id,
            display_name: item.peer_display_name,
            avatar_url: item.peer_avatar_url,
            area_text: item.peer_area_text,
        },
        peerPet: item.peer_pet_id
            ? {
                id: item.peer_pet_id,
                name: item.peer_pet_name ?? "",
                photo_url: item.peer_pet_photo_url,
                breed: item.peer_pet_breed,
            }
            : null,
        lastMessageText: item.last_message_text,
        lastMessageAt: item.last_message_at,
        unreadCount: Number(item.unread_count ?? 0),
    }))
}

export async function getChatMessages(
    threadId: string,
    userId: string
): Promise<ChatMessage[]> {
    if (!threadId || !userId) {
        return []
    }

    const { data, error } = await supabase.rpc(
        "get_chat_messages_for_thread",
        {
            p_thread_id: threadId,
        }
    )

    if (error) {
        throw new AppError(ERROR_CODES.UNKNOWN_ERROR)
    }

    return (data ?? []) as ChatMessage[]
}

export async function sendMessage(input: SendMessageInput): Promise<ChatMessage> {
    const messageText = input.messageText.trim()

    if (!messageText) {
        throw new AppError(ERROR_CODES.CHAT_SEND_EMPTY_MESSAGE)
    }

    const { data, error } = await supabase.rpc("send_chat_message", {
        p_thread_id: input.threadId,
        p_message_text: messageText,
    })

    if (error || !data || data.length === 0) {
        throw new AppError(ERROR_CODES.UNKNOWN_ERROR)
    }

    return data[0] as ChatMessage
}

export async function markThreadAsRead(
    threadId: string,
    userId: string
): Promise<void> {
    const { data: thread, error: threadError } = await supabase
        .from("chat_threads")
        .select("id, match_id")
        .eq("id", threadId)
        .single()

    if (threadError || !thread) {
        throw new AppError(ERROR_CODES.CHAT_THREAD_NOT_FOUND)
    }

    const { data: match, error: matchError } = await supabase
        .from("matches")
        .select("user_a_id, user_b_id")
        .eq("id", thread.match_id)
        .single()

    if (matchError || !match) {
        throw new AppError(ERROR_CODES.CHAT_MATCH_NOT_FOUND)
    }

    const isParticipant =
        match.user_a_id === userId || match.user_b_id === userId

    if (!isParticipant) {
        throw new AppError(ERROR_CODES.CHAT_ACCESS_DENIED)
    }

    const { error: updateError } = await supabase
        .from("chat_messages")
        .update({ is_read: true })
        .eq("thread_id", threadId)
        .neq("sender_user_id", userId)
        .eq("is_read", false)

    if (updateError) {
        throw new AppError(ERROR_CODES.UNKNOWN_ERROR)
    }
}