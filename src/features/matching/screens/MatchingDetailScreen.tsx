import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { supabase } from '../../../lib/supabase'
import InviteButton from '../../invites/components/InviteButton'

export default function MatchingDetailScreen({ route }: any) {
  const pet = route.params?.pet
  const profile = Array.isArray(pet?.profiles)
    ? pet.profiles[0]
    : pet?.profiles

  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [activePetId, setActivePetId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null)
    })
  }, [])

  useEffect(() => {
    if (!currentUserId) return

    async function loadProfile() {
      const { data } = await supabase
        .from('profiles')
        .select('active_pet_id')
        .eq('id', currentUserId)
        .single()

      setActivePetId(data?.active_pet_id ?? null)
    }

    loadProfile()
  }, [currentUserId])

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 12 }}>
        {pet?.name ?? 'Pet Detail'}
      </Text>

      <Text>Breed: {pet?.breed ?? 'N/A'}</Text>
      <Text>Size: {pet?.size ?? 'N/A'}</Text>
      <Text>Can socialize: {pet?.can_socialize ? 'Yes' : 'No'}</Text>
      <Text>Energy: {pet?.energy_level ?? 'N/A'}</Text>
      <Text>Owner: {profile?.display_name ?? 'Unknown'}</Text>
      <Text>Area: {profile?.area_text ?? 'N/A'}</Text>
      <Text>Interests: {pet?.interests_text ?? 'N/A'}</Text>
      <Text>Bio: {pet?.bio ?? 'N/A'}</Text>

      <View style={{ height: 16 }} />

      {currentUserId && activePetId ? (
        <InviteButton
          fromUserId={currentUserId}
          toUserId={pet.owner_id}
          fromPetId={activePetId}
          toPetId={pet.id}
        />
      ) : (
        <Text>Please set an active pet first</Text>
      )}
    </View>
  )
}