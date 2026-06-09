import { useEffect, useRef, useState } from "react"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native"

import { supabase } from "../../../lib/supabase"
import { useChatMessages } from "../hooks/useChatMessages"
import ChatMessageBubble from "../components/ChatMessageBubble"
import ChatInputBar from "../components/ChatInputBar"
import { SPACING } from "../../../constants/spacing"
import { COLORS } from "../../../constants/colors"
import type { ChatMessage } from "../chatTypes"
import type { RootStackParamList } from "../../../navigation/navigationTypes"

type Props = NativeStackScreenProps<RootStackParamList, "ThreadDetail">

export default function ThreadDetailScreen({ route }: Props) {
  const { threadId } = route.params

  const [userId, setUserId] = useState<string | null>(null)
  const [userLoading, setUserLoading] = useState(true)

  const flatListRef = useRef<FlatList<ChatMessage>>(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()

        if (error || !data?.user) {
          console.error("Failed to get user", error)
          return
        }

        setUserId(data.user.id)
      } finally {
        setUserLoading(false)
      }
    }

    loadUser()
  }, [])

  const { messages, loading, error, appendMessage } = useChatMessages(
    threadId,
    userId
  )

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToEnd({ animated: true })
    })
  }

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages])

  if (userLoading) {
    return (
      <View style={styles.centerState}>
        <Text>Loading user...</Text>
      </View>
    )
  }

  if (!userId) {
    return (
      <View style={styles.centerState}>
        <Text>User not found</Text>
      </View>
    )
  }

  if (loading && messages.length === 0) {
    return (
      <View style={styles.centerState}>
        <Text>Loading messages...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centerState}>
        <Text>{error}</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <View style={styles.container}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={scrollToBottom}
            renderItem={({ item }) => (
              <ChatMessageBubble
                message={item}
                isOwnMessage={item.sender_user_id === userId}
              />
            )}
            ListEmptyComponent={
              <View style={styles.centerState}>
                <Text>No messages yet</Text>
              </View>
            }
          />

          <ChatInputBar
            threadId={threadId}
            senderUserId={userId}
            onMessageSent={(message) => {
              appendMessage(message)
              scrollToBottom()
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  listContent: {
    padding: SPACING.lg,
    flexGrow: 1,
  },
})