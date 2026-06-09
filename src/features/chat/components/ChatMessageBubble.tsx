import { View, Text, StyleSheet } from "react-native"
import type { ChatMessage } from "../chatTypes"
import { COLORS } from "../../../constants/colors"
import { SPACING } from "../../../constants/spacing"
import { RADIUS } from "../../../constants/radius"

type Props = {
  message: ChatMessage
  isOwnMessage: boolean
}

export default function ChatMessageBubble({ message, isOwnMessage }: Props) {
  return (
    <View
      style={[
        styles.bubble,
        isOwnMessage ? styles.ownBubble : styles.otherBubble,
      ]}
    >
      <Text style={styles.messageText}>
        {message.message_text ?? ""}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  bubble: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.xs,
    borderRadius: RADIUS.md,
    maxWidth: "70%",
  },
  ownBubble: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.chatOwnBubble,
  },
  otherBubble: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.chatOtherBubble,
  },
  messageText: {
    color: COLORS.textPrimary,
    flexWrap: "wrap",
  },
})