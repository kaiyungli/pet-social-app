import { useState } from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native'
import type { InviteType } from '../types/inviteTypes'

type Props = {
  visible: boolean
  onClose: () => void
  onSubmit: (payload: { type: InviteType; message?: string }) => Promise<void>
  loading?: boolean
  error?: string | null
}

export default function InviteModal({
  visible,
  onClose,
  onSubmit,
  loading = false,
  error = null,
}: Props) {
  const [type, setType] = useState<InviteType>('walk')
  const [message, setMessage] = useState('')

  function resetForm() {
    setType('walk')
    setMessage('')
  }

  function handleClose() {
    resetForm()
    onClose()
  }

  async function handleSubmit() {
    if (loading) return

    const cleanedMessage = message.trim()

    try {
      await onSubmit({
        type,
        message: cleanedMessage || undefined,
      })
      handleClose()
    } catch {
      // error handled by parent hook
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
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
            multiline
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.actionRow}>
            <Pressable style={styles.secondaryButton} onPress={handleClose}>
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
    minHeight: 88,
    textAlignVertical: 'top',
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