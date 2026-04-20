import { View, Text, Pressable, StyleSheet } from 'react-native'
import type { InviteRecord } from '../types/inviteTypes'

type Props = {
  invite: InviteRecord
  mode: 'received' | 'sent'
  onAccept?: (inviteId: string) => Promise<void>
  onReject?: (inviteId: string) => Promise<void>
  onCancel?: (inviteId: string) => Promise<void>
  loading?: boolean
}

export default function InviteListItem({
  invite,
  mode,
  onAccept,
  onReject,
  onCancel,
  loading = false,
}: Props) {
  const isPending = invite.status === 'pending'

  return (
    <View style={styles.card}>
      <Text style={styles.type}>{invite.type === 'walk' ? 'Walk' : 'Playdate'}</Text>
      <Text style={styles.meta}>Status: {invite.status}</Text>
      <Text style={styles.meta}>Created: {new Date(invite.created_at).toLocaleString()}</Text>

      {invite.message ? (
        <Text style={styles.message}>{invite.message}</Text>
      ) : (
        <Text style={styles.emptyMessage}>No message</Text>
      )}

      {mode === 'received' && isPending ? (
        <View style={styles.actionRow}>
          <Pressable
            style={[styles.secondaryButton, loading && styles.disabledButton]}
            disabled={loading}
            onPress={() => onReject?.(invite.id)}
          >
            <Text style={styles.secondaryButtonText}>Reject</Text>
          </Pressable>

          <Pressable
            style={[styles.primaryButton, loading && styles.disabledButton]}
            disabled={loading}
            onPress={() => onAccept?.(invite.id)}
          >
            <Text style={styles.primaryButtonText}>Accept</Text>
          </Pressable>
        </View>
      ) : null}

      {mode === 'sent' && isPending ? (
        <View style={styles.actionRow}>
          <Pressable
            style={[styles.secondaryButton, loading && styles.disabledButton]}
            disabled={loading}
            onPress={() => onCancel?.(invite.id)}
          >
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  type: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111827',
  },
  meta: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  message: {
    marginTop: 10,
    fontSize: 14,
    color: '#111827',
  },
  emptyMessage: {
    marginTop: 10,
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 14,
  },
  primaryButton: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  secondaryButton: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#f3f4f6',
  },
  secondaryButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
})