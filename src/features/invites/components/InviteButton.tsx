import { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import InviteModal from '../../invites/components/InviteModal'
import { useInvites } from '../../invites/hooks/useInvites'

type Props = {
  currentUserId: string
  activePetId: string
  targetUserId: string
  targetPetId: string
}

export default function PublicPetDetailInviteSection({
  currentUserId,
  activePetId,
  targetUserId,
  targetPetId,
}: Props) {
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false)
  const { sendInvite, loading, error } = useInvites(currentUserId)

  async function handleSubmitInvite(values: {
    type: 'walk' | 'playdate'
    message?: string
  }) {
    await sendInvite({
      fromUserId: currentUserId,
      toUserId: targetUserId,
      fromPetId: activePetId,
      toPetId: targetPetId,
      type: values.type,
      message: values.message,
    })
  }

  return (
    <View>
      <Pressable onPress={() => setIsInviteModalVisible(true)}>
        <Text>Invite</Text>
      </Pressable>

      <InviteModal
        visible={isInviteModalVisible}
        onClose={() => setIsInviteModalVisible(false)}
        onSubmit={handleSubmitInvite}
        loading={loading}
        error={error}
      />
    </View>
  )
}