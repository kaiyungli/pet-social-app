import { useState } from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native'
import { useSendInvite } from '../hooks/useSendInvite'
import type { InviteType } from '../types/inviteTypes'

type Props = {
  visible: boolean
  onClose: () => void
  fromUserId: string
  toUserId: string
  fromPetId: string
  toPetId: string
}

export default function InviteModal({
  visible,
  onClose,
  fromUserId,
  toUserId,
  fromPetId,
  toPetId,
}: Props) {
  const { send, loading, error } = useSendInvite()
  const [type, setType] = useState<InviteType>('walk')
  const [message, setMessage] = useState('')
  const [proposedTime, setProposedTime] = useState('')

  async function handleSubmit() {
    try {
      await send({
        from_user_id: fromUserId,
        to_user_id: toUserId,
        from_pet_id: fromPetId,
        to_pet_id: toPetId,
        type,
        message,
        proposed_time: proposedTime || null,
      })

      setMessage('')
      setProposedTime('')
      setType('walk')
      onClose()
    } catch {
      // error handled in hook
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Send Invite</Text>

          <View style={styles.typeRow}>
            <Pressable
              style={[
                styles.typeButton,
                type === 'walk' && styles.typeButtonActive,
              ]}
              onPress={() => setType('walk')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  type === 'walk' && styles.typeButtonTextActive,
                ]}
              >
                Walk
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.typeButton,
                type === 'playdate' && styles.typeButtonActive,
              ]}
              onPress={() => setType('playdate')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  type === 'playdate' && styles.typeButtonTextActive,
                ]}
              >
                Playdate
              </Text>
            </Pressable>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Optional message"
            value={message}
            onChangeText={setMessage}
          />

          <TextInput
            style={styles.input}
            placeholder="Optional proposed time (ISO string for now)"
            value={proposedTime}
            onChangeText={setProposedTime}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.actionRow}>
            <Pressable style={styles.secondaryButton} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Close</Text>
            </Pressable>

            <Pressable
              style={[styles.primaryButton, loading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Sending...' : 'Send Invite'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 16,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  typeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  typeButtonText: {
    color: '#111827',
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  errorText: {
    color: '#dc2626',
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  secondaryButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
})