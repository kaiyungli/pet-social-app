import { View, Text, Pressable, StyleSheet } from 'react-native'
import type { InviteRecord } from '../types/inviteTypes'

type Props = {
  invite: InviteRecord
  mode: 'received' | 'sent'
  onAccept?: (inviteId: string) => Promise<void>
  onReject?: (inviteId: string) => Promise<void>
  onCancel?: (inviteId: string) => Promise<void>
}

export default function InviteCard({
  invite,
  mode,
  onAccept,
  onReject,
  onCancel,
}: Props) {
  const isPending = invite.status === 'pending'

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{invite.type}</Text>
      <Text>Status: {invite.status}</Text>
      {invite.message ? <Text>{invite.message}</Text> : null}

      {mode === 'received' && isPending ? (
        <View style={styles.row}>
          <Pressable style={styles.secondaryBtn} onPress={() => onReject?.(invite.id)}>
            <Text>Reject</Text>
          </Pressable>
          <Pressable style={styles.primaryBtn} onPress={() => onAccept?.(invite.id)}>
            <Text style={styles.primaryBtnText}>Accept</Text>
          </Pressable>
        </View>
      ) : null}

      {mode === 'sent' && isPending ? (
        <View style={styles.row}>
          <Pressable style={styles.secondaryBtn} onPress={() => onCancel?.(invite.id)}>
            <Text>Cancel</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
  primaryBtn: {
    backgroundColor: '#111827',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  secondaryBtn: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
})