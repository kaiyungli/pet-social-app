import { View, Text, Pressable, StyleSheet } from 'react-native'
import type { InviteRecord } from '../types/inviteTypes'

type Props = {
  invite: InviteRecord
  mode: 'received' | 'sent'
  onAccept?: (inviteId: string) => void
  onReject?: (inviteId: string) => void
  onCancel?: (inviteId: string) => void
}

export default function InviteCard({
  invite,
  mode,
  onAccept,
  onReject,
  onCancel,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {invite.type === 'walk' ? 'Walk Invite' : 'Playdate Invite'}
      </Text>

      <Text style={styles.meta}>Status: {invite.status}</Text>
      <Text style={styles.meta}>Created: {formatDate(invite.created_at)}</Text>

      {invite.message ? (
        <Text style={styles.message}>Message: {invite.message}</Text>
      ) : null}

      {invite.proposed_time ? (
        <Text style={styles.meta}>
          Proposed Time: {formatDate(invite.proposed_time)}
        </Text>
      ) : null}

      {mode === 'received' && invite.status === 'pending' ? (
        <View style={styles.actionsRow}>
          <Pressable
            style={[styles.button, styles.acceptButton]}
            onPress={() => onAccept?.(invite.id)}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.rejectButton]}
            onPress={() => onReject?.(invite.id)}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </Pressable>
        </View>
      ) : null}

      {mode === 'sent' && invite.status === 'pending' ? (
        <View style={styles.actionsRow}>
          <Pressable
            style={[styles.button, styles.cancelButton]}
            onPress={() => onCancel?.(invite.id)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  )
}

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString()
  } catch {
    return value
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#111827',
    marginTop: 8,
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  acceptButton: {
    backgroundColor: '#16a34a',
  },
  rejectButton: {
    backgroundColor: '#dc2626',
  },
  cancelButton: {
    backgroundColor: '#6b7280',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
})