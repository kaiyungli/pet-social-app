import { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { supabase } from '../../../lib/supabase'
import InviteCard from '../components/InviteCard'
import { useInvites } from '../hooks/useInvites'

export default function InviteInboxScreen() {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
    })
  }, [])

  const { receivedInvites, loading, error, acceptInvite, rejectInvite } =
    useInvites(userId)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Received Invites</Text>

      {loading ? <Text>Loading...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={receivedInvites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <InviteCard
            invite={item}
            mode="received"
            onAccept={acceptInvite}
            onReject={rejectInvite}
          />
        )}
        ListEmptyComponent={!loading ? <Text>No received invites</Text> : null}
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