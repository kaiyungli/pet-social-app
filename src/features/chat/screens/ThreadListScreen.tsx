import { useEffect, useState } from "react"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import {
    View,
    Text,
    FlatList,
    Pressable,
    StyleSheet,
    Image,
} from "react-native"
import { supabase } from "../../../lib/supabase"
import { useChatThreads } from "../hooks/useChatThreads"
import { COLORS } from "../../../constants/colors"
import { SPACING } from "../../../constants/spacing"
import { RADIUS } from "../../../constants/radius"
import type { ThreadListItem } from "../chatTypes"

import type { RootStackParamList } from "../../../navigation/navigationTypes"

type Props = NativeStackScreenProps<RootStackParamList, "ThreadList">

export default function ThreadListScreen({ navigation }: Props) {
    const [userId, setUserId] = useState<string | null>(null)
    const [userLoading, setUserLoading] = useState(true)

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

    const { threads, loading, error, refetch } = useChatThreads(userId)

    if (userLoading || loading) {
        return (
            <View style={styles.centerState}>
                <Text>Loading chats...</Text>
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

    if (error) {
        return (
            <View style={styles.centerState}>
                <Text>{error}</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={threads}
                keyExtractor={(item) => item.threadId}
                contentContainerStyle={styles.listContent}
                refreshing={loading}
                onRefresh={refetch}
                renderItem={({ item }) => (
                    <ThreadListRow
                        thread={item}
                        onPress={() => {
                            navigation.navigate("ThreadDetail", {
                                threadId: item.threadId,
                            })
                        }}
                    />
                )}
                ListEmptyComponent={
                    <View style={styles.centerState}>
                        <Text>No chats yet</Text>
                    </View>
                }
            />
        </View>
    )
}

type ThreadListRowProps = {
    thread: ThreadListItem
    onPress: () => void
}

function ThreadListRow({ thread, onPress }: ThreadListRowProps) {
    const avatarUrl = thread.peerPet?.photo_url ?? thread.peerUser.avatar_url
    const title = thread.peerPet?.name ?? thread.peerUser.display_name
    const subtitle = thread.lastMessageText ?? "No messages yet"

    return (
        <Pressable style={styles.row} onPress={onPress}>
            {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
                <View style={styles.avatarFallback}>
                    <Text style={styles.avatarFallbackText}>
                        {title.slice(0, 1).toUpperCase()}
                    </Text>
                </View>
            )}

            <View style={styles.content}>
                <View style={styles.topLine}>
                    <Text style={styles.title} numberOfLines={1}>
                        {title}
                    </Text>

                    {thread.lastMessageAt ? (
                        <Text style={styles.time}>
                            {formatThreadTime(thread.lastMessageAt)}
                        </Text>
                    ) : null}
                </View>

                <View style={styles.bottomLine}>
                    <Text style={styles.subtitle} numberOfLines={1}>
                        {subtitle}
                    </Text>

                    {thread.unreadCount > 0 ? (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{thread.unreadCount}</Text>
                        </View>
                    ) : null}
                </View>
            </View>
        </Pressable>
    )
}

function formatThreadTime(value: string) {
    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return ""
    }

    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    })
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    listContent: {
        flexGrow: 1,
        padding: SPACING.lg,
    },
    centerState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: SPACING.lg,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: RADIUS.pill,
        marginRight: SPACING.md,
    },
    avatarFallback: {
        width: 52,
        height: 52,
        borderRadius: RADIUS.pill,
        marginRight: SPACING.md,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.chatOtherBubble,
    },
    avatarFallbackText: {
        color: COLORS.textPrimary,
        fontWeight: "700",
        fontSize: 18,
    },
    content: {
        flex: 1,
    },
    topLine: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: SPACING.xs,
    },
    title: {
        flex: 1,
        color: COLORS.textPrimary,
        fontWeight: "700",
        fontSize: 16,
        marginRight: SPACING.sm,
    },
    time: {
        color: COLORS.textSecondary,
        fontSize: 12,
    },
    bottomLine: {
        flexDirection: "row",
        alignItems: "center",
    },
    subtitle: {
        flex: 1,
        color: COLORS.textSecondary,
        fontSize: 14,
        marginRight: SPACING.sm,
    },
    unreadBadge: {
        minWidth: 22,
        height: 22,
        paddingHorizontal: SPACING.xs,
        borderRadius: RADIUS.pill,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.chatOwnBubble,
    },
    unreadText: {
        color: COLORS.textPrimary,
        fontSize: 12,
        fontWeight: "700",
    },
})