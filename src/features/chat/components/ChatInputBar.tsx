import { useState } from "react"
import { View, TextInput, Pressable, Text, StyleSheet } from "react-native"
import type { ChatMessage } from "../chatTypes"
import { sendMessage } from "../services/chatService"
import { COLORS } from "../../../constants/colors"
import { SPACING } from "../../../constants/spacing"
import { RADIUS } from "../../../constants/radius"

type Props = {
  threadId: string
  senderUserId: string
  onMessageSent?: (message: ChatMessage) => void
}

export default function ChatInputBar({
  threadId,
  senderUserId,
  onMessageSent,
}: Props) {
  const [messageText, setMessageText] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSend = async () => {
    if (sending) return

    try {
      setSending(true)
      setError(null)

      const message = await sendMessage({
        threadId,
        senderUserId,
        messageText,
      })

      setMessageText("")
      onMessageSent?.(message)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSending(false)
    }
  }

  return (
    <View style={styles.wrapper}>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.row}>
        <TextInput
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          style={styles.input}
          editable={!sending}
          multiline
        />

        <Pressable
          onPress={handleSend}
          style={[styles.sendButton, sending && styles.sendButtonDisabled]}
          disabled={sending}
        >
          <Text style={styles.sendButtonText}>
            {sending ? "Sending..." : "Send"}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.background,
    color: COLORS.textPrimary,
  },
  sendButton: {
    minHeight: 44,
    paddingHorizontal: SPACING.md,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.chatOwnBubble,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  errorText: {
    marginBottom: SPACING.xs,
    color: "#C62828",
  },
})