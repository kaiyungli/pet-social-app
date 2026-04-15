import { useState } from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
import InviteModal from './InviteModal'

type Props = {
  fromUserId: string
  toUserId: string
  fromPetId: string
  toPetId: string
}

export default function InviteButton({
  fromUserId,
  toUserId,
  fromPetId,
  toPetId,
}: Props) {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <Pressable style={styles.button} onPress={() => setVisible(true)}>
        <Text style={styles.buttonText}>Invite</Text>
      </Pressable>

      <InviteModal
        visible={visible}
        onClose={() => setVisible(false)}
        fromUserId={fromUserId}
        toUserId={toUserId}
        fromPetId={fromPetId}
        toPetId={toPetId}
      />
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
})