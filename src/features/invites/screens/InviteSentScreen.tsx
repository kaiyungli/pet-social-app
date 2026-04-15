import { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { supabase } from '../../../lib/supabase'
import InviteCard from '../components/InviteCard'
import { useInvites } from '../hooks/useInvites'

export default function InviteSentScreen() {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
    })
  }, [])

  const { sentInvites, loading, error, cancelInvite } = useInvites(userId)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sent Invites</Text>

      {loading ? <Text>Loading...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={sentInvites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <InviteCard invite={item} mode="sent" onCancel={cancelInvite} />
        )}
        ListEmptyComponent={!loading ? <Text>No sent invites</Text> : null}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  error: {
    color: '#dc2626',
    marginBottom: 12,
  },
})